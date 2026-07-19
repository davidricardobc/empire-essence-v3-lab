import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      ".artifacts/**",
      ".next/**",
      ".vercel/**",
      "coverage/**",
      "dist/**",
      "node_modules/**",
      "out/**",
    ],
  },
  ...nextVitals,
  ...nextTs,
];

export default eslintConfig;
