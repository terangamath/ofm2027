import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Le site est en français — les apostrophes sont omniprésentes dans JSX
      "react/no-unescaped-entities": "off",
      // Accepter les setState dans useEffect pour la gestion de la navigation
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
