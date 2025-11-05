const API_KEY = "b73d163b6a83e333335519c860ae8875"; // Replace with your GNews key
const newsContainer = document.getElementById("newsContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const categoryButtons = document.querySelectorAll(".category-btn");

// Load default news when the page loads
window.addEventListener("load", () => fetchTopHeadlines("general"));

// 🔹 Search functionality
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) fetchNewsByQuery(query);
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) fetchNewsByQuery(query);
  }
});

// 🔹 Category button click
categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    fetchTopHeadlines(btn.dataset.category);
  });
});

// 🔹 Fetch top headlines (category-wise)
async function fetchTopHeadlines(category = "general") {
  const originalUrl = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=in&max=10&apikey=${API_KEY}`;
  const url = `https://api.allorigins.win/get?url=${encodeURIComponent(originalUrl)}`;
  try {
    const res = await fetch(url);
    const wrappedData = await res.json();
    const data = JSON.parse(wrappedData.contents);
    displayNews(data.articles);
  } catch (error) {
    showError("Error loading news. Please try again later.");
  }
}

// 🔹 Fetch news by search query
async function fetchNewsByQuery(query) {
  const originalUrl = `https://gnews.io/api/v4/search?q=${query}&lang=en&country=in&max=10&apikey=${API_KEY}`;
  const url = `https://api.allorigins.win/get?url=${encodeURIComponent(originalUrl)}`;
  try {
    const res = await fetch(url);
    const wrappedData = await res.json();
    const data = JSON.parse(wrappedData.contents);
    displayNews(data.articles);
  } catch (error) {
    showError("Error fetching search results.");
  }
}

// 🔹 Display fetched articles
function displayNews(articles) {
  newsContainer.innerHTML = "";
  if (!articles || articles.length === 0) {
    showError("No news articles found. Try another topic.");
    return;
  }

  articles.forEach((article) => {
    const card = document.createElement("div");
    card.classList.add("news-card");
    card.innerHTML = `
      <img src="${article.image || "https://via.placeholder.com/400x200"}" alt="News Image">
      <div class="news-content">
        <h3>${article.title}</h3>
        <p>${article.description || ""}</p>
        <a href="${article.url}" target="_blank">Read More →</a>
      </div>
    `;
    newsContainer.appendChild(card);
  });
}

// 🔹 Error message function
function showError(message) {
  newsContainer.innerHTML = `<p style="text-align:center; color:#555; font-size:1rem;">${message}</p>`;
}

