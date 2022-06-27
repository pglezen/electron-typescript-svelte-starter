import { app , BrowserWindow, ipcMain } from 'electron';
import type { IpcMainEvent } from 'electron';
import * as path from 'path';

import { addMenus } from './Menu';
import Logger from './Logger';

const logger = new Logger();
logger.addLog('Sample App starting');

ipcMain.on('export-logs', (evt: IpcMainEvent) => {
  console.log('Main process: export logs');
  logger.exportLog();
})

let mainWindow: BrowserWindow | undefined;
let logsWindow: BrowserWindow | undefined;


const showLogs = () => {
  logger.addLog('Opening logs window');
  if (logsWindow === undefined) {
    logsWindow = new BrowserWindow({
      width: 800, minWidth: 200,
      x: 200, y: 20,
      backgroundColor: '#555',
      webPreferences: {
        devTools: true,
        preload: path.join(app.getAppPath(), 'dist', 'log-preload.js'),
      },
    });
    logsWindow.loadFile(path.join('dist', 'logsWindow', 'index.html'));
    logsWindow.webContents.on('did-finish-load', () => {
      logger.addLog(`Log window loaded, sending it ${logger.logs.length} log records`);
      logsWindow?.webContents?.send('populate-log-store', logger.logs);
    });
    logsWindow?.on('closed', () => {
      logger.logContents = undefined;
      logger.mainContents = undefined;
      logsWindow = undefined;
    });
    logger.logContents = logsWindow?.webContents;
    logger.mainContents = mainWindow?.webContents;
  } else {
    logger.addLog('logsWindow already open');
  }
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      devTools: true,
      preload: path.join(app.getAppPath(), 'dist', 'preload.js'),
    }
  });
  addMenus(showLogs); 
  mainWindow.loadFile(path.join('dist', 'mainWindow', 'index.html'));
};

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  logger.addLog('App received close event');
  app.quit();
});
