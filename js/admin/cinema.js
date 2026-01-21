// const session = getFromLocalStorage("loggedInUser");

// if (!session || session.role !== "admin") {
//   location.href = "../login.html";
// }

import { imagePaths } from "../filepaths.js";
const cinemaForm = document.getElementById("cinemaForm");
generateServicesDropown(document.getElementById("services-list"));
let editCinemaId = null;

let cinemaURL = "http://127.0.0.1:5500/json/cinema.json";
const fetchCinemaData = async () => {
  try {
    let response = await fetch(cinemaURL);
    let data = await response.json();
    console.log("Fetching data from json file");
    saveToLocalStorage("cinemas", data);
  } catch (error) {
    console.log("Error fetching cinema data:", error);
  }
};

if (!getFromLocalStorage("cinemas")) {
  fetchCinemaData() || [];
}

const cinemaLogoRef = document.getElementById("cinemaLogo");
let preview = document.querySelector(".preview");
cinemaLogoRef.addEventListener("change", (e) => {
  const file = cinemaLogoRef;
  if (!file.files || !file.files[0]) {
    preview.innerHTML = "No Image Selected 😐";
    return;
  } else {
    const reader = new FileReader();
    reader.onload = function (e) {
      console.log(e);
      preview.innerHTML = `<img src="${e.target.result}" class="p-1 frame-2x2"/>`;
    };
    reader.readAsDataURL(file.files[0]);
  }
});

//  return checkbox selected services
function selectedServices() {
  let services = [];
  let checkboxes = document.querySelectorAll(
    '#services-list input[type="checkbox"]:checked'
  );
  checkboxes.forEach((checkbox) => {
    services.push(checkbox.value) || [];
  });
  return services;
}

function deleteCinema(id) {
  let cinemas = getFromLocalStorage("cinemas");
  cinemas.data = cinemas.data.filter((cinema) => cinema.id !== id);
  saveToLocalStorage("cinemas", cinemas);
  displayCinemas();
}

function updateCinema(id) {
  let cinemas = getFromLocalStorage("cinemas");
  let getCinemaDetails = cinemas.data.find((cinema) => cinema.id === id);
  document.getElementById("cinemaName").value = getCinemaDetails.name;
  document
    .querySelectorAll("#services-list input[type='checkbox']")
    .forEach((checkbox) => {
      if (getCinemaDetails.services.includes(checkbox.value)) {
        checkbox.checked = true;
      } else {
        checkbox.checked = false;
      }
    });
  document.getElementById("cinemaContact").value = getCinemaDetails.contact;
  document.getElementById("cinemaAddress").value = getCinemaDetails.address;
  preview.innerHTML = `<img src="${imagePaths.cinemaImagePath}${getCinemaDetails.logo}" class="p-1 frame-2x2"/>`;
  editCinemaId = id;
}

function displayCinemas() {
  preview.innerHTML = "No Image Selected 😐";
  cinemaForm.reset();
  let cinemas = getFromLocalStorage("cinemas");
  let cinemaList = document.getElementById("cinema-list");
  cinemaList.innerHTML = "";
  cinemas.data.forEach((cinema) => {
    let tr = document.createElement("tr");
    tr.innerHTML = `
      
        <td>${cinema.id}</td>
        <td>${cinema.name}</td>
        <td><img src="${imagePaths.cinemaImagePath}${cinema.logo}" alt="${cinema.name} Logo" width="50"/></td>
        <td>
          <button class="btn btn-sm btn-primary me-2 edit-btn">Edit</button>
          <button class="btn btn-sm btn-danger delete-btn" 
          >Delete</button>
        </td>
      
    `;
    tr.querySelector(".edit-btn").addEventListener("click", () =>
      updateCinema(cinema.id)
    );

    tr.querySelector(".delete-btn").addEventListener("click", () =>
      deleteCinema(cinema.id)
    );
    cinemaList.appendChild(tr);
  });
}

cinemaForm.addEventListener("submit", () => {
  let cinemas = getFromLocalStorage("cinemas") || [];

  // For Image
  const formData = new FormData(cinemaForm);
  const file = cinemaLogoRef.files[0];
  if (file && !file.type.startsWith("image/")) {
    alert("only Image file is allowd");
    cinemaLogoRef.value = "";
  }

  if (editCinemaId) {
    let cinemaIndex = cinemas.data.findIndex(
      (cinema) => cinema.id === editCinemaId
    );
    let selectedValues = selectedServices();
    cinemas.data[cinemaIndex] = {
      ...cinemas.data[cinemaIndex],
      name: formData.get("cinemaName"),
      services: selectedValues,
      contact: formData.get("cinemaContact"),
      address: formData.get("cinemaAddress"),
      logo: !file ? "common.png" : file.name,
      updatedAt: new Date().toISOString(),
    };
    editCinemaId = null;
  } else {
    let name = formData.get("cinemaName");
    let selectedValues = selectedServices();
    let contact = formData.get("cinemaContact");
    let address = formData.get("cinemaAddress");

    let cinemaData = {
      id: Number(generateId("cinemas")),
      name: name,
      services: selectedValues,
      contact: contact,
      address: address,
      logo: !file ? "common.png" : file.name,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    console.log(cinemaData);
    cinemas.data.push(cinemaData);
  }
  saveToLocalStorage("cinemas", cinemas);
  displayCinemas();
  cinemaForm.reset();
});

displayCinemas();
