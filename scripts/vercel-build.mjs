import { execFileSync } from "node:child_process";

const isPreview = process.env.VERCEL_ENV === "preview";

if (!isPreview) {
  execFileSync("npx", ["prisma", "migrate", "deploy"], {
    stdio: "inherit",
    env: process.env,
  });
}

execFileSync("npx", ["next", "build"], {
  stdio: "inherit",
  env: process.env,
});
