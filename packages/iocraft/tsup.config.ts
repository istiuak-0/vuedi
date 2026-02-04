import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    core: './src/core.ts',
    helpers: './src/helpers.ts',
  },
  format: ['esm', 'cjs'],
  dts: { resolve: true },
  sourcemap: true,
  clean: true,
  splitting: true,
  minify: false,
  external: ['vue', 'vue-router', 'pinia'],
  outDir: 'dist',

  define: {
    __DEV__: 'process.env.NODE_ENV !== "production"',
    __TEST__: 'process.env.NODE_ENV === "test"',
    __USE_DEVTOOLS__:
      '((process.env.NODE_ENV !== "production" || __VUE_PROD_DEVTOOLS__) && process.env.NODE_ENV !== "test")',
  },

  esbuildOptions(options) {
    options.target = 'es2022';
    options.banner = { js: '"use strict";' };
  },
});
