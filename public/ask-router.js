// The classifier selects a public topic. Only this whitelist can produce actions.
export const TOPICS = Object.freeze({
  identity: {
    label: "About Kamrul",
    section: "sec-identity",
    tool: "read_file",
    file: "identity.md",
  },
  experience: {
    label: "Experience",
    section: "sec-experience",
    tool: "read_file",
    file: "experience.md",
  },
  skills: {
    label: "Skills",
    section: "sec-skills",
    tool: "read_file",
    file: "skills.md",
  },
  projects: {
    label: "Projects",
    section: "sec-projects",
    tool: "list_files",
    file: "projects/",
  },
  writing: {
    label: "Writing",
    section: "sec-writing",
    tool: "list_files",
    file: "writing/",
  },
  education: {
    label: "Education",
    section: "sec-education",
    tool: "read_file",
    file: "education.md",
  },
  contact: {
    label: "Contact",
    section: "sec-identity",
    tool: "read_file",
    file: "contact.md",
  },
});
const STOP = new Set(
  "who what when where why how is are was were be been he him his she her it this that the a an at for of to in on and or with do does did can i me you your about tell show please know has have had any get there".split(
    " "
  )
);
export function tokenize(query) {
  const words = query.toLowerCase().match(/[a-z0-9]+/g) || [];
  const tokens = [...words];
  for (const word of words) {
    if (word.length >= 4)
      for (let i = 0; i < word.length - 2; i++)
        tokens.push(word.slice(i, i + 3));
  }
  for (let i = 0; i < words.length - 1; i++)
    tokens.push(`${words[i]}_${words[i + 1]}`);
  return tokens;
}
export function validModel(model) {
  if (
    !model ||
    !Array.isArray(model.classes) ||
    model.classes.length !== 7 ||
    new Set(model.classes).size !== 7 ||
    !model.classes.every(c => Object.hasOwn(TOPICS, c))
  )
    return false;
  if (
    !model.vocab ||
    !Array.isArray(model.idf) ||
    !Array.isArray(model.W) ||
    !Array.isArray(model.b)
  )
    return false;
  const size = model.idf.length;
  return (
    size > 0 &&
    size < 20000 &&
    model.idf.every(Number.isFinite) &&
    model.W.length === 7 &&
    model.W.every(
      row =>
        Array.isArray(row) && row.length === size && row.every(Number.isFinite)
    ) &&
    model.b.length === 7 &&
    model.b.every(Number.isFinite) &&
    Object.values(model.vocab).every(
      i => Number.isInteger(i) && i >= 0 && i < size
    )
  );
}
export function classify(query, model) {
  if (!model) return null;
  const vector = new Map();
  for (const token of tokenize(query)) {
    const index = Object.hasOwn(model.vocab, token)
      ? model.vocab[token]
      : undefined;
    if (index !== undefined) vector.set(index, (vector.get(index) || 0) + 1);
  }
  if (!vector.size) return null;
  const features = Array.from(vector, ([index, count]) => [
    index,
    (1 + Math.log(count)) * model.idf[index],
  ]);
  const norm =
    Math.sqrt(features.reduce((sum, [, value]) => sum + value * value, 0)) || 1;
  const scores = model.classes.map((intent, c) => ({
    intent,
    logit:
      model.b[c] +
      features.reduce(
        (sum, [i, value]) => sum + (model.W[c][i] * value) / norm,
        0
      ),
  }));
  const max = Math.max(...scores.map(s => s.logit));
  const denominator = scores.reduce(
    (sum, s) => sum + Math.exp(s.logit - max),
    0
  );
  const ranked = scores
    .map(s => ({
      intent: s.intent,
      score: Math.exp(s.logit - max) / denominator,
    }))
    .sort((a, b) => b.score - a.score);
  return { ...ranked[0], margin: ranked[0].score - ranked[1].score };
}
const EXPLICIT = [
  [
    "contact",
    /\b(contact|email|e-mail|hire|hiring|recruiter|linkedin|reach|cv|resume|résumé|connect|message)\b|\bget in touch\b/,
  ],
  [
    "writing",
    /\b(writing|written|wrote|blog|posts?|articles?|ssh)\b|\breact hooks\b|\bdesign patterns?\b/,
  ],
  [
    "projects",
    /\b(projects?|helios|copal|ocr|hackathon|repos?|repositories|neovim)\b|\bterminal[ -]ai\b|\bopen[ -]source\b|\bside projects?\b/,
  ],
  [
    "education",
    /\b(education|study|studied|university|buet|degree|college|cgpa|school|graduat\w*|major)\b|\balma mater\b|\bmechanical engineering\b/,
  ],
  [
    "skills",
    /\b(skills?|stack|expertise|languages?|frameworks?|technologies|cloud|python|typescript|javascript|golang|go|java|sql|rust|react|angularjs|fastapi|nodejs|django|docker|kubernetes|terraform|aws|gcp|mysql|mongodb|elasticsearch|mcp|rag|llm|ansible|jenkins)\b/,
  ],
  [
    "experience",
    /\b(experience|career|jobs?|employment|optimizely|welcome|mark|opal|responsibilities|promotions?)\b|\bwork history\b|\bat work\b|\bprofessional background\b/,
  ],
  [
    "identity",
    /\b(about|overview|bio|summary|introduce|name|role|profession)\b|\bwho (is|are)\b/,
  ],
];
function resolved(intent, via) {
  return { kind: "topic", intent, via, ...TOPICS[intent] };
}
export function routeQuestion(query, model = null) {
  const text = String(query || "")
    .trim()
    .toLowerCase();
  if (!text || text.length > 500) return { kind: "unknown" };
  if (
    /\b(password|secret|private|salary|phone|address|weather|forecast|stock|delete|execute|sudo)\b|\.\.\/|<script/i.test(
      text
    )
  )
    return { kind: "unknown" };
  if (/^(hi|hello|hey)[!. ]*$/.test(text))
    return resolved("identity", "shortcut");
  const hits = EXPLICIT.filter(([, expression]) => expression.test(text)).map(
    ([intent]) => intent
  );
  // Subject-specific requests take precedence over incidental names in a question.
  if (hits.includes("contact")) return resolved("contact", "shortcut");
  if (/\breact hooks\b|\bdesign patterns?\b/.test(text))
    return resolved("writing", "shortcut");
  if (/\bwhere does he work\b|\bcurrent (role|position|company)\b/.test(text))
    return resolved("identity", "shortcut");
  const relevant = hits.filter(t => t !== "identity");
  if (relevant.length === 1) return resolved(relevant[0], "shortcut");
  if (relevant.length > 1) {
    if (
      /\b(cloud|python|react|go|terraform|docker|kubernetes) (skills?|experience)\b|\bdoes he know\b/.test(
        text
      ) &&
      relevant.includes("skills")
    )
      return resolved("skills", "shortcut");
    if (
      /\bat work\b|\bat (optimizely|welcome)\b/.test(text) &&
      relevant.includes("experience")
    )
      return resolved("experience", "shortcut");
    return { kind: "choice", intents: relevant };
  }
  if (hits.includes("identity")) return resolved("identity", "shortcut");
  // Do not let character fragments alone route unrelated inputs.
  const words = text.match(/[a-z0-9]+/g) || [];
  const supported =
    model &&
    words.some(
      w => !STOP.has(w) && w.length > 3 && Object.hasOwn(model.vocab, w)
    );
  const prediction = supported ? classify(text, model) : null;
  // Softmax scores are routing scores, not calibrated confidence or factual certainty.
  if (prediction && prediction.score >= 0.6 && prediction.margin >= 0.25)
    return resolved(prediction.intent, "classifier");
  return { kind: "unknown" };
}
