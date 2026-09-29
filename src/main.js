import { initializeCart } from "./cart.js";
import { renderRoute, navigateTo } from "./router.js";
import { renderHeader, renderFooter } from "./components/layout.js";
import { initConnectionStatus } from "./connectionStatus.js";

// Renderiza los componentes compartidos de Header y Footer
renderHeader();
renderFooter();

// Inicializa el detector de estado de conexión (offline/online)
initConnectionStatus();

function closeMenu() {
  const mainNav = document.querySelector("#main-nav");
  const menuButton = document.querySelector("#menu-toggle");
  if (mainNav) mainNav.classList.remove("is-open");
  if (menuButton) {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menú");
  }
}

// Soporte para navegación con History API (botones atrás / adelante del navegador)
window.addEventListener("popstate", () => {
  closeMenu();
  renderRoute();
});

// Retrocompatibilidad con hashes
window.addEventListener("hashchange", () => {
  closeMenu();
  renderRoute();
});

// Interceptar clics en enlaces internos para navegación fluida SPA sin recargas de página
document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;

  const href = link.getAttribute("href");
  if (!href) return;

  if (
    (href.startsWith("/") || href.startsWith("./") || href.endsWith(".html")) &&
    !href.startsWith("//") &&
    !href.startsWith("http") &&
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

// Renderiza la vista inicial basada en la URL actual y activa el carrito
renderRoute(false);
initializeCart();

// Registro del Service Worker para funcionamiento PWA y soporte offline
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

// Maneja el clic en el botón de activar o mostrar notificaciones
document.addEventListener("click", async (event) => {
  const button = event.target.closest("#btn-notifications");
  if (!button) return;

  // Comprueba si el navegador soporta notificaciones
  if (!("Notification" in window)) {
    alert("Este navegador no soporta notificaciones.");
    return;
  }

  // Pide permiso al usuario para mostrar notificaciones
  const permission = await Notification.requestPermission();

  // Solo continuamos si el usuario permitió las notificaciones
  if (permission === "granted") {
    // Cambia el texto del botón al aceptar el permiso
    button.textContent = "Mostrar notificación";

    // Espera a que el Service Worker esté listo
    const registration = await navigator.serviceWorker.ready;

    // Envía un mensaje al Service Worker
    registration.active.postMessage({
      type: "SHOW_TEST_NOTIFICATION"
    });
  } else if (permission === "denied") {
    alert("Las notificaciones fueron bloqueadas en este navegador.");
  }
});

// Actualiza el texto del botón si el permiso ya fue concedido previamente
if ("Notification" in window && Notification.permission === "granted") {
  const notificationButton = document.querySelector("#btn-notifications");
  if (notificationButton) {
    notificationButton.textContent = "Mostrar notificación";
  }
}

