const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navActions = document.querySelector(".nav-actions");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  navActions.classList.toggle("active");
});