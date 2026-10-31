import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
const root = resolve("dist");
for (const path of [
  "index.html",
  "llms.txt",
  "index.md",
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

// llms.txt and Markdown must remain in sync with the résumé and link to packaged content.
const llms = readFileSync(resolve(root, "llms.txt"), "utf8");
const markdown = readFileSync(resolve(root, "index.md"), "utf8");
assert.match(llms, /^# MD Kamrul Hassan\n\n> /);
assert.match(llms, /^## Portfolio$/m);
assert.match(llms, /^## Writing$/m);
assert.match(markdown, /^# MD Kamrul Hassan/m);
for (const text of [
  html,
  markdown,
  readFileSync(resolve(root, "resume/index.html"), "utf8"),
]) {
  assert.ok(
    text.includes("Maintain backend services and agentic architecture for Mark")
  );
  assert.ok(text.includes("Maintain platform infrastructure and delivery"));
  assert.ok(
    !/I own|Own backend services|Own platform infrastructure|He owns/.test(text)
  );
}
for (const term of [
  "I maintain backend services",
  "agentic architecture",
  "Cloud Run",
  "Cloud SQL",
  "Terraform",
  "isolated brokers",
  "zero-downtime data model migrations",
]) {
  assert.ok(html.includes(term), `Missing introduction detail: ${term}`);
  assert.ok(markdown.includes(term), `Missing Markdown detail: ${term}`);
}
assert.ok(html.includes("He maintains Mark's backend services"));
assert.match(html, /rel="describedby" href="\/llms.txt"/);
for (const match of llms.matchAll(/\[[^\]]+\]\((https:\/\/[^)]+)\)/g)) {
  const url = new URL(match[1]);
  if (url.hostname !== "kamrul1157024.github.io") continue;
  const path = decodeURIComponent(url.pathname).replace(/^\//, "");
  assert.ok(
    [
      resolve(root, path || "index.html"),
      resolve(root, path, "index.html"),
    ].some(existsSync),
    `Broken llms.txt link: ${url.href}`
  );
}
console.log(
  "Copy and llms.txt verified: maintain wording, restored infrastructure, packaged Markdown and valid content links."
);
