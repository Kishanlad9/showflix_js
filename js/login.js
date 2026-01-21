// const session =  getFromLocalStorage("loggedInUser");

// if (!session || session.role !== "user") {
//   location.href = "../../user/login.html";
// }

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

const loginEmail = document.getElementById("email");
const loginPassword = document.getElementById("password");

const usersURL = "http://127.0.0.1:5500/json/user.json";
let users = getFromLocalStorage("users");

const initUsers = async () => {
  if (!users) {
    const response = await fetch(usersURL);
    const data = await response.json();
    saveToLocalStorage("users", data);
    users = data;
  }
};

initUsers();

registerForm.addEventListener("submit", () => {
  const formData = new FormData(registerForm);
  const email = formData.get("registerEmail");

  const exists = users.data.some((u) => u.email === email);
  if (exists) {
    alert("Email already registered");
    return;
  }

  const newUser = {
    id: generateId("users"),
    name: formData.get("name"),
    contact: formData.get("contact"),
    email,
    password: formData.get("registerPassword"),
    role: "user",
    createdAt: new Date().toISOString(),
  };

  users.data.push(newUser);
  saveToLocalStorage("users", users);

  alert("User registered successfully");
  registerForm.reset();
});
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  const user = users.data.find(
    (u) => u.email === email && u.password === password && u.isActive
  );

  // It is for sesion but we'll use later on.
  if (user) {
    // saveToLocalStorage("loggedInUser", {
    //   id: user.id,
    //   role: user.role,
    // });
    location.href = "../../user/home.html";
    return;
  }

  const admin = users.adminData.find(
    (a) => a.email === email && a.password === password && a.isActive
  );

  if (admin) {
    // saveToLocalStorage("loggedInUser", {
    //   id: admin.id,
    //   role: admin.role,
    // });
    location.href = "../../admin/crud.html";
    return;
  }

  alert("Invalid credentials or inactive account");
});
