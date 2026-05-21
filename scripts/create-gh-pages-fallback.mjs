import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const distDir = resolve("dist", "public");
const indexPath = resolve(distDir, "index.html");
const fallbackPath = resolve(distDir, "404.html");

if (!existsSync(indexPath)) {
  throw new Error(`Cannot create GitHub Pages fallback; missing ${indexPath}`);
}

copyFileSync(indexPath, fallbackPath);
console.log(`Created SPA fallback: ${fallbackPath}`);
