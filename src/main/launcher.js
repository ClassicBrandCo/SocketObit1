import { startEmulation } from "./emulation.js";

export async function launchProfile(profile) {
  await startEmulation(profile);
  return { ok: true, profile };
}
