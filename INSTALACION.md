# Instalación de TechVolt

## Requisitos

- Node.js y npm.
- Visual Studio Code u otro editor.
- Chrome, Edge o Brave.
- Ngrok para compartir la aplicación mediante HTTPS.

## Ejecutar el proyecto

1. Abrir una terminal dentro de la carpeta del proyecto.
2. Instalar dependencias:

```powershell
npm install
```

3. Iniciar Vite:

```powershell
npm run dev
```

4. Abrir `http://127.0.0.1:5173/`.

## Rutas

- `/` — Inicio.
- `/catalogo` — Catálogo.
- `/producto/1` — Detalle de producto.

## Compartir con ngrok

1. Mantener Vite ejecutándose.
2. Abrir otra terminal.
3. Ejecutar:

```powershell
ngrok http 5173
```

4. Abrir la URL HTTPS mostrada por ngrok.

## Compilar y usar Lighthouse

1. Detener Vite con `Ctrl + C`.
2. Ejecutar:

```powershell
npm run build
npm run preview
```

3. Abrir `http://127.0.0.1:4173/`.
4. Ejecutar Lighthouse sobre el puerto `4173`, no sobre `5173`.

## Si aparece una versión anterior

1. Abrir DevTools.
2. Entrar a **Application > Storage**.
3. Pulsar **Clear site data**.
4. Entrar a **Application > Service Workers**.
5. Pulsar **Unregister** y recargar la página.

La caché actual debe llamarse `techvolt-cache-v5`.
