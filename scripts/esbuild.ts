import path from 'path';
import { fileURLToPath } from 'node:url';
import type { BuildOptions } from 'esbuild';
import esbuild from 'esbuild';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getOption(type: 'cjs' | 'esm'): BuildOptions {
  return {
    entryPoints: [path.resolve(__dirname, '../src/index.ts')],
    sourcemap: true,
    // external,
    packages: 'external',
    charset: 'utf8',
    bundle: true,
    ...(type === 'cjs'
      ? {
          platform: 'node',
        }
      : {
          format: 'esm',
          target: 'esnext',
        }),
    // outdir: 'dist',
    outfile: `dist/index.${type === 'cjs' ? 'cjs' : 'js'}`,
  };
}

async function bundle(type: 'cjs' | 'esm') {
  const result = await esbuild.build(getOption(type));
  // console.log(result);
  if (result.errors?.length) {
    console.error(result.errors);
  } else {
    console.log(`==> dist/index.${type} bundled.`);
  }
}
(async () => {
  await Promise.all([bundle('cjs'), bundle('esm')]);

  if (process.env.WATCH) {
    const ctx = await esbuild.context(getOption('esm'));
    await ctx.watch();
    console.log('Watching For dist/index.js bundle...');
  }
})().catch((ex) => {
  console.error(ex);
});
