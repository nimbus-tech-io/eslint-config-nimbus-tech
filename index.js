module.exports = {
  plugins: ['import', 'unused-imports', 'check-file'],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/ban-types': 'off',
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],

    'import/order': [
      'error',
      {
        alphabetize: { order: 'asc' },
        'newlines-between': 'always',
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],

    'unused-imports/no-unused-imports': 'error',

    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['strictCamelCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'forbid',
      },
      {
        selector: 'function',
        format: ['strictCamelCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'forbid',
      },
      {
        selector: 'variable',
        format: ['strictCamelCase', 'StrictPascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'forbid',
      },
      {
        selector: 'typeLike',
        format: ['StrictPascalCase'],
      },
      {
        selector: 'method',
        modifiers: ['static'],
        format: ['strictCamelCase'],
      },
      {
        selector: 'enumMember',
        format: ['UPPER_CASE'],
      },
      {
        selector: 'enum',
        format: ['StrictPascalCase'],
      },
      {
        selector: 'interface',
        format: ['StrictPascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: false,
        },
      },
      {
        selector: 'objectLiteralProperty',
        format: ['UPPER_CASE', 'strictCamelCase'],
      },
    ],

    'check-file/filename-naming-convention': [
      'error',
      {
        '**/*.{js,ts}': 'KEBAB_CASE',
      },
      {
        ignoreMiddleExtensions: true,
      },
    ],
    'check-file/folder-naming-convention': ['error', { 'src/**/': 'KEBAB_CASE' }],
  },
};
