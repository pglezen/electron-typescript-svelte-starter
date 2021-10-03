import { writable } from 'svelte/store';
import type { LogRecord } from '../../logs';

export const logRecords = writable<LogRecord[]>([]);

declare global {
  interface Window {
    log: {
      onAddLogRecord(callback: (e: Event, r: LogRecord) => void): void,
      onPopulateLogStore(callback: (e: Event, records: LogRecord[]) => void): void
      exportLogs(): void,
    }
  }
}

window.log.onPopulateLogStore((evt, recordSet: LogRecord[]) => {
  console.log('Received', recordSet.length, 'log records from main');
  logRecords.set(recordSet);
});

window.log.onAddLogRecord((evt, r: LogRecord) => {
  logRecords.update(records => [...records, r]);
})
