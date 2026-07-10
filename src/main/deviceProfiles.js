import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

function resolveDeviceProfilesPath() {
  const tried = [];

  try {
    if (typeof process !== "undefined" && process.resourcesPath) {
      // Primary: extraResources mapped to resources/deviceProfiles.json
      const primary = path.join(process.resourcesPath, "deviceProfiles.json");
      tried.push(primary);
      if (fs.existsSync(primary)) return { path: primary, tried };

      // Fallback: asar unpacked location
      const fallback = path.join(
        process.resourcesPath,
        "app.asar.unpacked",
        "src",
        "main",
        "deviceProfiles.json",
      );
      tried.push(fallback);
      if (fs.existsSync(fallback)) return { path: fallback, tried };
    }
  } catch (err) {
    // Log the error but continue to dev fallback
    console.warn("Error while checking resourcesPath locations for deviceProfiles.json:", err && err.stack ? err.stack : err);
  }

  // Dev fallback: module-relative path (src/main/deviceProfiles.json)
  const dev = path.join(path.dirname(fileURLToPath(import.meta.url)), "deviceProfiles.json");
  tried.push(dev);
  if (fs.existsSync(dev)) return { path: dev, tried };

  return { path: null, tried };
}

let deviceProfiles = [];

try {
  const result = resolveDeviceProfilesPath();
  if (!result.path) {
    console.error("deviceProfiles.json not found. Paths tried (exact):\n" + result.tried.join("\n"));
    throw new Error(`deviceProfiles.json not found. Paths tried:\n${result.tried.join("\n")}`);
  }

  const content = fs.readFileSync(result.path, "utf8");
  deviceProfiles = JSON.parse(content);
} catch (err) {
  console.error("Failed to load deviceProfiles.json. See paths tried above.", err && err.stack ? err.stack : err);
  throw new Error(`Failed to load deviceProfiles.json: ${err && err.message ? err.message : String(err)}`);
}

export function listDeviceProfiles() {
  return deviceProfiles;
}

export function getDeviceProfile(id) {
  return deviceProfiles.find((profile) => profile.id === id) || deviceProfiles[0];
}
