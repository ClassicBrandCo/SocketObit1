import { createClient } from "@supabase/supabase-js";
import { app, dialog } from "electron";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import WebSocket from "ws";
import { getAuthStorage } from "./store.js";

if (!globalThis.WebSocket) {
  globalThis.WebSocket = WebSocket;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let cachedConfig = null;
let cachedClient = null;

function loadJsonConfig(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
  } catch {
    return null;
  }
  return null;
}

export function resolveConfig() {
  const candidates = [
    process.env,
    process.resourcesPath ? loadJsonConfig(path.join(process.resourcesPath, "config.json")) : null,
    loadJsonConfig(path.join(process.cwd(), "config.json")),
    loadJsonConfig(path.join(__dirname, "config.json")),
  ];
  const source = candidates.find((value) => value && value.SUPABASE_URL && value.SUPABASE_ANON_KEY) || null;
  return source;
}

export function getConfig() {
  if (cachedConfig) return cachedConfig;
  cachedConfig = resolveConfig();
  return cachedConfig;
}

export function isConfigMissing() {
  return !getConfig();
}

export function showMissingConfigAndQuit() {
  dialog.showErrorBox("Missing configuration", "SocketObit configuration could not be loaded.");
  if (app.isReady()) {
    app.quit();
  } else {
    app.whenReady().then(() => app.quit());
  }
}

export function getSupabase() {
  if (cachedClient) return cachedClient;
  const config = getConfig();
  if (!config) return null;
  cachedClient = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY, {
    auth: {
      storage: getAuthStorage(),
      autoRefreshToken: true,
      detectSessionInUrl: false,
      persistSession: true,
    },
  });
  return cachedClient;
}
