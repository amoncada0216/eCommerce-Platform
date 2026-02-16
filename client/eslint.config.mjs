import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tseslint from "@typescript-eslint/eslint-plugin";
import unicorn from "eslint-plugin-unicorn";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    plugins: {
      "@typescript-eslint": tseslint,
      unicorn: unicorn,
    },
    rules: {
      "@typescript-eslint/naming-convention": [
        "error",

        // Variables & functions → camelCase
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
        },
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },

        // Types, Interfaces, Classes → PascalCase
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },

        // Enum members → UPPER_CASE
        {
          selector: "enumMember",
          format: ["UPPER_CASE"],
        },
      ],
    },
  },

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
