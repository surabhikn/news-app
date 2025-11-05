const API_KEY = "b73d163b6a83e333335519c860ae8875"; // Replace with your GNews key
const newsContainer = document.getElementById("newsContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const categoryButtons = document.querySelectorAll(".category-btn");

// Load default news
window.addEventListener("load", () => fetchTopHeadlines("general"));

// Search
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

// Categories
categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    fetchTopHeadlines(btn.dataset.category);
  });
});

// Fetch top headlines (by category)
async function fetchTopHeadlines(category = "general") {
  const url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=in&max=10&apikey=${API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    displayNews(data.articles);
  } catch (error) {
    showError("Error loading news. Try again later.");
  }
}

// Fetch by search query
async function fetchNewsByQuery(query) {
  const url = `https://gnews.io/api/v4/search?q=${query}&lang=en&country=in&max=10&apikey=${API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    displayNews(data.articles);
  } catch (error) {
    showError("Error fetching search results.");
  }
}

// Display articles
function displayNews(articles) {
  newsContainer.innerHTML = "";
  if (!articles || articles.length === 0) {
    showError("No news articles found. Try a different topic.");
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

// Error message
function showError(message) {
  newsContainer.innerHTML = `<p style="text-align:center;color:#555;">${message}</p>`;
}

