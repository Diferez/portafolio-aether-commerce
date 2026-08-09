import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const configPath = resolve("dist/server/wrangler.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));

config.name = process.env.PORTFOLIO_WORKER_NAME || "portafolio-aether-commerce";
config.topLevelName = config.name;
config.compatibility_date = "2026-08-08";
config.workers_dev = true;
config.preview_urls = true;
delete config.legacy_env;
delete config.legacyEnv;
config.vars = {
  ...(config.vars || {}),
  NEXT_PUBLIC_AETHER_API_URL: process.env.NEXT_PUBLIC_AETHER_API_URL || "",
  AETHER_API_ORIGIN: process.env.AETHER_API_ORIGIN || process.env.NEXT_PUBLIC_AETHER_API_URL || "",
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "",
  NEXT_PUBLIC_STORE_URL: process.env.NEXT_PUBLIC_STORE_URL || ""
};

writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
console.log(`Patched ${configPath} for Worker ${config.name}`);
