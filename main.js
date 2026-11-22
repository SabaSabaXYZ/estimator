const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');

ipcMain.handle('file:save', async (_event, content) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Save Estimation',
    defaultPath: path.join(app.getPath('documents'), 'estimation.json'),
    filters: [{ name: 'JSON Files', extensions: ['json'] }]
  });
  if (canceled || !filePath) {
    return { success: false };
  }
  await fs.writeFile(filePath, JSON.stringify(content, null, 2), 'utf-8');
  return { success: true, filePath };
});

ipcMain.handle('file:load', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Load Estimation',
    properties: ['openFile'],
    filters: [{ name: 'JSON Files', extensions: ['json'] }]
  });
  if (canceled || filePaths.length === 0) {
    return { success: false };
  }
  const raw = await fs.readFile(filePaths[0], 'utf-8');
  return { success: true, data: JSON.parse(raw), filePath: filePaths[0] };
});

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Estimator',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.loadFile(path.join(__dirname, 'dist/estimator/browser/index.html'))
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
