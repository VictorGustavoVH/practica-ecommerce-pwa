// ==============================================================================
// COMPONENTES DE LAYOUT DINÁMICOS (HEADER Y FOOTER)
// ==============================================================================

// Genera e inyecta la estructura HTML del Header en el contenedor correspondiente.
export function renderHeader() {
  const headerContainer = document.querySelector("#site-header");
  if (!headerContainer) return;

  headerContainer.innerHTML = `
    <div class="header-container">
      <a class="brand" href="/" aria-label="Ir al inicio de TechVolt">
        <img class="brand-icon" src="/icons/icon-192.png" alt="" width="28" height="28" />
        <span>TechVolt</span>
      </a>

      <nav class="main-nav" id="main-nav" aria-label="Navegación principal">
        <a href="/" data-nav-link>Inicio</a>
        <a href="/catalogo" data-nav-link>Catálogo</a>
      </nav>

      <button
        class="menu-button"
        id="menu-toggle"
        type="button"
        aria-label="Abrir menú"
        aria-controls="main-nav"
        aria-expanded="false"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <button
        class="cart-button"
        id="cart-toggle"
        type="button"
        aria-label="Abrir carrito, 0 productos"
        aria-controls="cart-panel"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 4h2l2.1 9.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L20 7H6" />
          <circle cx="9" cy="19" r="1.4" />
          <circle cx="17" cy="19" r="1.4" />
        </svg>
        <span class="cart-label">Carrito</span>
        <span class="cart-count" id="cart-count" aria-hidden="true">0</span>
      </button>
    </div>
  `;

  setupMenuEvents();
}

// Genera e inyecta la estructura HTML del Footer en el contenedor correspondiente.
export function renderFooter() {
  const footerContainer = document.querySelector("#site-footer");
  if (!footerContainer) return;

  const currentYear = new Date().getFullYear();

  footerContainer.innerHTML = `
    <div class="footer-container">
      <a class="footer-brand" href="/">
        <img class="footer-brand-icon" src="/icons/icon-192.png" alt="" width="22" height="22" />
        <span>TechVolt</span>
      </a>
      <p>Accesorios tecnológicos para todos los días.</p>
      <p>&copy; <span>${currentYear}</span> TechVolt</p>
    </div>
  `;
}

// Configura la apertura y cierre del menú responsive para dispositivos móviles.
function setupMenuEvents() {
  const menuButton = document.querySelector("#menu-toggle");
  const mainNav = document.querySelector("#main-nav");

  if (!menuButton || !mainNav) return;

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
}
