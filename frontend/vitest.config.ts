import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
  coverage: {
    provider: "v8",
    reporter: ["text", "json-summary", "html", "lcov"],
    include: ["src/**/*.{ts,tsx}"],
    exclude: ["src/main.tsx", "src/**/*.d.ts", "src/**/*.test.tsx"],
    thresholds: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
},
});
