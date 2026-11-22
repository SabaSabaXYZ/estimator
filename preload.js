const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveFile: data => ipcRenderer.invoke('file:save', data),
  loadFile: () => ipcRenderer.invoke('file:load')
});
