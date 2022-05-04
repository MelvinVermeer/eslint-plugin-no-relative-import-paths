module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "no-relative-import-paths"],
  rules: {
    semi: ["error", "always"],
    "no-relative-import-paths/no-relative-import-paths": [
      "warn",
      { allowSameFolder: false },
    ],
  },
};
