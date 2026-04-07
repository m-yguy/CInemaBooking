import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: { moduleResolution: "node" } }],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    // Stub next-auth and @auth/core to avoid ESM parsing issues in Jest
    "^next-auth(.*)$": "<rootDir>/test/__mocks__/next-auth.ts",
    "^@auth/core(.*)$": "<rootDir>/test/__mocks__/@auth/core.ts",
  },
  clearMocks: true,
  setupFiles: ["<rootDir>/test/setupMocks.ts"],
};

export default config;
