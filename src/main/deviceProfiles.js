import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve the deviceProfiles.json path so this works both in dev and when the app is packaged.
function resolveDeviceProfilesPath() {
  // 1) If the app has been packaged and electron-builder unpacked this file, it will live in
  //    resources/app.asar.unpacked/<relative-path>
  if (process && process.resourcesPath) {
    const unpacked = path.join(process.resourcesPath, "app.asar.unpacked", "src", "main", "deviceProfiles.json");
    if (fs.existsSync(unpacked)) return unpacked;

    // 2) If the file ended up inside the asar archive, access it via the app.asar path
    const asarPath = path.join(process.resourcesPath, "app.asar", "src", "main", "deviceProfiles.json");
    if (fs.existsSync(asarPath)) return asarPath;
  }

  // 3) Fallback to the module-relative path (works in dev and also when the module is loaded from within an asar)
  return path.join(path.dirname(fileURLToPath(import.meta.url)), "deviceProfiles.json");
}

const deviceProfilesPath = resolveDeviceProfilesPath();
const deviceProfiles = JSON.parse(fs.readFileSync(deviceProfilesPath, "utf8"));

export function listDeviceProfiles() {
  return deviceProfiles;
}

export function getDeviceProfile(id) {
  return deviceProfiles.find((profile) => profile.id === id) || deviceProfiles[0];
}
