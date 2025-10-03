let urls = JSON.parse(localStorage.getItem("urls")) || [];

function saveData() {
  localStorage.setItem("urls", JSON.stringify(urls));
  renderUrls();
}

function generateShortCode() {
  return Math.random().toString(36).substring(2, 8);
}

function shortenUrl() {
  const longUrl = document.getElementById("longUrl").value.trim();
  if (!longUrl) {
    alert("Please enter a URL!");
    return;
  }

  const shortCode = generateShortCode();
  const shortUrl = `${window.location.origin}/?${shortCode}`;

  urls.push({ longUrl, shortUrl });
  document.getElementById("longUrl").value = "";
  saveData();
}

function copyUrl(shortUrl) {
  navigator.clipboard.writeText(shortUrl);
  alert("Copied to clipboard!");
}

function renderUrls() {
  const list = document.getElementById("urlList");
  list.innerHTML = "";

  urls.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${item.shortUrl}</span>
                    <button onclick="copyUrl('${item.shortUrl}')">Copy</button>`;
    list.appendChild(li);
  });
}

// Initial render
renderUrls();
