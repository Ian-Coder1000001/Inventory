import { nextCoreWebVitals } from "eslint-config-next";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    plugins: {
      "@next/next": nextCoreWebVitals,
    },
    rules: {
      ...nextCoreWebVitals.rules,
    },
  },
];

export default eslintConfig;