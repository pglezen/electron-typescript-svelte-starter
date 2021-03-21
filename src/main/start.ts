import { app , BrowserWindow, dialog, ipcMain } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | undefined;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      devTools: true,
      preload: path.join(app.getAppPath(), 'dist', 'preload.js'),
    }
  });
  mainWindow.loadFile(path.join('dist', 'mainWin', 'index.html'));
};

app.on('ready', createWindow);
app.on('window-all-closed', () => app.quit());