const showURL = "http://127.0.0.1:5500/json/show.json";
let shows = getFromLocalStorage("shows");
let movies = getFromLocalStorage("movies");
const showForm = document.getElementById("showForm");
let showList = document.getElementById("show-list");

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
let screens = getFromLocalStorage("screens");

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

// Display Shows
function displayShows() {
  // shows.data.forEach((show) => {});
  // cinemaName, show time from - to, screenName, Moviename
  showList.innerHTML = "";
  showList.innerHTML = `
    <div class="card">
    
    </div>
  `;
}

showForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(screens.data);
  let findSeat = screens.data.find((screen) => {
    if (screen.id == selectScreenForShow.value) return screen;
  });
  const formData = new FormData(showForm);
  const newShow = {
    id: Number(generateId("shows")),
    cinemaId: Number(selectCinemaForShow.value),
    screenId: Number(selectScreenForShow.value),
    movieId: Number(selectMovieForShow.value),
    showData: formData.get("showDate"),
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
  saveToLocalStorage("shows", shows);
  showForm.reset();
});
