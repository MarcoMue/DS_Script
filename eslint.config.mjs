import globals from "globals";
import pluginJs from "@eslint/js";
import pluginJest from "eslint-plugin-jest";

export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "module" } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    files: ["**/*.test.js"], // Apply Jest settings to test files
    languageOptions: {
      globals: globals.jest, // Add Jest globals
    },
    plugins: [pluginJest],
    rules: pluginJest.configs.recommended.rules,
  },
];
