import iteamReact from '@iteam/eslint-config-react'

export default [
  { ignores: ['dist/', 'node_modules/', '*.config.{js,ts,mjs}'] },
  ...iteamReact,
  {
    files: ['src/**/*.{js,jsx}'],
    rules: {
      'no-unused-vars': [
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