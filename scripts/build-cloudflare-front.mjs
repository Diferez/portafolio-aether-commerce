import { cpSync, existsSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const aetherDir = resolve(rootDir, "aether-commerce");
const aetherStoreOut = resolve(aetherDir, "apps", "storefront", "out");
const mergedStoreOut = resolve(rootDir, "dist", "client", "store");

function run(command, args, cwd, env = {}) {
  const result = spawnSync(command, args, {
    cwd,
    env: { ...process.env, ...env },
    shell: process.platform === "win32",
    stdio: "inherit"
  });

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status ?? "unknown"}.`);
  }
}

run("pnpm", ["--filter", "@aether/storefront", "build"], aetherDir, {
  NEXT_PUBLIC_AETHER_BASE_PATH: "/store",
  NEXT_PUBLIC_PORTFOLIO_URL: process.env.NEXT_PUBLIC_PORTFOLIO_URL || "/"
});

if (!existsSync(aetherStoreOut)) {
  throw new Error("Aether storefront build output was not generated.");
}

run("npm", ["run", "build:portfolio"], rootDir);

rmSync(mergedStoreOut, { recursive: true, force: true });
cpSync(aetherStoreOut, mergedStoreOut, { recursive: true });

console.log("Merged Aether storefront into dist/client/store.");
