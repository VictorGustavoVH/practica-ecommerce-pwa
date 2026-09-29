# Guion de exposición

## Antes de comenzar

- Abrir el proyecto en Visual Studio Code.
- Terminal 1: ejecutar `npm run dev`.
- Terminal 2: ejecutar `ngrok http 5173`.
- Abrir la URL HTTPS proporcionada por ngrok en el navegador (o `http://127.0.0.1:5173/`).
- Abrir DevTools con `F12`.

---

## 1. ¿Qué hace que TechVolt sea una PWA?

Mostrar en el editor:
- `public/manifest.json`
- `src/main.js`
- `public/service-worker.js`

Qué decir:
"TechVolt es una Progressive Web App porque reúne los pilares fundamentales del estándar: un archivo Manifest que define identidad e instalabilidad, un Service Worker que gestiona caché y eventos en segundo plano, y la ejecución sobre un contexto seguro HTTPS."

---

## 2. Manifest

Abrir `public/manifest.json` (líneas 1 a 31):

- `"name": "TechVolt - Accesorios Tecnológicos"` y `"short_name": "TechVolt"` (líneas 2-3)  
  Qué decir:  
  "Definen el nombre completo y el nombre corto que se muestra bajo el icono instalado."

- `"start_url": "./"` (línea 5)  
  Qué decir:  
  "Indica la ruta inicial que debe abrirse al iniciar la aplicación instalada."

- `"display": "standalone"` (línea 7)  
  Qué decir:  
  "Esto permite que al instalarse la aplicación se abra como una aplicación independiente, sin la barra de direcciones del navegador."

- `"icons": [...]` (líneas 12-31)  
  Qué decir:  
  "Proporciona los iconos en diferentes tamaños y formatos, incluyendo el modo maskable para adaptarse a cualquier pantalla móvil."

---

## 3. Registro del Service Worker

Abrir `src/main.js` (líneas 64 a 73):

- `if ("serviceWorker" in navigator)` (línea 64)  
  Qué decir:  
  "Primero comprobamos si el navegador soporta Service Workers."

- `const registration = await navigator.serviceWorker.register(serviceWorkerUrl);` (línea 68)  
  Qué decir:  
  "Aquí registramos nuestro Service Worker para que tome el control de la aplicación."

En DevTools:
- Ir a **Application > Service Workers**.
- Mostrar que el archivo `service-worker.js` está con estado **activated and running**.

---

## 4. Solicitud de permiso y dinamismo del botón

Abrir `src/main.js` (líneas 79 a 115):

- `if (!("Notification" in window))` (línea 84)  
  Qué decir:  
  "Comprobamos si el navegador cuenta con soporte para la API de notificaciones."

- `const permission = await Notification.requestPermission();` (línea 90)  
  Qué decir:  
  "Esta línea abre la solicitud de permiso del navegador ante una acción del usuario."

- `button.textContent = "Mostrar notificación";` (línea 95)  
  Qué decir:  
  "Al conceder el permiso, cambiamos dinámicamente el texto del botón a 'Mostrar notificación' para que en las siguientes pulsaciones se puedan disparar nuevas notificaciones de prueba de forma directa sin volver a solicitar permiso."

---

## 5. Comunicación con el Service Worker

Abrir `src/main.js` (líneas 98 a 104):

- `const registration = await navigator.serviceWorker.ready;` (línea 98)  
  Qué decir:  
  "Esperamos a que el Service Worker esté activo y listo para comunicarse."

- Fragmento de envío:
  ```javascript
  registration.active.postMessage({
    type: "SHOW_TEST_NOTIFICATION"
  });
  ```
  (líneas 101-103)  
  Qué decir:  
  "Desde la página mandamos un mensaje al Service Worker indicándole que muestre una notificación."

---

## 6. Mostrar la notificación y personalización de iconos

Abrir `public/service-worker.js` (líneas 170 a 178):

- `self.addEventListener("message", (event) => {` (línea 170)  
  Qué decir:  
  "El Service Worker escucha los mensajes enviados por la aplicación."

- Fragmento de la notificación:
  ```javascript
  self.registration.showNotification("TechVolt", {
    body: "Las notificaciones de TechVolt funcionan correctamente.",
    icon: "./icons/icon-192.png"
  });
  ```
  (líneas 173-176)  
  Qué decir:  
  "Esta línea es la que genera la notificación del sistema a través del Service Worker."

- Detalle técnico sobre el icono (`icon` vs `badge` en Android):  
  Qué decir:  
  "En la propiedad `icon` enviamos el logo a color de TechVolt, que se aprecia a la derecha en la notificación. En sistemas como Android, si se define la propiedad `badge`, el sistema operativo exige una máscara monocromática alfa; si se le pasa una imagen con fondo opaco, Android la dibuja como un bloque blanco sólido. Por ello, usamos `icon` para el logo del producto y dejamos que el sistema gestione limpiamente el distintivo de la aplicación."

---

## 7. Clic en la notificación

Abrir `public/service-worker.js` (líneas 181 a 198):

- `self.addEventListener("notificationclick", (event) => {` (línea 181)  
  Qué decir:  
  "Aquí detectamos cuando el usuario presiona la notificación."

