import { writable } from 'svelte/store';
import type { SomeType } from '../sometypes';
export const globalStuff = writable<SomeType[]>([]);
export const dbname = writable<string>('');

declare global {
  interface Window {
    ipc: {
      send(channel: string, sdid: string): void,
      on(channel: string, func: (e: Event, s: SomeType[]) => void): void
      on(channel: string, func: (e: Event, n: string) => void): void
    }
  }
}

window.ipc.on('open-database', (evt, name: string) => {
  dbname.set(name);
})

window.ipc.on('set-stuff', (evt, stuff: SomeType[]) => {
  globalStuff.set(stuff);
})

