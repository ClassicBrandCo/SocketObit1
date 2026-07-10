import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

function resolveDeviceProfilesPath() {
  // 1) Top-level extraResources (recommended) -> resources/deviceProfiles.json
  try {
    if (process && process.resourcesPath) {
      const topLevel = path.join(process.resourcesPath, "deviceProfiles.json");
      if (fs.existsSync(topLevel)) return topLevel;

      // 2) asar unpacked path -> resources/app.asar.unpacked/src/main/deviceProfiles.json
      const unpacked = path.join(process.resourcesPath, "app.asar.unpacked", "src", "main", "deviceProfiles.json");
      if (fs.existsSync(unpacked)) return unpacked;

      // 3) inside app.asar -> resources/app.asar/src/main/deviceProfiles.json
      const inAsar = path.join(process.resourcesPath, "app.asar", "src", "main", "deviceProfiles.json");
      if (fs.existsSync(inAsar)) return inAsar;
    }
  } catch (err) {
    // if anything odd happens while checking paths, ignore and fall back to dev path
    console.warn("deviceProfiles path checks failed:", err);
  }

  // 4) Dev fallback: module-relative path (e.g., src/main/deviceProfiles.json during development)
  return path.join(path.dirname(fileURLToPath(import.meta.url)), "deviceProfiles.json");
}

let deviceProfiles = [];

try {
  const deviceProfilesPath = resolveDeviceProfilesPath();
  if (!fs.existsSync(deviceProfilesPath)) {
    throw new Error(`deviceProfiles.json not found at resolved path: ${deviceProfilesPath}`);
  }
  const content = fs.readFileSync(deviceProfilesPath, "utf8");
  deviceProfiles = JSON.parse(content);
} catch (err) {
  // Log a helpful error and rethrow so the main process can handle/exit gracefully
  console.error(
    "Failed to load deviceProfiles.json. Looked in: 1) process.resourcesPath/deviceProfiles.json, 2) app.asar.unpacked/src/main/deviceProfiles.json, 3) app.asar/src/main/deviceProfiles.json, 4) src/main/deviceProfiles.json (dev).",
  );
  console.error(err && err.stack ? err.stack : err);
  // Re-throw a clearer error to be handled upstream (or crash early)
  throw new Error(`Failed to load deviceProfiles.json: ${err && err.message ? err.message : String(err)}`);
}

export function listDeviceProfiles() {
  return deviceProfiles;
}

export function getDeviceProfile(id) {
  return deviceProfiles.find((profile) => profile.id === id) || deviceProfiles[0];
}
