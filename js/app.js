const API_KEY = "8c8e1a50-6322-4135-8875-5d40a5420d86";
const API_URL_POPULAR =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";

const API_URL_SEARCH =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

const API_URL_MOVIE_DETAIL =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/";

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
        alt="${movie.nameRu}"
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

    movieEl.addEventListener("click", () => openModal(movie.filmId));
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

// Modal
const modalEl = document.querySelector(".modal");

async function openModal(id) {
  const resp = await fetch(API_URL_MOVIE_DETAIL + id, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });

  const data = await resp.json();

  modalEl.classList.add("modal__show");
  modalEl.innerHTML = `
  <div class="modal__card">
    <img class="modal__movie--backdrop" src="${data.posterUrlPreview}" alt="" />
    <h2>
      <span class="modal__movie-title">${data.nameRu}</span>
      <span class="modal__movie-release-year">${data.year}</span>
    </h2>
    <ul class="modal__movie-info">
      <div class="loader"></div>
      <li class="modal__movie-genre">Жанр: ${data.genres.map(
        (el) => `<span> ${el.genre}</span>`
      )}</li>
      ${
        data.filmLength
          ? `<li class="modal__movie-runtime">Время: ${data.filmLength} минут</li>`
          : ""
      }
      <li>Сайт: <a class="modal__movie-site" href="${data.webUrl}">${
    data.webUrl
  }</a></li>
      <li class="modal__movie-overview">Описание: ${data.description}</li>
    </ul>
    <button type="button" class="modal__button-close">Закрыть</button>
  </div>
`;

  const modalCloseBtn = document.querySelector(".modal__button-close");
  modalCloseBtn.addEventListener("click", () => closeModal());
}

const closeModal = () => {
  modalEl.classList.remove("modal__show");
};

window.addEventListener("click", (e) => {
  if (e.target == modalEl) closeModal();
});
