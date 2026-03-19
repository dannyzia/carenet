import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      // Mirror the @ alias from vite.config.ts
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    // Use node environment for utility/service tests (no DOM overhead).
    // Component tests can override with `// @vitest-environment jsdom` per-file.
    environment: "node",

    // Test file discovery
    include: ["src/**/__tests__/**/*.test.ts", "src/**/__tests__/**/*.test.tsx"],
    exclude: ["node_modules", "dist", "e2e"],

    // Coverage config (optional — run with `vitest --coverage`)
    coverage: {
      provider: "v8",
      include: ["src/app/utils/**", "src/app/services/**", "src/app/hooks/**"],
      exclude: ["src/**/__tests__/**"],
    },

    // Timeout per test (5s default, 15s for integration)
    testTimeout: 10_000,

    // Silence console.log/warn in tests unless DEBUG=true
    silent: !process.env.DEBUG,
  },
});