export default [
  {
    files: ["src/**/*.{js,jsx}"],
    ignores: ["src/main/**/*.ts", "supabase/**", "dist/**", "node_modules/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        navigator: "readonly",
        console: "readonly",
        fetch: "readonly",
        crypto: "readonly",
        process: "readonly",
        __dirname: "readonly",
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      "no-unused-vars": "off",
      "no-undef": "error",
    },
  },
];
