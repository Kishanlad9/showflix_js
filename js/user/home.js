import { imagePaths } from "../filepaths.js";

let navMovieSlider = document.getElementById("nav-movie-slider");
navMovieSlider.innerHTML = "";

let movies = getFromLocalStorage("movies");
let cinemas = getFromLocalStorage("cinemas");

let movieSlideContent = "";
movies.data.forEach((movie) => {
  movieSlideContent += `
  <div class="swiper-slide red-gradient-left">
        <div class="row align-items-center justify-content-center">
            <div class="col-6 ">
                <div class="container">
                    <div class="col-10 text-white g-y-3 poster-details">
                        <h2>${movie.name}</h2>
                        <p>Release date: ${movie.releaseDate}</p>
                        <h3>${movie.certifiedFor} |
                            ${movie.movieLength} |
                            ${
                              Array.isArray(movie.languages)
                                ? movie.languages.join(" | ")
                                : movie.languages
                            }

                        </h3>
                        <a href="./single_movie.html"><button
                                class="btn bg-transperent btn-outline-danger w-25">Book
                                Now</button></a>
                    </div>
                </div>
            </div>
            <div class="col-4 frame-4x4">
                <img src="${
                  imagePaths.posterImagePath + movie.posterImage
                }" alt="" class="w-100 object-fit-scale">
            </div>
        </div>
    </div>
  `;
});
navMovieSlider.innerHTML = movieSlideContent;

let newMoviesSlider = document.getElementById("newMovieSlider");
newMoviesSlider.innerHTML = "";
let newMovieContainer = "";
movies.data.forEach((movie) => {
  newMovieContainer += `
   <div class="swiper-slide border border-2 rounded-2 border-secondary shadow">
        <div class="d-flex flex-wrap   popup-transition">
            <div class="frame-4x4">
                <a href="./single_movie.html"><img
                        src="${imagePaths.posterImagePath + movie.posterImage}"
                        class="w-100 h-100 rounded-2" alt=""></a>
            </div>
        </div>
    </div>
    `;
});
newMoviesSlider.innerHTML = newMovieContainer;

let trailerIframe = document.getElementById("trailer-iframe");
trailerIframe.innerHTML = "";
let trailerPoster = document.getElementById("trailerPoster");
trailerPoster.innerHTML = "";
let trailerPosterContainer = "";
let trailerContainer = "";

movies.data.forEach((movie) => {
  let url = movie.trailerLink;
  let videoId = new URL(url).searchParams.get("v");
  trailerContainer += `
    <div class="swiper-slide">
        <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=0&amp;mute=1">
        </iframe>
    </div>
    `;

  trailerPosterContainer += `
     <div class="swiper-slide frame-2x2">
        <img src="${
          imagePaths.posterImagePath + movie.posterImage
        }" class="frame-2x2" />
    </div>
    `;
});
trailerIframe.innerHTML = trailerContainer;
trailerPoster.innerHTML = trailerPosterContainer;

const heroSwiper = new Swiper(".mySwiper", {
  loop: true,
  navigation: {
    nextEl: ".hero-next",
    prevEl: ".hero-prev",
  },
});

const movieSwiper = new Swiper(".mySwiper1", {
  slidesPerView: 4,
  spaceBetween: 20,
  breakpoints: {
    200: { slidesPerView: 1 },
    640: { slidesPerView: 2 },
    1024: { slidesPerView: 4 },
  },
});

const trailerThumbs = new Swiper(".mySwiper2", {
  loop: true,
  spaceBetween: 10,
  slidesPerView: 5,
  watchSlidesProgress: true,
  navigation: {
    nextEl: ".trailer-next",
    prevEl: ".trailer-prev",
  },
});

const trailerMain = new Swiper(".mySwiper3", {
  loop: true,
  spaceBetween: 10,
  thumbs: {
    swiper: trailerThumbs,
  },
});
