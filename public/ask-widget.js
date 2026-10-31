import { TOPICS, validModel, routeQuestion } from "./ask-router.js";
const launcher = document.getElementById("ask-launcher");
const panel = document.getElementById("ask-panel");
const close = document.getElementById("ask-close");
const form = document.getElementById("ask-form");
const input = document.getElementById("ask-question");
const messages = document.getElementById("ask-messages");
const status = document.getElementById("ask-status");
const answers = JSON.parse(document.getElementById("ask-answers").textContent);
let model = null,
  modelPromise = null,
  previousFocus = null;
function loadModel() {
  if (modelPromise) return modelPromise;
  status.textContent = "Loading small local router…";
  modelPromise = fetch(new URL("./classifier/model.json", import.meta.url), {
    credentials: "omit",
  })
    .then(response => {
      if (!response.ok) throw new Error("Router unavailable");
      return response.json();
    })
    .then(data => {
      if (!validModel(data)) throw new Error("Invalid router");
      model = data;
      status.textContent = "Local router ready · / or Ctrl+K to open";
      return model;
    })
    .catch(() => {
      status.textContent =
        "Local model unavailable; topic shortcuts still work.";
      return null;
    });
  return modelPromise;
}
function openPanel() {
  if (!panel.hidden) return;
  previousFocus = document.activeElement;
  panel.hidden = false;
  launcher.setAttribute("aria-expanded", "true");
  input.focus({ preventScroll: true });
  loadModel();
}
function closePanel() {
  panel.hidden = true;
  launcher.setAttribute("aria-expanded", "false");
  (previousFocus instanceof HTMLElement && previousFocus.tabIndex >= 0
    ? previousFocus
    : launcher
  ).focus({
    preventScroll: true,
  });
}
launcher.addEventListener("click", () =>
  panel.hidden ? openPanel() : closePanel()
);
close.addEventListener("click", closePanel);
document.addEventListener("keydown", event => {
  const editing =
    event.target instanceof HTMLElement &&
    (event.target.matches("input,textarea,select") ||
      event.target.isContentEditable);
  if (event.key === "Escape" && !panel.hidden) {
    event.preventDefault();
    closePanel();
  } else if (
    (event.key === "/" && !editing) ||
    ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k")
  ) {
    event.preventDefault();
    openPanel();
  }
});
let highlightTimer;
function reveal(topic) {
  const target = document.getElementById(topic.section);
  if (!target) return;
  document
    .querySelectorAll(".ledger-highlight")
    .forEach(el => el.classList.remove("ledger-highlight"));
  target.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
    block: "start",
  });
  target.classList.add("ledger-highlight");
  clearTimeout(highlightTimer);
  highlightTimer = setTimeout(
    () => target.classList.remove("ledger-highlight"),
    2000
  );
}
function topicAnswer(intent, automatic = false) {
  if (!Object.hasOwn(TOPICS, intent) || !Object.hasOwn(answers, intent)) return;
  const topic = TOPICS[intent];
  const response = document.createElement("div");
  response.className = "ask-answer-message";
  const text = document.createElement("p");
  text.textContent = answers[intent];
  text.style.margin = "0";
  const link = document.createElement("a");
  link.href = `#${topic.section}`;
  link.textContent = `View ${topic.label} →`;
  link.addEventListener("click", event => {
    event.preventDefault();
    reveal(topic);
  });
  response.append(text, link);
  messages.append(response);
  if (automatic) reveal(topic);
  messages.scrollTop = messages.scrollHeight;
}
function submit(query) {
  const text = query.trim();
  if (!text) return;
  const question = document.createElement("div");
  question.className = "ask-question-message";
  question.textContent = text;
  messages.append(question);
  const route = routeQuestion(text, model);
  if (route.kind === "topic") topicAnswer(route.intent, true);
  else {
    const answer = document.createElement("div");
    answer.className = "ask-answer-message";
    answer.textContent =
      route.kind === "choice"
        ? "Which topic would you like to see?"
        : "I can guide you through Kamrul's résumé, but I don't have information for that question. Choose a topic below.";
    const choices =
      route.kind === "choice"
        ? route.intents
        : [
            "identity",
            "experience",
            "skills",
            "projects",
            "writing",
            "education",
            "contact",
          ];
    for (const intent of choices) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ask-choice";
      button.textContent = TOPICS[intent].label;
      button.addEventListener("click", () => topicAnswer(intent, true));
      answer.append(button);
    }
    messages.append(answer);
  }
  while (messages.children.length > 40) messages.firstElementChild.remove();
  messages.scrollTop = messages.scrollHeight;
}
form.addEventListener("submit", event => {
  event.preventDefault();
  submit(input.value);
  input.value = "";
});
for (const button of document.querySelectorAll("[data-topic]"))
  button.addEventListener("click", () =>
    topicAnswer(button.dataset.topic, true)
  );
