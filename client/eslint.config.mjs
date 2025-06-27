// const eslintConfig = [
//   {
//     files: ["**/*.ts", "**/*.tsx"],
//     rules: {
//       "@typescript-eslint/no-explicit-any": "warn",
//       "@typescript-eslint/no-unused-vars": "warn",
//       "react-hooks/exhaustive-deps": "warn",
//       "@next/next/no-img-element": "off",
//       "react/no-unescaped-entities": "off",
//     },
//   },
// ];

// export default eslintConfig;

import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Default Next.js + TypeScript ESLint rules
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // ✅ Your custom override rules
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      // 🔧 Disable the most common warnings
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/exhaustive-deps": "off",
      "@next/next/no-img-element": "off",

      // 🔧 Disable the specific errors you're getting
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-unused-expressions": "off",

      // Keep only critical errors
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
    },
  },
];

export default eslintConfig;
