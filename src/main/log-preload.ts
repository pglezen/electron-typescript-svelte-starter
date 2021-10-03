const { contextBridge, ipcRenderer } = require('electron');
import type { IpcRendererEvent } from 'electron';
import type { LogRecord } from '../logs';

// IPC used by Log Window
//
contextBridge.exposeInMainWorld('log', {
  onAddLogRecord: (callback: (evt: IpcRendererEvent, r: LogRecord) => void) => {
    ipcRenderer.on('add-log-record', callback);
  },
  onPopulateLogStore: (callback: (evt: IpcRendererEvent, records: LogRecord[]) => void) => {
    ipcRenderer.on('populate-log-store', callback);
  },
  exportLogs: () => ipcRenderer.send('export-logs')
})