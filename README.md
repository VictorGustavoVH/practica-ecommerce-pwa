# TechVolt PWA

Tienda tecnológica educativa desarrollada con Vite, JavaScript vanilla, HTML y CSS.

## Características

- Manifest para instalabilidad y modo independiente (standalone).
- Service Worker con estrategia Cache First y funcionamiento offline.
- Solicitud de permisos de notificación en el navegador mediante Notification API.
- Notificación local de prueba generada directamente por el Service Worker.
- Inicio, catálogo y detalle de productos con carrito persistente en `localStorage`.
- Rutas sin hash: `/`, `/catalogo` y `/producto/:id`.
- Contexto seguro HTTPS mediante ngrok para pruebas en dispositivos móviles.
- Diseño responsivo accesible con menú hamburguesa.

## Instalación y ejecución

### Requisitos

- Node.js y npm.
- Chrome, Edge o Brave.
- Ngrok para compartir la aplicación mediante HTTPS.

### Pasos

1. Instala dependencias:

```powershell
npm install
```

2. Inicia el servidor de desarrollo:

```powershell
npm run dev
```

3. Abre `http://127.0.0.1:5173/`.

### Probar las notificaciones

1. En la página principal, ubica el botón **Activar notificaciones** en la sección hero.
2. Haz clic sobre él; el navegador solicitará permiso.
3. Selecciona **Permitir** (el botón cambiará a **Mostrar notificación**).
4. El Service Worker mostrará la notificación de prueba: *"Las notificaciones de TechVolt funcionan correctamente."* con el icono de TechVolt.
5. Al hacer clic en la notificación, se cerrará y enfocará o abrirá TechVolt.
6. Nuevos clics en **Mostrar notificación** emitirán nuevas notificaciones de prueba de manera directa.

## Compartir con ngrok (HTTPS)

Para probar notificaciones y características PWA desde otros dispositivos (como un teléfono móvil), se requiere HTTPS:

1. Mantén Vite ejecutándose (`npm run dev`).
2. Abre otra terminal y ejecuta:

```powershell
ngrok http 5173
```

3. Abre en tu dispositivo la URL HTTPS entregada por ngrok.

## Producción y Lighthouse

Lighthouse fue verificado previamente obteniendo los resultados esperados para PWA, rendimiento y accesibilidad. Para ejecutar el entorno de producción:

```powershell
npm run build
npm run preview
```

Abre `http://127.0.0.1:4173/`.

## Documentación

- [Guía completa de instalación y solución de problemas](INSTALACION.md)
- [Guion paso a paso para la exposición](GUION-EXPOSICION.md)
