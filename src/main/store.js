import Store from "electron-store";
import { app } from "electron";

const settingsSchema = {
  defaultStartUrl: { type: "string", default: "https://example.com" },
  proxyTestUrl: { type: "string", default: "http://ip-api.com/json" },
  proxyTestTimeoutMs: { type: "number", default: 10000 },
};

function resolveStoreOptions() {
  const baseDir = app.isReady() ? app.getPath("userData") : process.cwd();
  return { cwd: baseDir, name: "socketobit" };
}

export function getStore() {
  return new Store({ ...resolveStoreOptions(), defaults: { settings: {}, auth: {}, localData: {} } });
}

export function getSettings() {
  const store = getStore();
  const current = store.get("settings", {});
  return {
    defaultStartUrl: current.defaultStartUrl ?? settingsSchema.defaultStartUrl.default,
    proxyTestUrl: current.proxyTestUrl ?? settingsSchema.proxyTestUrl.default,
    proxyTestTimeoutMs: current.proxyTestTimeoutMs ?? settingsSchema.proxyTestTimeoutMs.default,
  };
}

export function setSettings(patch) {
  const store = getStore();
  const next = { ...getSettings(), ...patch };
  store.set("settings", next);
  return next;
}

export function getAuthStorage() {
  const store = getStore();
  return {
    getItem: (key) => store.get(`auth.${key}`) ?? null,
    setItem: (key, value) => store.set(`auth.${key}`, value),
    removeItem: (key) => store.delete(`auth.${key}`),
  };
}

export function readLocalCollection(name) {
  return getStore().get(`localData.${name}`, []);
}

export function writeLocalCollection(name, value) {
  getStore().set(`localData.${name}`, value);
  return value;
}
