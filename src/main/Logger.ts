// Requirements
//   Register a hot key to dump to a file.

import { dialog, WebContents } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { EOL } from 'os';
import { DateTime } from 'luxon';
import type { LogRecord } from '../logs';

class Logger {
  logs: LogRecord[] = [];
  logContents: WebContents | undefined;
  mainContents: WebContents | undefined;

  addLog(message: string, error = false): void {
    const timestamp = DateTime.now().toISO();
    this.logs.push({timestamp, message, error});
    if (this.logContents === undefined) {
      const msg = `${timestamp}: ${message}`;
      if (error) {
        console.error(msg);
      } else {
        console.log(msg);
      }
    } else {
      this.logContents?.send('add-log', {timestamp, message, error});
    }
    this.mainContents?.send('add-log', {timestamp, message, error});
  }

  addError(message: string): void {
    this.addLog(message, true);
  }

  exportLog(): void {
    if (this.logs.length === 0) {
      dialog.showMessageBoxSync({
        message: 'No log messages to show',
        type: 'info',
        buttons: ['Dismiss'],
        defaultId: 0
      });
    } else {
      const logFilename = dialog.showSaveDialogSync({
        title: "Main Process Log Export",
        buttonLabel: "Export",
        message: "Export Main Process logs to a file",
        nameFieldLabel: "Log File",
        showsTagField: false,
        properties: [ 'createDirectory' ]
      });
      if (logFilename !== undefined) {
        console.log(`Saving file to ${logFilename}`);
        try {
          const logLines = this.logs.map((r: LogRecord) => `${r.timestamp} ${r.message}`).join(EOL) + EOL;
          fs.writeFileSync(logFilename, logLines, {flag: 'a'});
          dialog.showMessageBoxSync({
            message: `Browser log appended ${this.logs.length} lines to ${path.basename(logFilename)}`,
            type: 'info',
            buttons: ['Dismiss'],
            defaultId: 0
          });
        } catch (err: any) {
          console.error(`Failed to export log with message ${err.message}`);
          dialog.showErrorBox('Log Export Failed', err.message);
        }
      }
    }
  }
}

export default Logger;