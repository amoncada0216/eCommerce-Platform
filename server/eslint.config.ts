import tseslint from "typescript-eslint";
import globals from "globals";
import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
  {
    ignores: ["node_modules", "dist"],
  },

  js.configs.recommended,

  {
    languageOptions: {
      globals: globals.node,
    },
  },

  ...tseslint.configs.recommended,

  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
]);
