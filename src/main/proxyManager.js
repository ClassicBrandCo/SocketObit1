import fs from "fs";
import path from "path";
import { app } from "electron";

function proxyPath() {
  const base = app.isReady() ? app.getPath("userData") : process.cwd();
  return path.join(base, "proxy-store.json");
}

function readStore() {
  try {
    if (fs.existsSync(proxyPath())) {
      return JSON.parse(fs.readFileSync(proxyPath(), "utf8"));
    }
  } catch {}
  return [];
}

function writeStore(items) {
  fs.writeFileSync(proxyPath(), JSON.stringify(items, null, 2), "utf8");
  return items;
}

export function listProxies() {
  return readStore();
}

export function createProxy(payload) {
  const items = readStore();
  const proxy = { id: crypto.randomUUID(), active: true, ...payload };
  items.push(proxy);
  return writeStore(items);
}

export function updateProxy(id, patch) {
  const items = readStore().map((item) => (item.id === id ? { ...item, ...patch } : item));
  writeStore(items);
  return items.find((item) => item.id === id);
}

export function deleteProxy(id) {
  const items = readStore().filter((item) => item.id !== id);
  writeStore(items);
  return { ok: true };
}

export async function verifyProxy(proxy) {
  return { ok: true, proxy, reachable: true };
}

export async function resolveProxy(proxy) {
  return { ok: true, proxy, host: proxy?.host || null };
}
