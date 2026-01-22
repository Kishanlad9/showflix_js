const showURL = "http://127.0.0.1:5500/json/show.json";
let shows = getFromLocalStorage("shows");
let movies = getFromLocalStorage("movies");
let cinemas = getFromLocalStorage("cinemas");
let screens = getFromLocalStorage("screens");
const showForm = document.getElementById("showForm");
let showList = document.getElementById("show-list");
let editShowId = null;

let selectCinemaForShow = document.getElementById("cinemaId_show");
let selectScreenForShow = document.getElementById("screenId_show");
let selectMovieForShow = document.getElementById("movieId_show");
let selectShowFormat = document.getElementById("showFormat");
let selectShowLanguage = document.getElementById("showLanguage");

const fetchShowData = async () => {
  try {
    let response = await fetch(showURL);
    let data = await response.json();
    console.log("Fetching data from json file");
    saveToLocalStorage("shows", data);
  } catch (error) {
    console.log("Error in fetching show data:", error);
  }
};

if (!getFromLocalStorage("shows")) {
  fetchShowData() || [];
}

generateDropdownSelect(selectCinemaForShow, "cinemas", "Cinema Name");
generateDropdownSelect(selectMovieForShow, "movies", "Movie");

let formatList = getMovieFormat();
formatList.forEach((format) => {
  selectShowFormat.innerHTML += `
      <option value="${format}">${format}</option>
    `;
});

// onChange get movie Language.
selectMovieForShow.addEventListener("change", (e) => {
  e.preventDefault();
  let findedMovie = movies.data.find(
    (movie) => movie.id == selectMovieForShow.value,
  );
  selectShowLanguage.innerHTML = "";
  findedMovie.languages.forEach((language) => {
    selectShowLanguage.innerHTML += ` 
    <option value="${language}">${language}</option>
    `;
  });
});

// onChange get screen
selectCinemaForShow.addEventListener("change", () => {
  let findScreen = screens.data.filter(
    (screen) => screen.cinemaId == selectCinemaForShow.value,
  );
  selectScreenForShow.innerHTML = "";
  findScreen.forEach((screen) => {
    selectScreenForShow.innerHTML += `
    <option value="${screen.id}">${screen.name}</option>
    `;
  });
});

function deleteShow(showId) {
  shows.data = shows.data.filter((show) => show.id != showId);
  saveToLocalStorage("shows", shows);
  displayShows();
}

function updateShow(showId) {
  let findedShow = shows.data.find((show) => show.id == showId);
  let findedScreen = screens.data.filter(
    (screen) => screen.cinemaId == findedShow.cinemaId,
  );
  let findedMovieLang = movies.data.find(
    (movie) => movie.id == findedShow.movieId,
  );
  selectShowLanguage.innerHTML = "";
  let option = `<option disabled>Select Language</option>`;
  findedMovieLang.languages.forEach((lang) => {
    option += `
    <option value="${lang}">${lang}</option>
    `;
  });
  selectShowLanguage.innerHTML += option;
  generateDropdownByValue(findedScreen, selectScreenForShow, "Screen");
  selectCinemaForShow.value = findedShow.cinemaId;
  selectMovieForShow.value = findedShow.movieId;
  selectScreenForShow.value = findedShow.screenId;
  selectShowFormat.value = findedShow.format;
  selectShowLanguage.value = findedShow.language;
  document.getElementById("showDate").value = findedShow.showDate;
  document.getElementById("showStartTime").value = findedShow.showStartTime;
  document.getElementById("showEndTime").value = findedShow.showEndTime;
  document.getElementById("regularPrice").value = findedShow.pricing.regular;
  document.getElementById("premiumPrice").value = findedShow.pricing.premium;
  document.getElementById("reclinerPrice").value = findedShow.pricing.recliner;
  editShowId = showId;
}

// Display Shows
function displayShows() {
  showList.innerHTML = "";
  shows.data.forEach((show) => {
    let movie = movies.data.find((movie) => movie.id == show.movieId);
    let cinema = cinemas.data.find((cinema) => cinema.id == show.cinemaId);
    let screen = screens.data.find((screen) => screen.id == show.screenId);
    let newCard = document.createElement("div");
    newCard.setAttribute("class", "card");
    newCard.innerHTML += `
      <div class="card-body">
        <h5 class="card-title">${movie.name}</h5>
        <h6 class="card-subtitle mb-2 text-body-secondary">${cinema.name} (${show.showStartTime} - ${show.showEndTime})
        </h6>
        <p class="card-text">
            <b>Date:</b> ${show.showDate}<br>
            <b>Screen:</b> ${screen.name}
        </p>
        <button class="btn btn-sm btn-secondary editShow-btn"        data-bs-toggle="modal"
          data-bs-target="#showModel">Edit</button>
        <button class="btn btn-sm btn-danger deleteShow-btn" 
        >Delete</button>
      </div>
  `;
    newCard
      .querySelector(".editShow-btn")
      .addEventListener("click", () => updateShow(show.id));
    newCard
      .querySelector(".deleteShow-btn")
      .addEventListener("click", () => deleteShow(show.id));
    showList.appendChild(newCard);
  });
}

showForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let findSeat = screens.data.find((screen) => {
    if (screen.id == selectScreenForShow.value) return screen;
  });
  const formData = new FormData(showForm);
  if (editShowId != null) {
    console.log(editShowId);
    let showIndex = shows.data.findIndex((show) => {
      show.id == editShowId;
    });
    console.log(editShowId);
    shows.data[showIndex] = {
      ...shows.data[showIndex],
      cinemaId: Number(selectCinemaForShow.value),
      screenId: Number(selectScreenForShow.value),
      movieId: Number(selectMovieForShow.value),
      showDate: formData.get("showDate"),
      showStartTime: formData.get("showStartTime"),
      showEndTime: formData.get("showEndTime"),
      language: selectShowLanguage.value,
      format: selectShowFormat.value,
      pricing: {
        regular: Number(formData.get("regularPrice")),
        premium: Number(formData.get("premiumPrice")),
        recliner: Number(formData.get("reclinerPrice")),
      },
      seatStatus: {
        totalSeats: Number(findSeat.totalSeats),
        bookedSeats: 0,
        availableSeats: 0,
      },
      status: "scheduled",
      updatedAt: new Date().toISOString(),
    };
    editShowId = null;
  } else {
    const newShow = {
      id: Number(generateId("shows")),
      cinemaId: Number(selectCinemaForShow.value),
      screenId: Number(selectScreenForShow.value),
      movieId: Number(selectMovieForShow.value),
      showDate: formData.get("showDate"),
      showStartTime: formData.get("showStartTime"),
      showEndTime: formData.get("showEndTime"),
      language: selectShowLanguage.value,
      format: selectShowFormat.value,
      pricing: {
        regular: Number(formData.get("regularPrice")),
        premium: Number(formData.get("premiumPrice")),
        recliner: Number(formData.get("reclinerPrice")),
      },
      seatStatus: {
        totalSeats: Number(findSeat.totalSeats),
        bookedSeats: 0,
        availableSeats: 0,
      },
      status: "scheduled",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    shows.data.push(newShow);
  }
  saveToLocalStorage("shows", shows);
  showForm.reset();
  console.log(shows);
  displayShows();
});
displayShows();
