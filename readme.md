# ETS - Electron, TypeScript and Svelte

Contents

* [Getting Started](#getting-started)
* [Project Structure](#project-structure)
* [FAQ](#faq)

This is a *starting point* repository for Electron applications that integrate

* [TypeScript](https://www.typescriptlang.org/) – A type-safety system
  on top of JavaScript
* [Svelte](https://svelte.dev/) – Web UI Framework
* [Electron Context Isolation](https://www.electronjs.org/docs/tutorial/security#3-enable-context-isolation-for-remote-content) - The latest
  security practices incorporated into Electron 12.

I'm relatively new to all three of these packages.
Even with several articles on the web perporting to
explain how to combine them, I ended
up with a *hello world* screen that could not be extended
and did not run in Electron 12 (which
[does away with `nodeIntegration` in favor of `contextIsolation`](https://github.com/electron/electron/issues/23506)).

If you do **not** intend to load remote content in your renderer
processes, then this approach may be overkill for you.  You can
probably follow other "getting-started" tutorials that do a better
job of configuring hot-replacment and just remember to replace

```
nodeIntegration: true
```

with

```
contextIsolation: false
```

in your web preferences.


## Getting Started

Use [degit](https://www.npmjs.com/package/degit) rather than
`git clone` to skim the latest version of this repository
and get started with your own repository.

1. Copy code.
   ```
   npx degit https://github.com/pglezen/ets.git myapp
   ```

2. Install dependencies.

   ```
   npm install
   ```

3. Compile main process components.

   ```
   npm run build:main
   ```

4. Compile main window compoments.

   ```
   npm run build:ui
   ```

5. Run application.

   ```
   npm run start
   ```

## Project Structure

* `dist` - The final runtime.  

* `dist/mainWin` – The renderer process of the main window.

* `src/sometypes.d.ts` – a type definition file for use by the project.

* `src/main` – TypeScript source for the main processes.

* `src/UI` – Svelte source code for the renderer process
  using `lang="ts"` to support TypeScript.


## FAQ

### Why two `tsconfig` files?

I had trouble combining the TypeScript configuration between the Svelte
files and the Electron files.  So I created two:

* `tsconfig-main.json` – Electron main process.
* `tsconfig-ui.json` – Electron renderer processes.

Each one is referenced from its build.  The **main** build uses the
`--project` option of the `tsc` command to reference `tsconfig-main.json`
and compile its files (in `src/main`) to the the `dist` directory.
The Svelte components are processed through Rollup.  In Rollup,
TypeScript processing is configured through the `@rollup/plugin-typescript`
entry in `rollup.config.js`.

```js
  typescript({
    tsconfig: 'tsconfig-ui.json',
    sourceMap: !production,
    inlineSources: !production,
  }),
```

### Why Preload?

For renderers with `contextIsolation = true`, neither the Node.js nor the
Electron components which leverage Node.js are available to the renderer
processes; not even `ipcRenderer`, which is generally regarded as the bare
minimum.  The "loophole" is a `preload.js` script (configured in
`webPreferences`) that determines exactly what may is allowed by

1. Importing/Creating it.
2. Passing it to `contextBridge.exposeInMainWorld`

The [contextBridge](https://www.electronjs.org/docs/api/context-bridge) will
ensure that these items (and only these items) are available to renderer processes
via the `window` object.  **If you try to assign directly to the `window` object
from within the `preload.js`, it will be gone by the time the renderer loads.**

There is a whole range of techniques for configuring the ContextBridge.
[This StackOverflow anwser](https://stackoverflow.com/a/59888788/1525101) is
what schooled me.  It specifies exactly what the renderer can do and nothing
more.  It's air tight; but it requires one to individually catalog each message.
The approach I've taken is a bit more relaxed, using a generic `send` and `on`
methods of an `ipc` member, to be added to the `window` global context of the
render.

### Why no dynamic updates?

I'm just not good enough at this stuff, yet.  For now, I recompile
the main process each time I change electron code.  For the renderers,
I run `npm run dev` that dynamically recompiles the renderer TypeScript.
But the renderer window still requires a manual refresh (ctrl/cmd-R).
I'm not sure if `rollup-plugin-livereload` knows how to deal with an
Electron renderer.
