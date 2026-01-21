// const session = getFromLocalStorage("loggedInUser");

// if (!session || session.role !== "admin") {
//   location.href = "../login.html";
// }

import { imagePaths } from "../filepaths.js";

const movieForm = document.getElementById("movieForm");
let editMovieId = null;

function setEditMovieIdNull() {
  editMovieId = null;
}

let movieURL = "http://127.0.0.1:5500/json/movie.json";
const fetchMovieData = async () => {
  try {
    let response = await fetch(movieURL);
    let data = await response.json();
    console.log("Fetching data from json file");
    saveToLocalStorage("movies", data);
  } catch (error) {
    console.log("Error in fetching movie data:", error);
  }
};

if (!getFromLocalStorage("movies")) {
  fetchMovieData() || [];
}

let languagesListRef = document.getElementById("language-list");
generateDropdownCheckbox(languagesListRef, getlanguages, "movieLanguage");

let genersListRef = document.getElementById("geners-list");
generateDropdownCheckbox(genersListRef, getGeners, "movieGeners");

const movieModal = document.getElementById("movieModel");
// Bootstrap fires a hidden.bs.modal event every time the modal is fully closed (Close button, backdrop click, ESC — all covered).
movieModal.addEventListener("hidden.bs.modal", () => {
  editMovieId = null;
  movieForm.reset();
  moviePosterPreview.innerHTML = "No Image Selected 😐";
  // reset checkboxes
  document
    .querySelectorAll(
      "#language-list input[type='checkbox'], #geners-list input[type='checkbox']"
    )
    .forEach((cb) => (cb.checked = false));
});

// Movie select and preview logic
const moviePosterRef = document.getElementById("moviePoster");
let moviePosterPreview = document.getElementById("moviePosterPreview");
moviePosterRef.addEventListener("change", (e) => {
  const file = moviePosterRef;
  if (!file.files || !file.files[0]) {
    moviePosterPreview.innerHTML = "No Image Selected 😐";
    return;
  } else {
    const reader = new FileReader();
    reader.onload = function (e) {
      moviePosterPreview.innerHTML = `<img src="${e.target.result}" class="p-1 frame-2x2"/>`;
    };
    reader.readAsDataURL(file.files[0]);
  }
});

function displayMovies() {
  editMovieId = null;
  moviePosterPreview.innerHTML = "No Image Selected 😐";
  movieForm.reset();
  let movies = getFromLocalStorage("movies");
  let movieList = document.getElementById("movie-list");
  movieList.innerHTML = "";
  movies.data.forEach((movie) => {
    let tr = document.createElement("tr");
    tr.innerHTML = `
    <div class="card frame-3x3 border border-2 rounded-2">
    <img src="${imagePaths.posterImagePath}${movie.posterImage}" class="w-100 height-200 rounded-2" alt="${movie.name}" />
        <div class="card-body d-flex flex-column justify-content-between align-items-center">
            <h5 class="card-title">${movie.name}</h5>
            <div class="">
            <button class="btn btn-sm btn-secondary editMovie-btn" data-bs-toggle="modal"
                            data-bs-target="#movieModel">Edit</button>
          <button class="btn btn-sm btn-danger deleteMovie-btn" 
          >Delete</button>
          </div>
        </div>
    </div>
      
    `;
    tr.querySelector(".editMovie-btn").addEventListener("click", () =>
      updateMovie(movie.id)
    );

    tr.querySelector(".deleteMovie-btn").addEventListener("click", () =>
      deleteMovie(movie.id)
    );

    movieList.appendChild(tr);
  });
}

function updateMovie(id) {
  let movie = getFromLocalStorage("movies").data.find(
    (movie) => movie.id == id
  );
  document.getElementById("movieName").value = movie.name;
  document.getElementById("certifiedFor").value = movie.certifiedFor;
  document
    .querySelectorAll("#language-list input[type='checkbox']")
    .forEach((checkbox) => {
      if (movie.languages.includes(checkbox.value)) {
        checkbox.checked = true;
      } else {
        checkbox.checked = false;
      }
    });
  document.getElementById("releaseDate").value = movie.releaseDate;
  document.getElementById("movieTime").value = movie.movieLength;
  document
    .querySelectorAll("#geners-list input[type='checkbox']")
    .forEach((checkbox) => {
      if (movie.geners.includes(checkbox.value)) {
        checkbox.checked = true;
      } else {
        checkbox.checked = false;
      }
    });
  document.getElementById("movieDescription").value = movie.description;
  document.getElementById("trailerURL").value = movie.trailerLink;
  moviePosterPreview.innerHTML = `<img src="${
    imagePaths.posterImagePath + movie.posterImage
  }" class="frame-2x2 rounded-2">`;
  editMovieId = id;
}

function deleteMovie(id) {
  let movies = getFromLocalStorage("movies");
  movies.data = movies.data.filter((movie) => movie.id !== id);
  saveToLocalStorage("movies", movies);
  displayMovies();
}

movieForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let movies = getFromLocalStorage("movies") || [];
  const formData = new FormData(movieForm);
  const file = moviePosterRef.files[0];
  console.log(file);
  if (file && !file.type.startsWith("image/")) {
    alert("only Image file is allowd");
    moviePosterRef.value = "";
  }

  if (editMovieId !== null) {
    let movieIndex = movies.data.findIndex((movie) => movie.id == editMovieId);

    movies.data[movieIndex] = {
      ...movies.data[movieIndex],
      name: formData.get("movieName"),
      description: formData.get("movieDescription"),
      certifiedFor: formData.get("certifiedFor"),
      movieLength: formData.get("movieTime"),
      releaseDate: formData.get("releaseDate"),
      languages: getSelectedCheckboxValues("language-list"),
      geners: getSelectedCheckboxValues("geners-list"),
      posterImage: !file ? movies.data[movieIndex].posterImage : file.name,
      trailerLink: formData.get("trailerURL"),
      updatedAt: new Date().toISOString(),
    };
    editMovieId = null;
  } else {
    console.log(file.name);
    moviePosterRef.setAttribute("required", true);
    let newData = {
      id: Number(generateId("movies")),
      name: formData.get("movieName"),
      description: formData.get("movieDescription"),
      certifiedFor: formData.get("certifiedFor"),
      movieLength: formData.get("movieTime"),
      releaseDate: formData.get("releaseDate"),
      languages: getSelectedCheckboxValues("language-list"),
      geners: getSelectedCheckboxValues("geners-list"),
      posterImage: !file ? "" : file.name,
      trailerLink: formData.get("trailerURL"),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    movies.data.push(newData);
  }
  saveToLocalStorage("movies", movies);
  movieForm.reset();
  displayMovies();
});

displayMovies();
