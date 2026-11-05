import cp from "child_process";
import fs from "fs";
import path from "path";

const PORT = 9225;
const BASE_URL = process.env.URL || "http://localhost:4173";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = path.resolve("public/screenshots");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && this.callbacks.has(data.id)) {
        const { resolve, reject } = this.callbacks.get(data.id);
        this.callbacks.delete(data.id);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };
  }

  async ready() {
    if (this.ws.readyState === WebSocket.OPEN) return;
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.ws.close();
  }
}

async function capture() {
  console.log("Iniciando Chrome headless...");
  const chromeProc = cp.spawn(CHROME_PATH, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--disable-gpu",
    "--hide-scrollbars",
    "about:blank"
  ]);

  try {
    let version = null;
    for (let i = 0; i < 25; i++) {
      await sleep(200);
      try {
        const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
        version = await res.json();
        break;
      } catch {}
    }

    if (!version) throw new Error("No se pudo conectar a Chrome DevTools Protocol.");

    const browserClient = new CDPClient(version.webSocketDebuggerUrl);
    await browserClient.ready();

    const tasks = [
      {
        name: "screenshot-desktop-home.webp",
        url: `${BASE_URL}/`,
        width: 1280,
        height: 720,
        mobile: false,
        scale: 1
      },
      {
        name: "screenshot-desktop-catalog.webp",
        url: `${BASE_URL}/catalogo`,
        width: 1280,
        height: 720,
        mobile: false,
        scale: 1
      },
      {
        name: "screenshot-mobile-home.webp",
        url: `${BASE_URL}/`,
        width: 750,
        height: 1334,
        mobile: true,
        scale: 1
      },
      {
        name: "screenshot-mobile-catalog.webp",
        url: `${BASE_URL}/catalogo`,
        width: 750,
        height: 1334,
        mobile: true,
        scale: 1
      }
    ];

    for (const task of tasks) {
      console.log(`Capturando ${task.name}...`);
      const { targetId } = await browserClient.send("Target.createTarget", { url: "about:blank" });
      const targetWsUrl = `ws://127.0.0.1:${PORT}/devtools/page/${targetId}`;
      const pageClient = new CDPClient(targetWsUrl);
      await pageClient.ready();

      await pageClient.send("Emulation.setDeviceMetricsOverride", {
        width: task.width,
        height: task.height,
        deviceScaleFactor: task.scale,
        mobile: task.mobile
      });

      await pageClient.send("Page.enable");
      await pageClient.send("Page.navigate", { url: task.url });
      await sleep(1200);

      const screenshot = await pageClient.send("Page.captureScreenshot", {
        format: "webp",
        quality: 85
      });

      const buffer = Buffer.from(screenshot.data, "base64");
      const outputPath = path.join(OUTPUT_DIR, task.name);
      fs.writeFileSync(outputPath, buffer);
      console.log(`Guardado: ${outputPath}`);

      pageClient.close();
      await browserClient.send("Target.closeTarget", { targetId });
    }

    browserClient.close();
    console.log("Completado.");
  } finally {
    chromeProc.kill();
  }
}

capture().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
