import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import esbuild from 'rollup-plugin-esbuild';

const cfg = {
  external: ['react'],
  input: 'src/index.ts',
  output: {
    sourcemap: true,
    name: 'KKStore',
    file: './dist/kkstore.js',
    format: 'umd',
    globals: {
      react: 'React',
    },
    exports: 'named',
  },
  plugins: [
    resolve(),
    esbuild({
      target: 'es2022',
      format: 'esm',
    }),
  ],
};
const cfgMin = {
  ...cfg,
  output: { ...cfg.output },
  plugins: cfg.plugins.slice(),
};
cfgMin.output.file = './dist/kkstore.min.js';
cfgMin.plugins.push(terser());

export default [cfg, cfgMin];
