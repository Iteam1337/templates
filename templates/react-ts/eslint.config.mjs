import iteamReactTypescript from '@iteam/eslint-config-react/typescript'

export default [
  { ignores: ['dist/', 'node_modules/', '*.config.{js,ts,mjs}'] },
  ...iteamReactTypescript,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'react/prop-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: [
            ['external', 'builtin'],
            'internal',
            ['index', 'sibling', 'parent'],
          ],
        },
      ],
    },
  },
]