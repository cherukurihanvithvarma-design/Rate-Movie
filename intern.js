const OMDB_API_KEY = "63ba6556"; 

const searchBtn = document.getElementById("searchBtn");
const reviewsBtn = document.getElementById("reviewsBtn");

searchBtn.addEventListener("click", searchMovies);
reviewsBtn.addEventListener("click", showReviews);

async function searchMovies() {
  const query = document.getElementById("searchInput").value.trim();
  const resultsDiv = document.getElementById("results");

  if (!query) {
    resultsDiv.innerHTML = `<p class="message">Please enter a movie title to search.</p>`;
    return;
  }

  resultsDiv.innerHTML = `<p class="message">🔍 Searching for "${query}"...</p>`;

  const omdbUrl = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}`;
  const res = await fetch(omdbUrl);
  const data = await res.json();

  if (data.Response === "True") {
    displayResults(data.Search);
  } else {
    resultsDiv.innerHTML = `<p class="message">😕 No matches found for "${query}". Try another title.</p>`;
  }
}

function displayResults(movies) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";
  movies.forEach(movie => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Image"}" alt="${movie.Title}" />
      <h3>${movie.Title}</h3>
      <p>📅 ${movie.Year}</p>
      <div class="review-section">
        <textarea placeholder="Write your thoughts about this movie..."></textarea>
        <select>
          <option value="">⭐ Rate this movie</option>
          <option>⭐</option>
          <option>⭐⭐</option>
          <option>⭐⭐⭐</option>
          <option>⭐⭐⭐⭐</option>
          <option>⭐⭐⭐⭐⭐</option>
        </select>
        <button onclick="saveReview('${movie.imdbID}', this)">💾 Save Review</button>
      </div>
    `;
    resultsDiv.appendChild(card);
  });
}

function saveReview(movieId, btn) {
  const card = btn.closest(".card");
  const review = card.querySelector("textarea").value.trim();
  const rating = card.querySelector("select").value;
  const title = card.querySelector("h3").innerText;

  if (!review && !rating) {
    alert("Please write something or give a rating before saving!");
    return;
  }

  let reviews = JSON.parse(localStorage.getItem("movieReviews")) || {};
  reviews[movieId] = { title, review, rating };
  localStorage.setItem("movieReviews", JSON.stringify(reviews));
  alert("✅ Review saved successfully!");
}

function showReviews() {
  const reviews = JSON.parse(localStorage.getItem("movieReviews")) || {};
  if (Object.keys(reviews).length === 0) {
    alert("You haven’t written any reviews yet.");
    return;
  }

  let reviewText = "🎬 Your Saved Reviews:\n\n";
  for (const [id, { title, review, rating }] of Object.entries(reviews)) {
    reviewText += `Movie: ${title}\nRating: ${rating || "N/A"}\nReview: ${review || "N/A"}\n\n`;
  }
  alert(reviewText);
}
