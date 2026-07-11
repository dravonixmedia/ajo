import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // React Compiler's purity/immutability rules assume idiomatic React state
    // updates. react-three-fiber's render loop is fundamentally imperative —
    // useFrame callbacks mutate typed arrays and object3D transforms every
    // frame by design (see R3F docs), and that pattern isn't yet compatible
    // with these rules. Scope the relaxation to the WebGL layer only.
    files: ["components/canvas/**/*.tsx", "components/loader/**/*.tsx"],
    rules: {
      "react-hooks/purity": "off",
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    // Lenis must be instantiated inside an effect and stored in state so
    // context consumers re-render once it's ready — a standard pattern for
    // imperative third-party instances, not an unintended cascade.
    files: ["components/providers/**/*.tsx"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
