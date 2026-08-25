const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

if (menuToggle && mobileMenu) {
  const navLinks = document.querySelectorAll(".nav-links a, .mobile-menu a");

  menuToggle.addEventListener("click", () => {
    const isActive = mobileMenu.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", isActive ? "true" : "false");
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 992 && mobileMenu.classList.contains("active")) {
      mobileMenu.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}
