import { resolve } from "path";

export default {
  base: "./",
  server: {
    host: "0.0.0.0",
    allowedHosts: [".ngrok-free.dev", ".ngrok-free.app", ".ngrok.app"]
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        catalogo: resolve(__dirname, "catalogo.html")
      }
    }
  }
};
