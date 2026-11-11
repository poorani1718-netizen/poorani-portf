// Builds a static, hash-routed preview of the site into preview-dist/
import { build } from "esbuild";
import { execSync } from "node:child_process";
import { mkdirSync, copyFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
mkdirSync(path.join(root, "preview-dist"), { recursive: true });

await build({
  entryPoints: [path.join(root, "preview/main.tsx")],
  bundle: true, minify: true, format: "iife", target: "es2020",
  outfile: path.join(root, "preview-dist/app.js"),
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [{
    name: "alias",
    setup(b) {
      b.onResolve({ filter: /^@\/lib\/router$/ }, () => ({ path: path.join(root, "preview/router.ts") }));
      b.onResolve({ filter: /^@\// }, (a) => b.resolve("./" + a.path.slice(2), { resolveDir: root, kind: a.kind }));
    },
  }],
  logLevel: "info",
});
execSync(`npx @tailwindcss/cli -i app/globals.css -o preview-dist/app.css --minify`, { cwd: root, stdio: "inherit" });
for (const f of ["poorani.jpg", "bhuvan-nritya.jpg", "viswakesh-youtube.jpg"]) copyFileSync(path.join(root, "public", f), path.join(root, "preview-dist", f));
