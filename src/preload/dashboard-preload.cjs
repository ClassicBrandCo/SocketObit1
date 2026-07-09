const { contextBridge, ipcRenderer } = require("electron");

function invoke(channel, payload) {
  return ipcRenderer.invoke(channel, payload);
}

contextBridge.exposeInMainWorld("socketobit", {
  auth: {
    signUp: (payload) => invoke("auth:signUp", payload),
    signIn: (payload) => invoke("auth:signIn", payload),
    signOut: () => invoke("auth:signOut"),
    getSession: () => invoke("auth:getSession"),
    getOrgIds: () => invoke("auth:getOrgIds"),
  },
  roles: {
    list: (orgId) => invoke("roles:list", { orgId }),
    create: (payload) => invoke("roles:create", payload),
    update: (payload) => invoke("roles:update", payload),
    delete: (payload) => invoke("roles:delete", payload),
  },
  members: {
    list: (orgId) => invoke("members:list", { orgId }),
    listPotentialManagers: (orgId) => invoke("members:listPotentialManagers", { orgId }),
    listGroups: (orgId) => invoke("members:listGroups", { orgId }),
    getSeatLimit: (orgId) => invoke("members:getSeatLimit", { orgId }),
    create: (payload) => invoke("members:create", payload),
    update: (payload) => invoke("members:update", payload),
    delete: (payload) => invoke("members:delete", payload),
  },
  profiles: {
    list: () => invoke("profiles:list"),
    create: (payload) => invoke("profiles:create", payload),
    update: (payload) => invoke("profiles:update", payload),
    delete: (payload) => invoke("profiles:delete", payload),
    open: (payload) => invoke("profiles:open", payload),
    close: (payload) => invoke("profiles:close", payload),
    launch: (payload) => invoke("profiles:launch", payload),
    duplicate: (payload) => invoke("profiles:duplicate", payload),
    generateFingerprint: (payload) => invoke("profiles:generateFingerprint", payload),
  },
  proxies: {
    list: () => invoke("proxies:list"),
    create: (payload) => invoke("proxies:create", payload),
    update: (payload) => invoke("proxies:update", payload),
    delete: (payload) => invoke("proxies:delete", payload),
    verify: (payload) => invoke("proxies:verify", payload),
    resolve: (payload) => invoke("proxies:resolve", payload),
  },
  settings: {
    get: () => invoke("settings:get"),
    set: (patch) => invoke("settings:set", patch),
  },
});
