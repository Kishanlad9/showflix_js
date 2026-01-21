// const session = getFromLocalStorage("loggedInUser");

// if (!session || session.role !== "admin") {
//   location.href = "../login.html";
// }

let screenURL = "http://127.0.0.1:5500/json/screen.json";
const fetchScreenData = async () => {
  try {
    let response = await fetch(screenURL);
    let data = await response.json();
    console.log("Fetching data from json file");
    saveToLocalStorage("screens", data);
  } catch (error) {
    console.log("Error in fetching screen data:", error);
  }
};

if (!getFromLocalStorage("screens")) {
  fetchScreenData() || [];
}

const screenForm = document.getElementById("screenForm");
let editScreenId = null;

// Generating cinema list dropdown.
const selectCinemaRef = document.getElementById("selectCinemaId");
generateDropdownSelect(selectCinemaRef, "cinemas", "Cinema Name");

function deleteScreen(id) {
  let screens = getFromLocalStorage("screens");
  screens.data = screens.data.filter((screen) => screen.id !== id);
  saveToLocalStorage("screens", screens);
  displayScreens();
}

function updateScreen(id) {
  let screens = getFromLocalStorage("screens").data;
  let screen = screens.find((screen) => screen.id == id);
  document.getElementById("screenName").value = screen.name;
  document.getElementById("selectCinemaId").value = screen.cinemaId;
  document.getElementById("seats").value = screen.totalSeats;
  document.getElementById("rowSeats").value = screen.seatLayout.rows;
  document.getElementById("colSeats").value = screen.seatLayout.columns;
  editScreenId = id;
}

let screenList = document.getElementById("screen-list");
function displayScreens() {
  let screens = getFromLocalStorage("screens").data;
  let cinemas = getFromLocalStorage("cinemas").data;
  screenList.innerHTML = "";
  screens.forEach((screen) => {
    let cinema = cinemas.find((c) => c.id == screen.cinemaId);
    let tr = document.createElement("tr");
    tr.innerHTML = `
    <td>${screen.id}</td>
    <td>${screen.name}</td>
    <td>${cinema.name}</td>
    <td>${screen.totalSeats}</td>
    <td>
    <button class="btn btn-secondary editScreen-btn">Edit</button>
    </td>
    <td>
    <button class="btn btn-danger deleteScreen-btn">Delete</button>
    </td>
    `;
    tr.querySelector(".editScreen-btn").addEventListener("click", () =>
      updateScreen(screen.id),
    );
    tr.querySelector(".deleteScreen-btn").addEventListener("click", () =>
      deleteScreen(screen.id),
    );
    screenList.appendChild(tr);
  });
}

screenForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let screens = getFromLocalStorage("screens");
  const formData = new FormData(screenForm);
  if (editScreenId !== null) {
    findScreenIndex = screens.data.findIndex(
      (screen) => screen.id == editScreenId,
    );
    screens.data[findScreenIndex] = {
      ...screens.data[findScreenIndex],
      cinemaId: Number(formData.get("selectCinemaId")),
      name: formData.get("screenName"),
      totalSeats: formData.get("seats"),
      seatLayout: {
        rows: formData.get("rowSeats"),
        columns: formData.get("colSeats"),
      },
      updatedAt: new Date().toISOString(),
    };
    editScreenId = null;
  } else {
    const newData = {
      id: generateId("screens"),
      cinemaId: Number(formData.get("selectCinemaId")),
      name: formData.get("screenName"),
      totalSeats: Number(formData.get("seats")),
      seatLayout: {
        rows: Number(formData.get("rowSeats")),
        columns: Number(formData.get("colSeats")),
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    screens.data.push(newData);
  }
  saveToLocalStorage("screens", screens);
  screenForm.reset();
  displayScreens();
});

displayScreens();
