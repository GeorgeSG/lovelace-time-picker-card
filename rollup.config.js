import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import serve from 'rollup-plugin-serve';

const dev = process.env.ROLLUP_WATCH;

const serveOptions = {
  contentBase: ['./dist'],
  host: '127.0.0.1', // 'localhost' resolves to ::1 on Node 17+, but HA loads the card from 127.0.0.1
  port: 5100, // 5000 is taken by the macOS AirPlay Receiver
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
    dev && serve(serveOptions),
    !dev && terser(),
  ],
};
