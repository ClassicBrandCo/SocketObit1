import { getDeviceProfile } from "./deviceProfiles.js";

export function generateFingerprint(profileId = "win11-chrome") {
  const profile = getDeviceProfile(profileId);
  return {
    userAgent: `Mozilla/5.0 (${profile.platform}) SocketObit`,
    platform: profile.platform,
    vendor: profile.vendor,
    languages: profile.languages,
    screen: { width: 1920, height: 1080, colorDepth: 24 },
    canvas: `${profile.id}-canvas`,
    webgl: `${profile.id}-webgl`,
  };
}
