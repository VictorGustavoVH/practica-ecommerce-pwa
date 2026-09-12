# Guion sencillo de exposición

## Antes de comenzar

- Abrir el proyecto en Visual Studio Code.
- Ejecutar `npm run dev`.
- Abrir `http://127.0.0.1:5173/` en Chrome.
- Abrir DevTools con `F12`.

## 1. Herramientas

1. Mostrar en la terminal:

```powershell
node --version
npm --version
```

2. Abrir `package.json`.
3. Mostrar los comandos `dev`, `build` y `preview` de Vite.
4. Mostrar TechVolt funcionando en el navegador.

## 2. Navegación

1. Mostrar Inicio: `/`.
2. Mostrar Catálogo: `/catalogo`.
3. Abrir un detalle: `/producto/1`.
4. Reducir el navegador y mostrar el menú hamburguesa.
5. Agregar un producto al carrito.

## 3. Manifest

1. Abrir `public/manifest.json`.
2. Mostrar:
   - `name` y `short_name`.
   - `start_url: "./"`.
   - `scope: "./"`.
   - `display: "standalone"`.
   - `background_color` y `theme_color`.
   - Los tres iconos.
3. En Chrome abrir **Application > Manifest**.
4. Mostrar que Chrome reconoce el nombre, inicio, modo e iconos.

> El manifest no tiene comentarios porque JSON no los permite.

## 4. Registro del Service Worker

1. Abrir `src/main.js`.
2. Mostrar la comprobación:

```js
if ("serviceWorker" in navigator)
```

3. Mostrar el registro:

```js
navigator.serviceWorker.register(serviceWorkerUrl)
```

4. En Chrome abrir **Application > Service Workers**.
5. Mostrar `/service-worker.js` con estado **activated and running**.

## 5. Caché

1. Abrir `public/service-worker.js`.
2. Mostrar:
   - `CACHE_NAME`.
   - `APP_SHELL`.
   - Evento `install`.
   - Evento `activate`.
   - Función `cacheFirst`.
   - Evento `fetch`.
3. En Chrome abrir **Application > Cache Storage**.
4. Abrir `techvolt-cache-v5`.
5. Mostrar HTML, manifest, iconos e imágenes guardadas.

## 6. Prueba offline

1. Visitar Inicio, Catálogo y un producto estando online.
2. Abrir **Network**.
3. Seleccionar **Offline**.
4. Recargar la página.
5. Navegar por las vistas.
6. Mostrar que las imágenes cargan.
7. Usar el carrito.
8. Volver a **No throttling**.

## 7. Ngrok

1. Mantener `npm run dev` ejecutándose.
2. En otra terminal ejecutar:

```powershell
ngrok http 5173
```

3. Mostrar la URL HTTPS.
4. Abrir TechVolt desde esa dirección.
5. Si aparece la advertencia gratuita de ngrok, pulsar **Visit Site**.

## 8. Lighthouse

1. Detener Vite con `Ctrl + C`.
2. Ejecutar:

```powershell
npm run build
npm run preview
```

3. Abrir `http://127.0.0.1:4173/`.
4. Entrar a **DevTools > Lighthouse**.
5. Pulsar **Analyze page load**.
6. Mostrar las puntuaciones.

## Cierre

> TechVolt utiliza Node.js, npm y Vite. Incluye un manifest instalable, un Service Worker con Cache First, funcionamiento offline, rutas sin hash, carrito persistente, HTTPS mediante ngrok y validación con Lighthouse.

## Lista rápida

- [ ] Node.js y npm.
- [ ] Vite y `package.json`.
- [ ] Inicio, catálogo y detalle.
- [ ] Manifest en código y DevTools.
- [ ] Registro del Service Worker.
- [ ] `install`, `activate`, `fetch` y Cache First.
- [ ] Cache Storage `techvolt-cache-v5`.
- [ ] Navegación offline.
- [ ] URL HTTPS de ngrok.
- [ ] Lighthouse en el puerto 4173.
