const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  autoSaveFile: data => ipcRenderer.invoke('file:autosave', data),
  saveFile: data => ipcRenderer.invoke('file:save', data),
  loadFile: () => ipcRenderer.invoke('file:load')
});
