import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import lit from 'eslint-plugin-lit';
import wc from 'eslint-plugin-wc';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist/', 'node_modules/', 'devtools/']),
  js.configs.recommended,
  tseslint.configs.recommended,
  lit.configs['flat/recommended'],
  wc.configs['flat/recommended'],
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: { experimentalDecorators: true },
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
    },
  },
  {
    files: ['*.config.{js,ts}'],
    languageOptions: { globals: globals.node },
  },
  prettier,
]);
