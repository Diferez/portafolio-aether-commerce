import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const configPath = resolve("dist/server/wrangler.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));

config.name = process.env.AETHER_FRONT_WORKER_NAME || "portafolio-aether-commerce";
config.topLevelName = config.name;
config.vars = {
  ...(config.vars || {}),
  NEXT_PUBLIC_AETHER_API_URL: process.env.NEXT_PUBLIC_AETHER_API_URL || "",
  AETHER_API_ORIGIN: process.env.AETHER_API_ORIGIN || process.env.NEXT_PUBLIC_AETHER_API_URL || "",
  AETHER_STOREFRONT_ORIGIN: process.env.AETHER_STOREFRONT_ORIGIN || ""
};

writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
console.log(`Patched ${configPath} for Worker ${config.name}`);
