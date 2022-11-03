module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  testRegex: '/test/.*\\.test?\\.ts$',
  transformIgnorePatterns: [
    'node_modules/(?!(testing-library__dom|@open-wc|lit-html|lit-element|pure-lit|lit-element-state-decoupler)/)',
  ],
  moduleFileExtensions: ['ts', 'js'],
};
