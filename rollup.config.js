import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});
			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

function buildWindow (name, runServer = false) {
  return {
    input: `src/UI/${name}/index.ts`,
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'app',
      file: `dist/${name}Window/bundle.js`
    },
    plugins: [
      svelte({
        preprocess: sveltePreprocess({ 
          sourceMap: !production,
          typescript: {
            tsconfigFile: 'tsconfig-ui.json'
          }
        }),
        compilerOptions: {
          dev: !production
        }
      }),
      css({ output: 'bundle.css' }),
      nodeResolve({
        browser: true,
        dedupe: ['svelte'],
      }),
      commonjs(),
      typescript({
        tsconfig: 'tsconfig-ui.json',
        sourceMap: true,
        inlineSources: true,
      }),

      !production && runServer && serve(),
      !production && livereload(`dist/${name}Window`),

      production && terser()
    ],
    watch: {
      clearScreen: false
    }
  };
};

export default [
  buildWindow('main', true),
  buildWindow('logs'),
]