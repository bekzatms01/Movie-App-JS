const API_KEY = "8c8e1a50-6322-4135-8875-5d40a5420d86";
const API_URL_POPULAR =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";

const API_URL_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

getMovies(API_URL_POPULAR);
async function getMovies(url) {
  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });

  const respData = await resp.json();
  showMovies(respData);
}

function showMovies(data) {
  const moviesEl = document.querySelector(".movies");
  document.querySelector(".movies").innerHTML = "";

  data.films.forEach((movie) => {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie__card");
    movieEl.innerHTML += `
    <div class="movie__cover--inner">
      <img
        class="movie__img"
        src="${movie.posterUrlPreview}"
        alt="Movie1"
      />
      <div class="movie__cover--darkened"></div>
    </div>
    <div class="movie__info">
      <div class="movie__title">${movie.nameRu}</div>
      <div class="movie__genre">${movie.genres.map(
        (genre) => ` ${genre.genre}`
      )}</div>
      <div class="movie__rating movie__rating--${calcRating(movie.rating)}">
        ${movie.rating}
      </div>
    </div>
    `;
    moviesEl.appendChild(movieEl);
  });
}

function calcRating(vote) {
  if (vote > 7.5) {
    return "green";
  } else if (vote > 5) {
    return "orange";
  } else {
    return "red";
  }
}

const form = document.querySelector("form");
const search = document.querySelector(".header__search");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const apiSearch = `${API_URL_SEARCH}${search.value}`;
  if (search.value) {
    getMovies(apiSearch);
    search.value = "";
  }
});
