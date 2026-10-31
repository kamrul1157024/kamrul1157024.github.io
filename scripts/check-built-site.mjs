import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
const root = resolve("dist");
for (const path of [
  "index.html",
  "ask-widget.js",
  "ask-router.js",
  "classifier/model.json",
  "toggle-theme.js",
  "posts/index.html",
  "projects/index.html",
  "search/index.html",
  "resume/index.html",
]) {
  assert.ok(existsSync(resolve(root, path)), `Missing deploy asset: ${path}`);
}
const html = readFileSync(resolve(root, "index.html"), "utf8");
assert.match(html, /5\+<\/strong>\s*years of experience/);
assert.match(html, /id="ask-panel"/);
let checked = 0;
for (const match of html.matchAll(/(?:href|src)="(\/[^"#]*)"/g)) {
  const url = new URL(match[1], "https://example.com");
  const path = decodeURIComponent(url.pathname).replace(/^\//, "");
  assert.ok(
    [resolve(root, path), resolve(root, path, "index.html")].some(existsSync),
    `Broken homepage link/asset: ${match[1]}`
  );
  checked++;
}
console.log(
  `Built site verified: router assets, preserved routes, ${checked} homepage links/assets, and experience header.`
);
