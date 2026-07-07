import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("profilePreload", {
  launch: (payload) => ipcRenderer.invoke("profiles:launch", payload),
});
