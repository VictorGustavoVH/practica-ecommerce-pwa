# Instalación y Ejecución de TechVolt

Guía paso a paso para instalar, ejecutar y probar la aplicación web progresiva TechVolt.

---

## Requisitos

- Node.js (versión 18 o superior recomendada) y npm.
- Visual Studio Code u otro editor de código.
- Navegador moderno (Chrome, Edge o Brave).
- Ngrok para exponer el servidor local a través de una URL HTTPS segura.

---

## Pasos para ejecutar y probar la PWA

1. **Instalar dependencias:**
   Abrir una terminal en la raíz del proyecto y ejecutar:
   ```powershell
   npm install
   ```

2. **Iniciar el servidor local con Vite:**
   ```powershell
   npm run dev
   ```

3. **Iniciar ngrok para obtener HTTPS:**
   Abrir una segunda terminal y ejecutar:
   ```powershell
   ngrok http 5173
   ```

4. **Abrir la URL HTTPS:**
   Copiar la dirección HTTPS proporcionada por ngrok (o `http://127.0.0.1:5173/` en el navegador local) y abrirla. Si ngrok muestra la pantalla de advertencia gratuita, presionar **Visit Site**.

5. **Presionar "Activar notificaciones":**
   En la sección superior (hero) de la página principal, hacer clic en el botón **Activar notificaciones**.

6. **Aceptar el permiso:**
   Cuando el navegador pregunte si deseas permitir notificaciones del sitio, hacer clic en **Permitir**. El botón cambiará de forma automática a **Mostrar notificación**.

7. **Comprobar la notificación:**
   El Service Worker mostrará de inmediato una notificación con el título **TechVolt**, el logo del producto y el mensaje *"Las notificaciones de TechVolt funcionan correctamente."*. Al hacer clic en ella, la ventana se enfocará o se abrirá la aplicación. Pulsaciones posteriores sobre **Mostrar notificación** dispararán nuevas notificaciones de prueba de forma directa.

---

## Rutas de la aplicación

- `/` — Página de inicio (hero, productos destacados y botón de notificaciones).
- `/catalogo` — Catálogo completo de accesorios tecnológicos.
- `/producto/1` — Detalle del producto destacado.

---

## Solución de problemas

### 1. Las notificaciones fueron bloqueadas anteriormente
Si diste clic en "Bloquear" o el navegador no vuelve a mostrar el diálogo de permisos:
1. En la barra de direcciones del navegador, hacer clic en el icono de candado o configuración del sitio (a la izquierda de la URL).
2. Localizar el permiso de **Notificaciones**.
3. Cambiar el valor a **Permitir** (o **Restablecer permisos**).
4. Recargar la página y volver a presionar **Activar notificaciones**.

### 2. Existe un Service Worker o caché antigua
Si la aplicación no refleja cambios recientes o muestra recursos obsoletos:
1. Abrir las herramientas de desarrollo (**F12** o **Ctrl + Shift + I**).
2. Ir a la pestaña **Application** (Aplicación).
3. En la sección lateral izquierda, entrar a **Storage** y hacer clic en **Clear site data** (Limpiar datos del sitio).
4. Entrar a **Application > Service Workers**, ubicar el Service Worker y hacer clic en **Unregister** (Anular registro).
5. Recargar la página (**Ctrl + F5**).
6. Verificar en **Application > Cache Storage** que la caché actual se llame exactamente `techvolt-cache-v2`.

---

## Entorno de producción y Lighthouse

Lighthouse ya fue auditado previamente obteniendo resultados favorables en PWA, rendimiento y accesibilidad. Para verificar el empaquetado de producción:

```powershell
npm run build
npm run preview
```

Abrir `http://127.0.0.1:4173/`.