- `event.notification.close();` (línea 183)  
  Qué decir:  
  "Cerramos la notificación una vez que el usuario interactúa con ella."

- `return client.focus();` (línea 190) y `return clients.openWindow("./");` (línea 194)  
  Qué decir:  
  "Si TechVolt ya está abierta la enfocamos; si no, abrimos la aplicación."

---

## 8. Prueba en vivo

Seguir estos pasos en orden:

1. Abrir la URL HTTPS de ngrok en el navegador (móvil o PC).
2. Verificar que el botón muestre **Activar notificaciones**.
3. Presionar **Activar notificaciones**.
4. Aceptar el diálogo de permisos seleccionando **Permitir**.
5. Comprobar que el botón cambia automáticamente a **Mostrar notificación**.
6. Observar la notificación del sistema en la pantalla con el texto *"Las notificaciones de TechVolt funcionan correctamente."* y el logo de TechVolt a la derecha.
7. Cambiar a otra pestaña o minimizar el navegador y hacer clic sobre la notificación.
8. Comprobar que TechVolt se enfoca o se abre de inmediato en la pantalla.
9. Volver a presionar **Mostrar notificación** para demostrar que se pueden emitir nuevas notificaciones directas sin pedir permisos repetitivos.

---

## 9. Background Sync

Explicación conceptual:

"Background Sync permite dejar una operación pendiente cuando no tenemos conexión. Cuando Internet regresa, el Service Worker puede intentar sincronizar esa información. Por ejemplo, podría utilizarse para enviar posteriormente un pedido o datos guardados mientras estábamos offline."

Aclaración importante:
"En nuestra práctica, la resiliencia offline ya está implementada y funcional mediante la caché del Service Worker (`techvolt-cache-v2`), mientras que Background Sync se explica como la base conceptual para el envío diferido de datos."

---

## 10. Ngrok y HTTPS

Mostrar las dos terminales:
- Terminal 1: `npm run dev`
- Terminal 2: `ngrok http 5173`

Qué decir:
"Los Service Workers y varias funciones de una PWA requieren un contexto seguro. Para la demostración utilizamos la URL HTTPS proporcionada por ngrok, lo que nos permite probar notificaciones e instalación tanto en computadoras como en teléfonos móviles."

---

## 11. Lighthouse

Mención breve:
"Previamente se realizó la auditoría formal con Lighthouse sobre el bundle de producción (`npm run build` y `npm run preview` en el puerto 4173), verificando con éxito los criterios de PWA, rendimiento y accesibilidad."

---

## Cierre

"TechVolt integra los requerimientos esenciales de una Progressive Web App moderna. Demostramos el uso de Manifest para la instalación, Service Worker con estrategia Cache First para soporte offline y un flujo nativo de notificaciones locales con solicitud de permisos y respuesta al clic. Gracias al túnel HTTPS de ngrok, la solución es completamente funcional y verificable en cualquier dispositivo."

---

## Líneas que debemos explicar

| Archivo | Código o línea | Qué explicamos |
| :--- | :--- | :--- |
| `public/manifest.json` | Líneas 2-7 (`name`, `start_url`, `display`) | Identidad, ruta de arranque y modo independiente de la PWA. |
| `src/main.js` | Línea 64 (`if ("serviceWorker" in navigator)`) | Comprueba si el navegador soporta Service Workers. |
| `src/main.js` | Línea 68 (`navigator.serviceWorker.register(...)`) | Registra el Service Worker en la aplicación. |
| `src/main.js` | Línea 84 (`if (!("Notification" in window))`) | Comprueba si el navegador soporta la API de notificaciones. |
| `src/main.js` | Línea 90 (`Notification.requestPermission()`) | Abre la ventana de solicitud de permiso al usuario. |
| `src/main.js` | Línea 93 (`permission === "granted"`) | Valida que el usuario haya aceptado recibir notificaciones. |
| `src/main.js` | Línea 95 (`button.textContent = "Mostrar notificación"`) | Actualiza el botón tras conceder el permiso. |
| `src/main.js` | Línea 98 (`navigator.serviceWorker.ready`) | Espera a que el Service Worker esté activo y listo. |
| `src/main.js` | Líneas 101-103 (`registration.active.postMessage(...)`) | Envía el mensaje con la instrucción al Service Worker. |
| `src/main.js` | Líneas 110-114 (`Notification.permission === "granted"`) | Mantiene el texto "Mostrar notificación" si el permiso ya existía al cargar. |
| `public/service-worker.js` | Línea 170 (`addEventListener("message", ...)`) | El Service Worker recibe la orden enviada desde la página. |
| `public/service-worker.js` | Líneas 173-176 (`self.registration.showNotification(...)`) | Genera la notificación con título, cuerpo e icono del logo. |
| `public/service-worker.js` | Línea 181 (`addEventListener("notificationclick", ...)`) | Detecta la interacción del usuario al hacer clic en la notificación. |
| `public/service-worker.js` | Línea 183 (`event.notification.close()`) | Cierra la notificación activa tras el clic. |
| `public/service-worker.js` | Líneas 187-195 (`clients.matchAll` / `client.focus` / `openWindow`) | Enfoca la pestaña existente de TechVolt o abre una nueva ventana. |
