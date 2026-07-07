import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const deviceProfiles = JSON.parse(
  fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "deviceProfiles.json"), "utf8"),
);

export function listDeviceProfiles() {
  return deviceProfiles;
}

export function getDeviceProfile(id) {
  return deviceProfiles.find((profile) => profile.id === id) || deviceProfiles[0];
}
