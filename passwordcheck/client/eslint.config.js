import js from '@eslint/js';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['dist/**']
  },
  {
    files: ['**/*.js'],
    extends: [js.configs.recommended]
  },
  {
    files: ['src/**/*.js'],
    languageOptions: {
      globals: {
        document: 'readonly',
        fetch: 'readonly'
      }
    }
  }
]);
