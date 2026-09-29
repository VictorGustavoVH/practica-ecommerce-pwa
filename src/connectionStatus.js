// ==============================================================================
// GESTIÓN DEL ESTADO DE CONEXIÓN (ONLINE / OFFLINE)
// ==============================================================================

export function initConnectionStatus() {
  let toast = document.querySelector("#connection-status");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "connection-status";
    toast.className = "connection-status-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  let hideTimeout = null;
  let wasOffline = !navigator.onLine;

  function showOffline() {
    wasOffline = true;
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }

    toast.className = "connection-status-toast is-offline is-visible";
    toast.innerHTML = `
      <svg class="status-icon" viewBox="0 0 24 24" aria-hidden="true">
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
        <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <circle cx="12" cy="20" r="1" />
      </svg>
      <span class="status-text">Sin conexión a internet. Navegando en modo sin conexión.</span>
    `;
  }

  function showOnline() {
    if (!wasOffline) return;
    wasOffline = false;

    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }

    toast.className = "connection-status-toast is-online is-visible";
    toast.innerHTML = `
      <svg class="status-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <circle cx="12" cy="20" r="1" />
      </svg>
      <span class="status-text">Conexión restablecida. Ya estás en línea nuevamente.</span>
    `;

    hideTimeout = setTimeout(() => {
      toast.classList.remove("is-visible");
      hideTimeout = null;
    }, 4000);
  }

  window.addEventListener("offline", showOffline);
  window.addEventListener("online", showOnline);

  if (!navigator.onLine) {
    showOffline();
  }
}
