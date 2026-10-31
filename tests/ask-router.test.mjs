import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const routerSource = readFileSync(
  new URL("../public/ask-router.js", import.meta.url),
  "utf8"
);
const { TOPICS, validModel, routeQuestion, classify } = await import(
  "data:text/javascript;base64," + Buffer.from(routerSource).toString("base64")
);
const model = JSON.parse(
  readFileSync(
    new URL("../public/classifier/model.json", import.meta.url),
    "utf8"
  )
);
test("exported weights validate and only known topics can execute", () => {
  assert.equal(validModel(model), true);
  assert.equal(
    validModel({
      ...model,
      classes: ["delete_file", ...model.classes.slice(1)],
    }),
    false
  );
  assert.equal(
    validModel({ ...model, b: [Infinity, ...model.b.slice(1)] }),
    false
  );
  assert.equal(validModel({ ...model, W: [] }), false);
});
const cases = [
  ["who is kamrul?", "identity"],
  ["hello", "identity"],
  ["where does he work?", "identity"],
  ["what is his experience?", "experience"],
  ["what did he build at work?", "experience"],
  ["what did he do at optimizely?", "experience"],
  ["what languages does he know?", "skills"],
  ["does he know terraform?", "skills"],
  ["does he know go?", "skills"],
  ["cloud experience", "skills"],
  ["what is terminal-ai?", "projects"],
  ["show helios", "projects"],
  ["open source projects", "projects"],
  ["react hooks", "writing"],
  ["what has he written?", "writing"],
  ["design patterns", "writing"],
  ["ssh simplified", "writing"],
  ["where did he study?", "education"],
  ["alma mater", "education"],
  ["mechanical engineering", "education"],
  ["how do I contact Kamrul?", "contact"],
  ["email", "contact"],
  ["get in touch", "contact"],
  ["download resume", "contact"],
];
for (const [query, intent] of cases)
  test(query, () => {
    const result = routeQuestion(query, model);
    assert.equal(result.kind, "topic");
    assert.equal(result.intent, intent);
    assert.ok(Object.hasOwn(TOPICS, result.intent));
  });
for (const query of [
  "weather tomorrow",
  "stock prices",
  "what is his salary?",
  "phone number",
  "delete ../private/key",
  "<script>alert(1)</script>",
  "qzxqzx",
  "",
])
  test("rejects " + JSON.stringify(query), () =>
    assert.equal(routeQuestion(query, model).kind, "unknown")
  );
test("asks instead of arbitrarily choosing multiple subjects", () =>
  assert.equal(routeQuestion("experience and projects", model).kind, "choice"));
test("topic shortcuts work when the model fails to load", () =>
  assert.equal(routeQuestion("where did he study?", null).intent, "education"));
test("a classifier-only paraphrase uses trained weights", () => {
  const result = routeQuestion("what has he open sourced", model);
  assert.equal(result.kind, "topic");
  assert.equal(result.intent, "projects");
  assert.equal(result.via, "classifier");
});
test("model confidence is only a score; empty/OOV vector cannot classify", () => {
  assert.equal(classify("qzxqzx", model), null);
  assert.equal(classify("", model), null);
});
