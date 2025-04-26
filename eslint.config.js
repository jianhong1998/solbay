// eslint.config.js
import nextPlugin from '@next/eslint-plugin-next';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';
import path from 'node:path';

const tseslintRecommendedTypeCheckedRules = Object.assign(
  {},
  ...tseslint.configs.recommendedTypeChecked.map(
    (config) => config.rules ?? {},
  ),
);

export default [
  /* Base configuration for all files */
  {
    files: [
      './server/src/**/*.{ts}',
      './client/src/**/*.{ts,tsx}',
      './anchor/test/**/*.{ts}',
    ],
    ignores: ['next.config.mjs', 'postcss.config.mjs'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'simple-import-sort': simpleImportSort,
      prettier: prettierPlugin,
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      // Import sorting
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      // Prettier integration
      'prettier/prettier': 'error',
    },
  },
  /* Client NextJS Eslint */
  {
    files: ['./client/src/**/*.{ts,tsx}'],
    ignores: ['next.config.mjs', 'postcss.config.mjs'],
    plugins: {
      '@typescript-eslint': tsPlugin,
      'simple-import-sort': simpleImportSort,
      prettier: prettierPlugin,
      react: reactPlugin,
      'react-hooks': hooksPlugin,
      '@next/next': nextPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...hooksPlugin.configs.recommended.rules,
      'react/display-name': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
  /* Server Eslint */
  {
    files: ['./server/src/**/*.{ts,js}'],
    ignores: ['eslint.config.*'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: path.join(import.meta.dirname, 'server'),
      },
      globals: {
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...tseslintRecommendedTypeCheckedRules,
      ...eslint.configs.recommended.rules,
      ...eslintPluginPrettierRecommended.rules,
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-unused-vars': 'off',
    },
  },
];
