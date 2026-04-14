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
  // Enforce layered architecture: pages, components, actions, and API routes
  // must not import directly from repositories — use the service layer instead.
  {
    files: [
      "app/**/page.tsx",
      "app/**/layout.tsx",
      "app/components/**/*.{ts,tsx}",
      "app/actions/**/*.ts",
      "app/api/**/*.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/lib/repositories/*"],
              message:
                "Import from @/lib/services/* instead of accessing repositories directly.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
