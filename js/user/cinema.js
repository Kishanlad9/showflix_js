import { imagePaths } from "../filepaths.js";

let cinemaListRef = document.getElementById("cinema-list");
let cinemas = getFromLocalStorage("cinemas");
cinemaListRef.innerHTML = "";
let cinemaContainer = "";
cinemas.data.forEach((cinema) => {
  cinemaContainer += `
    <div class="card half-width bg-transparent">
        <div class="d-flex flex-wrap w-100 align-items-center gap-2">
            <div class="d-block popup-transition">
                <img src="${imagePaths.cinemaImagePath + cinema.logo}"
                    class="logo-frame-sm rounded-circle p-3" alt="">
            </div>
            <div class=" cinema-info w-75 flex-wrap gap-2">
                <a class="text-white fs-5" href="">${cinema.name}, ${cinema.address}</a>
                <p class="text-white">${cinema.services}</p>
            </div>
        </div>
    </div>`;
});
cinemaListRef.innerHTML = cinemaContainer;
