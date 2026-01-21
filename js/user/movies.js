import { imagePaths } from "../filepaths.js";

let currentMoviesRef = document.getElementById("currentMoviesList");
let upcommingMovieRef = document.getElementById("upcommingMoviesList");
let languageListRef = document.getElementById("language-list");
let genereListRef = document.getElementById("geners-list");
let formatListRef = document.getElementById("format-list");
let movies = getFromLocalStorage("movies");
currentMoviesRef.innerHTML = "";
upcommingMovieRef.innerHTML = "";
let currentMovies = [];
let upcommingMovies = [];

movies.data.forEach((movie) => {
  if (movie.releaseDate >= new Date().toISOString()) {
    upcommingMovies.push(movie);
  } else {
    currentMovies.push(movie);
  }
});

let currentMoviesContainer = "";
currentMovies.forEach((movie) => {
  currentMoviesContainer += `
      <div class="card">
          <div class="frame-2x2">
              <a href="single_movie.html">
                  <img src="${imagePaths.posterImagePath + movie.posterImage}"
                      class="w-100 frame-2x2 rounded-2" alt="${movie.posterImage}">
              </a>
          </div>
          <div class="card-body">
              <h5 class="card-title text-break" style="width:9rem;">${movie.name}</h5>
              <p class="card-text"><small class="text-body-secondary">Release: ${movie.releaseDate}</small></p>
          </div>
      </div>`;
});
currentMoviesRef.innerHTML = currentMoviesContainer;

let upcommingMoviesContainer = "";
upcommingMovies.forEach((movie) => {
  upcommingMoviesContainer += `
      <div class="card">
          <div class="frame-2x2">
              <a href="single_movie.html">
                  <img src="${imagePaths.posterImagePath + movie.posterImage}"
                      class="w-100 frame-2x2 rounded-2" alt="${movie.posterImage}">
              </a>
          </div>
          <div class="card-body">
              <h5 class="card-title text-break" style="width:9rem;">${movie.name}</h5>
              <p class="card-text"><small class="text-body-secondary">Release: ${movie.releaseDate}</small></p>
          </div>
      </div>`;
});
upcommingMovieRef.innerHTML = upcommingMoviesContainer;

console.log("languageListRef:", languageListRef);

let languageList = getlanguages();
function getMovieByLanguage(language) {
  console.log(language);
}
languageListRef.innerHTML = "";
languageList.forEach((language) => {
  let btnId = language + "-check-btn";
  languageListRef.innerHTML += `
    <input type="checkbox" class="btn-check"
    data-language="${language}" 
        id="${btnId}"
        autocomplete="off">
    <label class="btn btn-outline-secondary"
        for="${btnId}">${language}</label>
    `;
});

languageListRef.addEventListener("change", (e) => {
  console.log(e.target);
  if (e.target.matches(".btn-check")) {
    getMovieByLanguage(e.target.dataset.language);
  }
});

let generList = getGeners();
genereListRef.innerHTML = "";
generList.forEach((genere) => {
  genereListRef.innerHTML += `
    <input type="checkbox" class="btn-check" 
        id="${genere}-check-btn"
        autocomplete="off">
    <label class="btn btn-outline-secondary"
        for="${genere}-check-btn">${genere}</label>
    `;
});
