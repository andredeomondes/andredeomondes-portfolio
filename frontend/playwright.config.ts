import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: "line",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3100",
    channel: process.env.PLAYWRIGHT_USE_EDGE === "1" ? "msedge" : undefined,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "pnpm exec next dev --port 3100",
    env: { NEXT_DIST_DIR: ".next-e2e" },
    url: "http://localhost:3100",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
