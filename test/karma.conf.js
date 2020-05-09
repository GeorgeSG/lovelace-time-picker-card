module.exports = function (config) {
  return config.set({
    basePath: './',
    frameworks: ['mocha', 'chai'],
    files: ['**/*.test.ts'],
    preprocessors: {
      '**/*.test.ts': ['rollup'],
    },

    rollupPreprocessor: {
      plugins: [
        require('@rollup/plugin-node-resolve')(),
        require('@rollup/plugin-json')(),
        require('@rollup/plugin-typescript')(),
        require('@rollup/plugin-commonjs')({
          namedExports: {
            chai: ['expect'],
          },
        }),
      ],
      output: {
        format: 'umd',
        sourcemap: 'inline',
      },
      onwarn: function (message) {
        if (/Circular dependency/.test(message)) return;
        console.warn(message);
      },
    },

    reporters: ['dots'],

    port: 9876,
    colors: true,
    autoWatch: false,
    singleRun: true,

    concurrency: Infinity,
    browsers: ['ChromeHeadless'],

    client: {
      captureConsole: false,
    },
  });
};
