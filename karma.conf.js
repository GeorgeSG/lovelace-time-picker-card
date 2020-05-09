module.exports = function (config) {
  config.set({
    basePath: 'test/',
    frameworks: ['mocha', 'chai'],
    files: ['*.test.ts'],
    preprocessors: {
      '*.test.ts': ['rollup'],
    },

    rollupPreprocessor: {
      plugins: [
        require('@rollup/plugin-node-resolve')(),
        require('@rollup/plugin-json')(),
        require('@rollup/plugin-typescript')(),
        require('rollup-plugin-babel')(),
      ],
      output: {
        format: 'umd',
        sourcemap: 'inline',
      },
    },

    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    port: 9876,
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: true,

    browsers: ['ChromeHeadless'],
    concurrency: Infinity,
  });
};
