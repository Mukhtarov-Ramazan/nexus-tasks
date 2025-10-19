import { defineConfig } from 'eslint'
import { globalIgnores } from 'eslint/config'
import { vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfig({
  name: 'app/files-to-lint',
  files: ['**/*.{ts,mts,tsx,vue}'],
  ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  extends: [
    ...vueTsConfigs.recommended.extends,
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: ['vue'],
  rules: {
    'vue/no-unused-vars': 'error',
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'import/order': ['error', {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always',
      alphabetize: { order: 'asc' },
    }],
  },
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  // включаем конфиги из плагинов
  settings: {
    'vue/setup-compiler-macros': true
  }
})
