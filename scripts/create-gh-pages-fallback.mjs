import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const distDir = resolve("dist", "public");
const indexPath = resolve(distDir, "index.html");
const fallbackPath = resolve(distDir, "404.html");
const adminDir = resolve(distDir, "admin");
const adminIndexPath = resolve(adminDir, "index.html");

if (!existsSync(indexPath)) {
  throw new Error(`Cannot create GitHub Pages fallback; missing ${indexPath}`);
}

copyFileSync(indexPath, fallbackPath);
mkdirSync(adminDir, { recursive: true });
copyFileSync(indexPath, adminIndexPath);
console.log(`Created SPA fallback: ${fallbackPath}`);
console.log(`Created admin route shell: ${adminIndexPath}`);
