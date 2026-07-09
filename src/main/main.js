import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { isConfigMissing, showMissingConfigAndQuit } from "./supabaseClient.js";
import { signUp, signIn, signOut, getSession, getCurrentOrgIds, toClientError } from "./authClient.js";
import { listRoles, createRole, updateRole, deleteRole } from "./rolesClient.js";
import { listMembers, listPotentialManagers, listGroups, getSeatLimit, createMember, updateMember, deleteMember } from "./membersClient.js";
import { getSettings, setSettings } from "./store.js";
import { listProfiles, createProfile, updateProfile, deleteProfile } from "./profileManager.js";
import { listProxies, createProxy, updateProxy, deleteProxy, verifyProxy, resolveProxy } from "./proxyManager.js";
import { launchProfile } from "./launcher.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow = null;

function register(handlerName, fn) {
  ipcMain.handle(handlerName, async (_event, payload) => {
    try {
      return await fn(payload);
    } catch (error) {
      throw toClientError(error, `${handlerName} failed`);
    }
  });
}

function registerHandlers() {
  register("auth:signUp", signUp);
  register("auth:signIn", signIn);
  register("auth:signOut", signOut);
  register("auth:getSession", getSession);
  register("auth:getOrgIds", getCurrentOrgIds);

  register("roles:list", ({ orgId }) => listRoles(orgId));
  register("roles:create", (payload) => createRole(payload));
  register("roles:update", (payload) => updateRole(payload));
  register("roles:delete", ({ roleId }) => deleteRole({ roleId }));

  register("members:list", ({ orgId }) => listMembers(orgId));
  register("members:listPotentialManagers", ({ orgId }) => listPotentialManagers(orgId));
  register("members:listGroups", ({ orgId }) => listGroups(orgId));
  register("members:getSeatLimit", ({ orgId }) => getSeatLimit(orgId));
  register("members:create", createMember);
  register("members:update", updateMember);
  register("members:delete", deleteMember);

  register("profiles:list", () => listProfiles());
  register("profiles:create", createProfile);
  register("profiles:update", ({ id, patch }) => updateProfile(id, patch));
  register("profiles:delete", ({ id }) => deleteProfile(id));
  register("profiles:open", async (payload) => ({ ok: true, payload }));
  register("profiles:close", async (payload) => ({ ok: true, payload }));
  register("profiles:launch", launchProfile);
  register("profiles:duplicate", async (payload) => ({ ok: true, payload }));
  register("profiles:generateFingerprint", async (payload) => ({ ok: true, payload }));

  register("proxies:list", () => listProxies());
  register("proxies:create", createProxy);
  register("proxies:update", ({ id, patch }) => updateProxy(id, patch));
  register("proxies:delete", ({ id }) => deleteProxy(id));
  register("proxies:verify", verifyProxy);
  register("proxies:resolve", resolveProxy);

  register("settings:get", () => getSettings());
  register("settings:set", (patch) => setSettings(patch));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    backgroundColor: "#0f1117",
    webPreferences: {
      preload: path.join(__dirname, "../preload/dashboard-preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  mainWindow.removeMenu();
  const indexPath = path.join(app.getAppPath(), "dist/renderer/index.html");
  mainWindow.loadFile(indexPath);
}

app.whenReady().then(() => {
  if (isConfigMissing()) {
    showMissingConfigAndQuit();
    return;
  }
  registerHandlers();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
