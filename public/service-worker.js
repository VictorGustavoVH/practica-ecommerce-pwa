const CACHE_NAME = "techvolt-cache-v7";

const APP_SHELL = [
  "/",
  "/index.html",
  "/catalogo.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable.png",
  "/images/producto-1.webp",
  "/images/producto-2.webp",
  "/images/producto-3.webp",
  "/images/producto-4.webp",
  "/images/producto-5.webp",
  "/images/producto-6.webp",
  "/screenshots/screenshot-desktop-home.webp",
  "/screenshots/screenshot-desktop-catalog.webp",
  "/screenshots/screenshot-mobile-home.webp",
  "/screenshots/screenshot-mobile-catalog.webp"
];

// Almacena recursos en cache de forma resiliente
async function cacheAvailableResources(cache, resources) {
  await Promise.all(
    resources.map(async (resource) => {
      try {
        await cache.add(resource);
      } catch (err) {
        // Ignora recursos opcionales o faltantes en entornos de prueba
      }
    })
  );
}

// Extrae del HTML los assets con hash generados por el build de Vite
async function cacheViteBuildAssets(cache) {
  const pages = ["/index.html", "/catalogo.html"];
  for (const page of pages) {
    try {
      const pageResponse = await fetch(page, { cache: "no-store" });
      if (!pageResponse.ok) continue;

      const html = await pageResponse.text();
      const resourcePattern = /(?:src|href)=["']([^"']+)["']/g;

      const assetUrls = [...html.matchAll(resourcePattern)]
        .map((match) => new URL(match[1], self.location.origin))
        .filter((url) => url.origin === self.location.origin && url.pathname.includes("/assets/"));

      await cacheAvailableResources(cache, assetUrls.map((url) => url.href));
    } catch {
      // Continuar con el siguiente si falla
    }
  }
}

// Install: precaching de App Shell y assets de produccion
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(async (cache) => {
        await cacheAvailableResources(cache, APP_SHELL);
        await cacheViteBuildAssets(cache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate: limpieza de versiones viejas de cache
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Manejo de peticiones de navegacion (HTML SPA): Network First con fallback a Cache
async function handleNavigation(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch {
    // Sin red: recurre a la cache
  }

  const cachedPage = await caches.match(request);
  if (cachedPage) return cachedPage;

  const isCatalog = request.url.includes("catalogo");
  const fallbackShell = isCatalog
    ? (await caches.match("/catalogo.html")) || (await caches.match("/index.html")) || (await caches.match("/"))
    : (await caches.match("/index.html")) || (await caches.match("/")) || (await caches.match("/catalogo.html"));

  return fallbackShell || Response.error();
}

// Manejo de recursos estaticos: Cache First con actualizacion en segundo plano
async function handleStaticAsset(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok && (networkResponse.type === "basic" || networkResponse.type === "cors")) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    throw error;
  }
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(handleNavigation(event.request));
  } else {
    event.respondWith(handleStaticAsset(event.request));
  }
});

// Manejo de notificaciones locales de prueba
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SHOW_TEST_NOTIFICATION") {
    self.registration.showNotification("TechVolt", {
      body: "Las notificaciones de TechVolt funcionan correctamente.",
      icon: "/icons/icon-192.png"
    });
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow("/");
    })
  );
});
