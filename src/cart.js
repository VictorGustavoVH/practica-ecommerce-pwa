import { PRODUCTOS } from "./products.js";

const STORAGE_KEY = "techvolt-cart";
const formatPrice = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0
});

let cart = [];
let previousFocus = null;

function isValidItem(item) {
  return item
    && Number.isInteger(item.productId)
    && Number.isInteger(item.quantity)
    && item.quantity > 0
    && PRODUCTOS.some((product) => product.id === item.productId);
}

function loadCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");

    if (!Array.isArray(savedCart) || !savedCart.every(isValidItem)) {
      localStorage.setItem(STORAGE_KEY, "[]");
      return [];
    }

    return savedCart;
  } catch (error) {
    console.warn("No se pudo recuperar el carrito guardado.", error);
    localStorage.setItem(STORAGE_KEY, "[]");
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.warn("No se pudo guardar el carrito.", error);
  }
}

function getProduct(productId) {
  return PRODUCTOS.find((product) => product.id === productId);
}

function cartItemTemplate(item) {
  const product = getProduct(item.productId);

  return `
    <article class="cart-item">
      <img src="${product.image}" alt="" width="88" height="88" />
      <div class="cart-item-content">
        <div class="cart-item-heading">
          <h3>${product.name}</h3>
          <button
            class="remove-button"
            type="button"
            data-cart-action="remove"
            data-product-id="${product.id}"
            aria-label="Eliminar ${product.name}"
          >
            Eliminar
          </button>
        </div>
        <p>${formatPrice.format(product.price)}</p>
        <div class="quantity-control" aria-label="Cantidad de ${product.name}">
          <button
            type="button"
            data-cart-action="decrease"
            data-product-id="${product.id}"
            aria-label="Disminuir cantidad de ${product.name}"
          >−</button>
          <span aria-live="polite">${item.quantity}</span>
          <button
            type="button"
            data-cart-action="increase"
            data-product-id="${product.id}"
            aria-label="Aumentar cantidad de ${product.name}"
          >+</button>
        </div>
      </div>
    </article>
  `;
}

function renderCart() {
  const itemsContainer = document.querySelector("#cart-items");
  const countElement = document.querySelector("#cart-count");
  const cartButton = document.querySelector("#cart-toggle");
  const summary = document.querySelector("#cart-summary");
  const totalElement = document.querySelector("#cart-total");
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const total = cart.reduce((sum, item) => {
    const product = getProduct(item.productId);
    return sum + product.price * item.quantity;
  }, 0);

  countElement.textContent = itemCount;
  cartButton.setAttribute(
    "aria-label",
    `Abrir carrito, ${itemCount} ${itemCount === 1 ? "producto" : "productos"}`
  );
  totalElement.textContent = formatPrice.format(total);

  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 4h2l2.1 9.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L20 7H6" />
          <circle cx="9" cy="19" r="1.4" />
          <circle cx="17" cy="19" r="1.4" />
        </svg>
        <h3>Tu carrito está vacío</h3>
        <p>Agrega un producto del catálogo para comenzar.</p>
        <a class="button" href="/catalogo" data-close-cart>Ver catálogo</a>
      </div>
    `;
    summary.hidden = true;
    return;
  }

  itemsContainer.innerHTML = cart.map(cartItemTemplate).join("");
  summary.hidden = false;
}

function announce(message) {
  const status = document.querySelector("#cart-status");
  status.textContent = "";
  window.setTimeout(() => {
    status.textContent = message;
  }, 50);
}

function openCart() {
  const panel = document.querySelector("#cart-panel");
  const overlay = document.querySelector("#cart-overlay");

  previousFocus = document.activeElement;
  document.body.classList.add("cart-open");
  panel.classList.add("is-open");
  overlay.classList.add("is-open");
  panel.removeAttribute("inert");
  panel.setAttribute("aria-hidden", "false");
  overlay.setAttribute("aria-hidden", "false");
  document.querySelector("#cart-toggle").setAttribute("aria-expanded", "true");
  document.querySelector("#cart-close").focus();
}

function closeCart() {
  const panel = document.querySelector("#cart-panel");
  const overlay = document.querySelector("#cart-overlay");

  document.body.classList.remove("cart-open");
  panel.classList.remove("is-open");
  overlay.classList.remove("is-open");
  panel.setAttribute("inert", "");
  panel.setAttribute("aria-hidden", "true");
  overlay.setAttribute("aria-hidden", "true");
  document.querySelector("#cart-toggle").setAttribute("aria-expanded", "false");

  if (previousFocus instanceof HTMLElement) previousFocus.focus();
}

function addProduct(productId) {
  const existingItem = cart.find((item) => item.productId === productId);

  if (existingItem) existingItem.quantity += 1;
  else cart.push({ productId, quantity: 1 });

  saveCart();
  renderCart();
  announce(`${getProduct(productId).name} agregado al carrito.`);
  openCart();
}

function changeQuantity(productId, change) {
  const item = cart.find((cartItem) => cartItem.productId === productId);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) cart = cart.filter((cartItem) => cartItem.productId !== productId);

  saveCart();
  renderCart();
}

function removeProduct(productId) {
  const product = getProduct(productId);
  cart = cart.filter((item) => item.productId !== productId);
  saveCart();
  renderCart();
  announce(`${product.name} eliminado del carrito.`);
}

export function initializeCart() {
  cart = loadCart();
  renderCart();

  document.querySelector("#cart-toggle").addEventListener("click", openCart);
  document.querySelector("#cart-close").addEventListener("click", closeCart);
  document.querySelector("#cart-overlay").addEventListener("click", closeCart);

  document.addEventListener("click", (event) => {
    const addButton = event.target.closest(".add-to-cart");
    const actionButton = event.target.closest("[data-cart-action]");

    if (addButton) {
      addProduct(Number(addButton.dataset.productId));
      return;
    }

    if (actionButton) {
      const productId = Number(actionButton.dataset.productId);
      const action = actionButton.dataset.cartAction;

      if (action === "increase") changeQuantity(productId, 1);
      if (action === "decrease") changeQuantity(productId, -1);
      if (action === "remove") removeProduct(productId);
      return;
    }

    if (event.target.closest("[data-close-cart]")) closeCart();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("cart-open")) {
      closeCart();
    }
  });
}
