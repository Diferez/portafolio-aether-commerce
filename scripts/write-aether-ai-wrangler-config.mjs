import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const required = ["AETHER_D1_DATABASE_ID"];
const missing = required.filter((name) => !process.env[name]?.trim());

if (missing.length > 0) {
  throw new Error(`Missing required deployment env vars: ${missing.join(", ")}`);
}

const inputPath = resolve("aether-commerce/apps/ai-assistant/wrangler.jsonc");
const config = JSON.parse(readFileSync(inputPath, "utf8"));

config.d1_databases = [
  {
    binding: "DB",
    database_name: process.env.AETHER_D1_DATABASE_NAME || "aether-production",
    database_id: process.env.AETHER_D1_DATABASE_ID,
  },
];

const outputPath = resolve("aether-commerce/apps/ai-assistant/wrangler.production.json");
writeFileSync(outputPath, `${JSON.stringify(config, null, 2)}\n`);
console.log(`Wrote ${outputPath}`);
