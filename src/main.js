import { initializeCart } from "./cart.js";
import { renderRoute, navigateTo } from "./router.js";

document.querySelector("#current-year").textContent = new Date().getFullYear();

const menuButton = document.querySelector("#menu-toggle");
const mainNav = document.querySelector("#main-nav");

function closeMenu() {
  mainNav.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menú");
}

menuButton.addEventListener("click", () => {
  const willOpen = !mainNav.classList.contains("is-open");
  mainNav.classList.toggle("is-open", willOpen);
  menuButton.setAttribute("aria-expanded", String(willOpen));
  menuButton.setAttribute("aria-label", willOpen ? "Cerrar menú" : "Abrir menú");
});

mainNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

// Soporte para navegación con History API (botones atrás / adelante)
window.addEventListener("popstate", () => {
  closeMenu();
  renderRoute();
});

// Retrocompatibilidad con hashes antiguos
window.addEventListener("hashchange", () => {
  closeMenu();
  renderRoute();
});

// Interceptar clics en enlaces internos para navegación fluida SPA sin recargas
document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;

  const href = link.getAttribute("href");
  if (!href) return;

  // Ignorar enlaces externos o acciones especiales
  if (
    href.startsWith("/") &&
    !href.startsWith("//") &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.shiftKey &&
    !event.altKey &&
    event.button === 0
  ) {
    event.preventDefault();
    closeMenu();
    navigateTo(href);
  }
});

renderRoute(false);
initializeCart();

// Registrar significa pedirle al navegador que instale y administre el Service Worker.
// Esta comprobación evita errores en navegadores que no ofrecen soporte para PWA.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const serviceWorkerUrl = `${import.meta.env.BASE_URL}service-worker.js`;
      const registration = await navigator.serviceWorker.register(serviceWorkerUrl);
      console.log("Service Worker registrado correctamente:", registration.scope);
    } catch (error) {
      console.error("Error al registrar el Service Worker:", error);
    }
  });
} else {
  console.log("Este navegador no soporta Service Workers.");
}
