import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import { terser } from '@el3um4s/rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
import serve from 'rollup-plugin-serve';

const dev = process.env.ROLLUP_WATCH;

const serveOptions = {
  contentBase: ['./dist'],
  host: 'localhost',
  port: 5000,
  allowCrossOrigin: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

export default {
  input: 'src/time-picker-card.ts',
  output: {
    dir: './dist',
    format: 'es',
  },
  plugins: [
    typescript({ exclude: ['test/**/*'] }),
    nodeResolve(),
    json(),
    babel({
      exclude: 'node_modules/**',
    }),
    dev && serve(serveOptions),
    !dev && terser(),
  ],
};
