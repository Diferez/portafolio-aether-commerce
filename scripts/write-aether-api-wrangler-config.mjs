import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const required = ["AETHER_D1_DATABASE_ID"];
const missing = required.filter((name) => !process.env[name]?.trim());

if (missing.length > 0) {
  throw new Error(`Missing required deployment env vars: ${missing.join(", ")}`);
}

const config = {
  $schema: "../../../node_modules/wrangler/config-schema.json",
  name: process.env.AETHER_API_WORKER_NAME || "aether-api",
  main: "src/index.ts",
  compatibility_date: "2026-07-15",
  compatibility_flags: ["nodejs_compat"],
  workers_dev: true,
  preview_urls: true,
  vars: {
    AETHER_ENV: process.env.AETHER_ENV || "production",
    DUMMYJSON_API_BASE_URL: process.env.DUMMYJSON_API_BASE_URL || "https://dummyjson.com",
    APP_ORIGIN_STORE: process.env.APP_ORIGIN_STORE || "",
    APP_ORIGIN_ADMIN: process.env.APP_ORIGIN_ADMIN || "",
    APP_STORE_BASE_PATH: process.env.APP_STORE_BASE_PATH || "/store"
  },
  d1_databases: [
    {
      binding: "DB",
      database_name: process.env.AETHER_D1_DATABASE_NAME || "aether-production",
      database_id: process.env.AETHER_D1_DATABASE_ID,
      migrations_dir: "migrations"
    }
  ]
};

const outputPath = resolve("aether-commerce/apps/api/wrangler.production.json");
writeFileSync(outputPath, `${JSON.stringify(config, null, 2)}\n`);
console.log(`Wrote ${outputPath}`);
