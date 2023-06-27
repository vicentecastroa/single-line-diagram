module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  settings: {
    "import/resolver": {
      node: {}, // placed above other resolver configs
    },
  },
  extends: ["prettier"],
  plugins: ["prettier"],
  rules: {
    "no-console": [
      process.env.NODE_ENV === "production" ? "error" : "off",
      { allow: ["debug", "error"] },
    ],
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "prettier/prettier": ["warn"],
    camelcase: ["warn", { properties: "never", ignoreDestructuring: true }],
    "no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
  },
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module",
  },
};
