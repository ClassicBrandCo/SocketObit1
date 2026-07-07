const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("profilePreload", {
  launch: (payload) => ipcRenderer.invoke("profiles:launch", payload),
});
