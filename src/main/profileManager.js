import fs from "fs";
import path from "path";
import { app } from "electron";
import { generateFingerprint } from "./fingerprintGenerator.js";

function profilePath() {
  const base = app.isReady() ? app.getPath("userData") : process.cwd();
  return path.join(base, "profile-store.json");
}

function readStore() {
  try {
    if (fs.existsSync(profilePath())) {
      return JSON.parse(fs.readFileSync(profilePath(), "utf8"));
    }
  } catch {}
  return [];
}

function writeStore(items) {
  fs.writeFileSync(profilePath(), JSON.stringify(items, null, 2), "utf8");
  return items;
}

export function listProfiles() {
  return readStore();
}

export function createProfile(payload) {
  const items = readStore();
  const profile = {
    id: crypto.randomUUID(),
    name: payload.name || "Profile",
    remark: payload.remark || "",
    status: payload.status || "stopped",
    fingerprint: payload.fingerprint || generateFingerprint(payload.deviceProfileId),
    ...payload,
  };
  items.push(profile);
  return writeStore(items);
}

export function updateProfile(id, patch) {
  const items = readStore().map((item) => (item.id === id ? { ...item, ...patch } : item));
  writeStore(items);
  return items.find((item) => item.id === id);
}

export function deleteProfile(id) {
  const items = readStore().filter((item) => item.id !== id);
  writeStore(items);
  return { ok: true };
}
