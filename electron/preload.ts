import { contextBridge } from "electron";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electron", {
  env: {
    // Inject the dynamic API URL (e.g. http://localhost:45321) determined by the main process
    // This allows the frontend to talk to the specific spawned backend instance
    API_URL: process.env.ELECTRON_API_URL || "",
  },
});
