// Nombre y versión de la caché. Al cambiar de versión se crea una caché nueva.
const CACHE_NAME = "techvolt-cache-v5";

// Recursos estáticos disponibles tanto en desarrollo como en producción.
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable.png",
  "./images/producto-1.webp",
  "./images/producto-2.webp",
  "./images/producto-3.webp",
  "./images/producto-4.webp",
  "./images/producto-5.webp",
  "./images/producto-6.webp"
];

// Vite sirve estos módulos directamente durante `npm run dev`.
const DEVELOPMENT_MODULES = [
  "./src/main.js",
  "./src/router.js",
  "./src/cart.js",
  "./src/products.js"
];

// style.css no se precarga aquí: el <link rel="stylesheet"> permite que Vite
// lo entregue y lo guarde después con el tipo MIME text/css correcto.

/**
 * Guarda una lista de recursos sin cancelar toda la instalación si uno no existe.
 * Esto permite usar el mismo Service Worker en el servidor de desarrollo y en dist.
 */
async function cacheAvailableResources(cache, resources) {
  await Promise.all(
    resources.map(async (resource) => {
      try {
        await cache.add(resource);
      } catch {
        // En producción los módulos de src se sustituyen por archivos en assets.
      }
    })
  );
}

/**
 * Lee el index compilado y encuentra los archivos con hash creados por Vite.
 * Ejemplo: assets/index-AbC123.js. Después los guarda para utilizarlos offline.
 */
async function cacheViteBuildAssets(cache) {
  const indexResponse = await fetch("./index.html", { cache: "no-store" });

  if (!indexResponse.ok) return;

  const html = await indexResponse.text();
  const resourcePattern = /(?:src|href)=["']([^"']+)["']/g;
  const assetUrls = [...html.matchAll(resourcePattern)]
    .map((match) => new URL(match[1], self.location.href))
    .filter((url) => url.origin === self.location.origin && url.pathname.includes("/assets/"));

  await cacheAvailableResources(cache, assetUrls.map((url) => url.href));
}

// install se ejecuta una vez cuando el navegador detecta esta versión del Service Worker.
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Instalando techvolt-cache-v5");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(async (cache) => {
        // El App Shell contiene la interfaz mínima, manifest, iconos e imágenes.
        await cache.addAll(APP_SHELL);
        // En desarrollo se guardan los módulos fuente que Vite sirve directamente.
        await cacheAvailableResources(cache, DEVELOPMENT_MODULES);
        // En producción se guardan los archivos optimizados generados dentro de assets.
        await cacheViteBuildAssets(cache);
      })
      // Activa esta versión sin esperar a que se cierren todas las pestañas anteriores.
      .then(() => self.skipWaiting())
  );
});

// activate se ejecuta después de instalarse y elimina cachés de versiones anteriores.
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activando techvolt-cache-v5");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          // Conserva solamente la versión de caché declarada en CACHE_NAME.
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      ))
      // Permite que el Service Worker controle inmediatamente las páginas abiertas.
      .then(() => self.clients.claim())
  );
});

/**
 * Aplica la estrategia Cache First.
 * 1. Busca la petición en Cache Storage.
 * 2. Si no existe, la solicita a la red y guarda una copia local.
 * 3. Si no hay red y es una navegación, devuelve index.html para que el router SPA
 *    resuelva rutas como /catalogo y /producto/1.
 */
async function cacheFirst(request) {
  // Primera opción: responder inmediatamente con el recurso guardado.
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    // Segunda opción: solicitar el recurso porque todavía no está en caché.
    const networkResponse = await fetch(request);

    // Guardamos únicamente respuestas locales y correctas.
    if (networkResponse.ok && networkResponse.type === "basic") {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Respaldo de la SPA: cualquier ruta visual se reconstruye desde index.html.
    if (request.mode === "navigate") {
      const appShell = await caches.match("./index.html") || await caches.match("./");
      if (appShell) return appShell;
    }

    throw error;
  }
}

self.addEventListener("fetch", (event) => {
  // Las mutaciones POST/PUT/DELETE nunca deben tratarse como archivos estáticos.
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);

  // No guardamos recursos pertenecientes a otros dominios.
  if (requestUrl.origin !== self.location.origin) return;

  // Entrega al navegador la respuesta obtenida mediante Cache First.
  event.respondWith(cacheFirst(event.request));
});
