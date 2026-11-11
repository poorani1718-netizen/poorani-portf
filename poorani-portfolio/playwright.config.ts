import { defineConfig, devices } from "@playwright/test";

// End-to-end tests run against a production build: `npm run build && npm run test:e2e`
export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: { baseURL: process.env.BASE_URL || "http://localhost:3000", trace: "retain-on-failure" },
  webServer: process.env.BASE_URL ? undefined : { command: "npm run start", url: "http://localhost:3000", reuseExistingServer: true, timeout: 120_000 },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
