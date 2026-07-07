module.exports = {
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  globals: {
    window: "readonly",
    document: "readonly",
    localStorage: "readonly",
    navigator: "readonly",
    fetch: "readonly",
    crypto: "readonly",
    process: "readonly",
    __dirname: "readonly",
  },
  rules: {
    "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    "no-undef": "error",
  },
};
