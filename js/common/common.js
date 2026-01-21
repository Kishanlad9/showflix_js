function getCinemaServices() {
  return [
    "Recliner",
    "Parking",
    "Digital Payment",
    "Food and bavrages",
    "4DX",
    "IMAX",
  ];
}

function getlanguages() {
  return [
    "Hindi",
    "English",
    "Gujarati",
    "Tamil",
    "Telugu",
    "Malayalam",
    "Kannada",
  ];
}

function getGeners() {
  return [
    "Action",
    "Adventure",
    "Biographical",
    "Cartoon",
    "Comedy",
    "Crime",
    "Drama",
    "Horrer",
    "Suspense",
    "Sci-Fi",
    "Thriller",
  ];
}

function getMovieFormat() {
  return ["2D", "3D", "IMAX", "4DX"];
}

// Generate dropdown with checkboxes
function generateDropdownCheckbox(fieldName, dataFunction, identifierName) {
  const fieldsRecord = dataFunction();
  fieldName.innerHTML = "";
  let select = fieldName;
  fieldsRecord.forEach((record) => {
    let li = `
      <li class="d-flex gap-3 ps-3">
        <input type="checkbox" name="${identifierName}" value='${record}' class="form-check" /> ${record}
      </li>`;
    select.innerHTML += li;
  });
}

// Generate dropdown with select options
function generateDropdownSelect(fieldRef, dbName, fieldFor) {
  let records = getFromLocalStorage(dbName)
    ? getFromLocalStorage(dbName).data
    : [];
  fieldRef.innerHTML = "";
  let option = `<option disabled>Select ${fieldFor}</option>`;
  records.forEach((record) => {
    option += `
    <option value="${record.id}">${record.name}</option>
    `;
  });
  fieldRef.innerHTML += option;
}

function getSelectedCheckboxValues(fieldId) {
  let checkedValues = [];
  let checkboxes = document.querySelectorAll(
    `#${fieldId} input[type="checkbox"]:checked`,
  );
  checkboxes.forEach((checkbox) => {
    checkedValues.push(checkbox.value) || [];
  });
  return checkedValues;
}

// Generates services dropdown for cinema form
function generateServicesDropown(fieldName) {
  const services = getCinemaServices();
  fieldName.innerHTML = "";
  let select = fieldName;
  services.forEach((service) => {
    let li = `
      <li class="d-flex gap-3 ps-3">
        <input type="checkbox" name="selectServices" value='${service}' class="form-check" /> ${service}
      </li>`;
    select.innerHTML += li;
  });
}

function generateLanguageDropown(fieldName) {
  const languages = getlanguages();
  fieldName.innerHTML = "";
  let select = fieldName;
  languages.forEach((language) => {
    let li = `
      <li class="d-flex gap-3 ps-3">
        <input type="checkbox" name="selectLanguage" value='${language}' class="form-check" /> ${language}
      </li>`;
    select.innerHTML += li;
  });
}

function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || null;
}

function generateId(dbName) {
  let records = getFromLocalStorage(dbName);
  let lastRecord = records.data[records.data.length - 1];
  return lastRecord ? lastRecord.id + 1 : 1;
}

function checkDataExists(dbName, value) {
  let records = getFromLocalStorage(dbName);
  let findRecord = records.data.find((record) => {
    record.email == value;
  });
  console.log(findRecord);
}

function generateDropdownByValue(values, fieldRef, fieldFor = "") {
  let records = values;
  fieldRef.innerHTML = "";
  let option = `<option disabled>Select ${fieldFor}</option>`;
  records.forEach((record) => {
    option += `
    <option value="${record.id}">${record.name}</option>
    `;
  });
  fieldRef.innerHTML += option;
}
