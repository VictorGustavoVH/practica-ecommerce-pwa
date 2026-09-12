# TechVolt PWA

Tienda tecnológica educativa desarrollada con Vite, JavaScript vanilla, HTML y CSS.

## Características

- Inicio, catálogo y detalle de productos.
- Carrito persistente con `localStorage`.
- Rutas sin hash: `/`, `/catalogo` y `/producto/:id`.
- Manifest, Service Worker y funcionamiento offline.
- Diseño responsivo con menú hamburguesa.

## Instalación y ejecución

### Requisitos

- Node.js y npm.
- Chrome, Edge o Brave.
- Ngrok opcional para compartir la aplicación mediante HTTPS.

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

## Producción y Lighthouse

```powershell
npm run build
npm run preview
```

Abre `http://127.0.0.1:4173/` y ejecuta Lighthouse en ese puerto.

## Documentación

- [Guía completa de instalación](INSTALACION.md)
- [Guion sencillo para la exposición](GUION-EXPOSICION.md)

## Compartir con ngrok

Con Vite ejecutándose, abre otra terminal y ejecuta:

```powershell
ngrok http 5173
```

Abre la URL HTTPS que entregue ngrok.
