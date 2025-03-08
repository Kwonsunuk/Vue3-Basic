// .eslintrc.cjs
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential', // Vue 기본 규칙 적용
    'airbnb-base', // Airbnb 스타일 가이드 적용
    'plugin:prettier/recommended', // Prettier와 충돌 방지
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  rules: {
    'prettier/prettier': ['error', { singleQuote: true }], // Prettier 적용
    quotes: ['error', 'single'], // 작은 따옴표 사용 강제
    'no-console': 'warn', // console.log 사용 시 경고
    'vue/multi-word-component-names': 'off', // Vue 파일명 규칙 완화
  },
};
