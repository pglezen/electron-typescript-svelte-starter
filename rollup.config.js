import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
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

export default {
	input: 'src/UI/index.ts',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'dist/mainWin/bundle.js'
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

		resolve({
			browser: true,
			dedupe: ['svelte'],
		}),
		commonjs(),
		typescript({
			tsconfig: 'tsconfig-ui.json',
			sourceMap: !production,
			inlineSources: !production,
		}),

		!production && serve(),
		!production && livereload('dist'),

		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
