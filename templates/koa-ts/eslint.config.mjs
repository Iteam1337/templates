import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
})

export default [
  { ignores: ['build/', 'node_modules/'] },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:import/typescript',
    'plugin:n/recommended'
  ),
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        project: './tsconfig.json',
      },
    },
    rules: {
      'n/no-unsupported-features/es-syntax': ['error', { ignores: ['modules'] }],
    },
  },
  {
    files: ['src/**/*.test.ts'],
    rules: {
      'n/no-unpublished-import': 'off',
    },
  },
]