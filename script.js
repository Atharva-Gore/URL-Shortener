document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('shortener-form');
    const longUrlInput = document.getElementById('long-url');
    const resultContainer = document.getElementById('result-container');
    const shortUrlLink = document.getElementById('short-url');
    const copyButton = document.getElementById('copy-btn');
    const errorMessage = document.getElementById('error-message');
    const shortenButton = document.getElementById('shorten-btn');

    // **IMPORTANT:** Replace with your actual API endpoint and key if needed.
    // This is a common pattern for using a third-party service.
    const TINYURL_API_URL = 'https://api.tinyurl.com/create';
    const API_TOKEN = 'YOUR_TINYURL_API_TOKEN'; // Replace with your actual token

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const longUrl = longUrlInput.value.trim();

        // Basic client-side validation
        if (!longUrl || !longUrl.startsWith('http')) {
            showError('Please enter a valid URL (must start with http:// or https://)');
            return;
        }

        // Reset previous results/errors
        resultContainer.classList.add('hidden');
        errorMessage.classList.add('hidden');
        shortenButton.disabled = true;
        shortenButton.textContent = 'Shortening...';

        try {
            const response = await fetch(TINYURL_API_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_TOKEN}` // Authorization header for TinyURL
                },
                body: JSON.stringify({
                    url: longUrl,
                    domain: 'tinyurl.com' // Optional: Specify a domain
                })
            });

            const data = await response.json();

            if (data && data.data && data.data.tiny_url) {
                const shortenedUrl = data.data.tiny_url;
                shortUrlLink.href = shortenedUrl;
                shortUrlLink.textContent = shortenedUrl;
                resultContainer.classList.remove('hidden');
            } else if (data.errors && data.errors.length > 0) {
                 // Display specific API error
                showError(`API Error: ${data.errors[0].message}`);
            } else {
                showError('Failed to shorten the URL. Check API response.');
            }

        } catch (error) {
            console.error('Error:', error);
            showError('An unexpected error occurred while connecting to the API.');
        } finally {
            shortenButton.disabled = false;
            shortenButton.textContent = 'Shorten It';
        }
    });

    copyButton.addEventListener('click', () => {
        const shortUrl = shortUrlLink.textContent;
        navigator.clipboard.writeText(shortUrl).then(() => {
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = 'Copy';
            }, 2000);
        }).catch(err => {
            console.error('Could not copy text: ', err);
            showError('Failed to copy. Please copy manually.');
        });
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }
});
