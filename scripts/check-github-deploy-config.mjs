import { spawnSync } from "node:child_process";

const requiredVariables = [
  "CLOUDFLARE_DEPLOY_ENABLED",
  "AETHER_D1_DATABASE_ID",
  "NEXT_PUBLIC_AETHER_API_URL",
  "NEXT_PUBLIC_PORTFOLIO_URL",
  "APP_ORIGIN_ADMIN"
];

const recommendedVariables = [
  "AETHER_API_WORKER_NAME",
  "AETHER_FRONT_WORKER_NAME",
  "AETHER_ADMIN_PAGES_PROJECT",
  "AETHER_D1_DATABASE_NAME",
  "AETHER_API_ORIGIN",
  "APP_ORIGIN_STORE",
  "DUMMYJSON_API_BASE_URL",
  "NEXT_PUBLIC_AETHER_AI_URL",
  "GEMINI_MODEL",
  "GEMINI_FALLBACK_MODEL",
  "AI_EVAL_MAX_CASES"
];

const requiredSecrets = ["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ACCOUNT_ID"];
const assistantRecommendedSecrets = [];
const assistantProductionSecrets = ["GEMINI_API_KEY", "AETHER_CART_TOKEN_SECRET", "DATABASE_URL"];

const assistantProductionVariables = [
  "NEXT_PUBLIC_AETHER_AI_URL"
];

const productionEnvironment = "production";

function runGh(args) {
  const result = spawnSync("gh", args, {
    encoding: "utf-8",
    shell: process.platform === "win32"
  });

  if (result.error) {
    throw new Error(`Could not run gh ${args.join(" ")}: ${result.error.message}`);
  }

  if (result.status !== 0) {
    const message = result.stderr.trim() || result.stdout.trim() || `gh exited with ${result.status}`;
    throw new Error(`gh ${args.join(" ")} failed: ${message}`);
  }

  return result.stdout;
}

function parseNames(output) {
  return new Set(
    output
      .split(/\r?\n/)
      .map((line) => line.trim().split(/\s+/)[0])
      .filter(Boolean)
  );
}

function missingFrom(required, available) {
  return required.filter((name) => !available.has(name));
}

function main() {
  const repoVariables = parseNames(runGh(["variable", "list"]));
  const repoSecrets = parseNames(runGh(["secret", "list"]));
  const environmentVariables = parseNames(runGh(["variable", "list", "--env", productionEnvironment]));
  const environmentSecrets = parseNames(runGh(["secret", "list", "--env", productionEnvironment]));
  const variables = new Set([...repoVariables, ...environmentVariables]);
  const secrets = new Set([...repoSecrets, ...environmentSecrets]);

  const missingVariables = missingFrom(requiredVariables, variables);
  const missingSecrets = missingFrom(requiredSecrets, secrets);
  const missingRecommendedVariables = missingFrom(recommendedVariables, variables);
  const missingAssistantProductionVariables = missingFrom(assistantProductionVariables, variables);
  const missingAssistantRecommendedSecrets = missingFrom(assistantRecommendedSecrets, secrets);
  const missingAssistantProductionSecrets = missingFrom(assistantProductionSecrets, secrets);

  if (missingVariables.length || missingSecrets.length) {
    if (missingVariables.length) {
      console.error(`Missing required GitHub variables: ${missingVariables.join(", ")}`);
    }
    if (missingSecrets.length) {
      console.error(`Missing required GitHub secrets: ${missingSecrets.join(", ")}`);
    }
    process.exit(1);
  }

  if (missingRecommendedVariables.length) {
    console.warn(`Missing optional/recommended GitHub variables: ${missingRecommendedVariables.join(", ")}`);
  }

  if (missingAssistantProductionVariables.length || missingAssistantProductionSecrets.length || missingAssistantRecommendedSecrets.length) {
    console.warn(
      [
        "AI assistant production/evaluation is not fully configured.",
        missingAssistantProductionVariables.length
          ? `Missing assistant variables: ${missingAssistantProductionVariables.join(", ")}.`
          : "",
        missingAssistantProductionSecrets.length
          ? `Missing assistant production secrets: ${missingAssistantProductionSecrets.join(", ")}.`
          : "",
        missingAssistantRecommendedSecrets.length
          ? `Missing assistant secrets: ${missingAssistantRecommendedSecrets.join(", ")}.`
          : ""
      ]
        .filter(Boolean)
        .join(" ")
    );
  }

  console.log("github_deploy_config_ok");
}

main();
