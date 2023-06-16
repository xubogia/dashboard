module.exports = {
  plugins: ['react', 'react-hooks', 'prettier', 'json'],

  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:react/jsx-runtime',
    'plugin:@next/next/recommended',
    'prettier',
    'eslint:recommended',
    'plugin:json/recommended',
  ],
  rules: {
    '@next/next/no-img-element': 'off',
    'comma-dangle': 'off',
    'consistent-return': 'off',
    'import/prefer-default-export': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'no-bitwise': 'off',
    'no-console': 'off',
    'no-continue': 'off',
    'no-nested-ternary': 'off',
    'no-param-reassign': [
      'error',
      { props: true, ignorePropertyModificationsFor: ['state', 'page', 'pages', 'entities'] },
    ],
    'no-plusplus': 'off',
    radix: ['error', 'as-needed'],
    'react/require-default-props': 'off',
    'react/function-component-definition': [
      'error',
      { namedComponents: ['function-declaration', 'arrow-function'] },
    ],
    'react/destructuring-assignment': 'off',
    'react/jsx-props-no-spreading': 'off',
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      plugins: ['@typescript-eslint'],
      extends: ['airbnb-typescript', 'prettier'],
      parser: '@typescript-eslint/parser',
      parserOptions: { project: ['./tsconfig.json'] },
      rules: {
        '@typescript-eslint/comma-dangle': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
      },
    },
  ],
};