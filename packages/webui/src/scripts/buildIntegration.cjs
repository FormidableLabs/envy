const { build } = require('esbuild');
const inlineImportPlugin = require('esbuild-plugin-inline-import');

const { dependencies } = require('../../package.json');

const integrationFile = 'src/integration.tsx';

const shared = {
  bundle: true,
  entryPoints: [integrationFile],
  external: Object.keys(dependencies),
  logLevel: 'info',
  plugins: [inlineImportPlugin()],
  minify: true,
  sourcemap: true,
};

build({
  ...shared,
  format: 'esm',
  outfile: './dist/integration.esm.js',
  target: ['es2022', 'node16'],
});

build({
  ...shared,
  format: 'cjs',
  outfile: './dist/integration.cjs.js',
  target: ['es2022', 'node16'],
});
