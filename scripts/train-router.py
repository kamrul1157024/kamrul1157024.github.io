import json, re, math, random
import numpy as np
from pathlib import Path

DATA = {
    "identity": [
        "who is kamrul", "who are you", "tell me about him", "what does he do",
        "about him", "who is this", "what is this site", "who is kamrul hassan",
        "introduce kamrul", "tell me about kamrul", "his bio", "what is his role",
        "where does he work", "what company does he work for", "what is his job",
        "hi", "hello", "hey", "what does kamrul do", "who is this guy",
        "who is he", "overview", "about", "summary", "tell me about this page",
        "what is this portfolio", "who made this site",
        "who is the owner of this site", "what is this website about",
        "introduce yourself", "tell me about the author", "his name",
        "what is his name", "about kamrul hassan", "who is md kamrul hassan",
        "what is his profession", "his job title", "what does he do for a living",
        "who is this person", "tell me about this guy", "what is his current position",
        "what is he known for", "who is the person behind this",
        "where does he work", "where is he employed", "his current company",
        "who is kamrul hassan the engineer", "what is his background",
    ],
    "experience": [
        "experience", "work history", "where has he worked", "what jobs has he had",
        "career", "optimizely", "welcome", "what did he do at optimizely",
        "his work experience", "job history", "previous jobs", "what has he built",
        "what does he own", "what services does he own", "what is he working on",
        "current role", "senior software engineer", "what is his job at optimizely",
        "what did he build at optimizely", "employment history", "professional experience",
        "what did he ship", "what has he shipped", "what does he do at work",
        "what is his position", "years of experience", "what does he do at his job",
        "professional background", "employment", "what companies has he worked for",
        "his career so far", "what has he done professionally", "what is his work",
        "what team does he work on", "what product does he work on",
        "what does he own at work", "what does he manage", "his responsibilities",
        "what did he work on at welcome", "when did he join optimizely",
        "how long has he been at optimizely", "his promotions",
        "what is he responsible for", "what does he work on at optimizely",
        "senior software engineer", "software engineer", "engineer at optimizely",
        "what services does he own", "owns services", "owns backend services",
        "his work at optimizely", "what he does at optimizely",
        "what has he built at work", "what did he build at his job",
        "work", "jobs",
    ],
    "skills": [
        "skills", "what languages does he know", "programming languages", "tech stack",
        "technologies", "what is he good at", "python", "typescript", "go",
        "aws", "gcp", "docker", "kubernetes", "terraform", "what tools does he use",
        "his stack", "what can he do", "expertise", "what frameworks", "backend skills",
        "frontend skills", "cloud skills", "databases", "what does he know",
        "ai skills", "llm", "rag", "mcp", "what technologies does he work with",
        "what languages", "what programming languages does he use",
        "what technologies does he know", "his technical skills", "what is his tech stack",
        "languages he knows", "what frameworks does he use", "does he know python",
        "does he know react", "does he know go", "cloud experience",
        "infrastructure skills", "what databases does he use", "message brokers",
        "observability", "ci cd", "what is he experienced in", "his areas of expertise",
        "what is he skilled at", "his strengths", "skills and technologies",
        "what is his stack", "technical stack", "what does he code in",
    ],
    "projects": [
        "projects", "side projects", "what has he built", "helios", "terminal-ai",
        "github projects", "personal projects", "portfolio projects",
        "what does he build outside work", "hackathon", "copal", "bangla ocr",
        "social media app", "open source", "his repos", "what code has he written",
        "show me his projects", "what is helios", "what is terminal-ai",
        "what did he make", "his github", "what is he building",
        "what projects has he built", "his side projects", "personal work",
        "what does he build in his free time", "hobby projects", "what is on his github",
        "tell me about helios", "tell me about terminal-ai", "what is copal",
        "what did he build for fun", "his open source work", "what has he open sourced",
        "his hackathon project", "repos", "his repositories", "what repos does he have",
        "what has he built outside work", "what tools has he built",
    ],
    "writing": [
        "writing", "blog", "posts", "articles", "what has he written",
        "has he written anything", "blog posts", "react hooks", "ssh", "design patterns",
        "read his posts", "his writing", "technical writing", "bengali posts",
        "what does he write about", "his blog", "where are his articles",
        "his blog posts", "articles he wrote", "what does he blog about",
        "his technical blog", "where can i read his writing", "does he write",
        "his posts", "what topics does he write about", "his articles",
        "what has he published", "what did he write", "ssh simplified",
        "react hooks in layman's terms", "his design pattern posts",
        "what has he blogged about", "does he have a blog",
    ],
    "education": [
        "education", "where did he study", "university", "buet", "degree", "school",
        "what did he study", "college", "mechanical engineering", "cgpa",
        "graduation", "academic background", "what university did he attend",
        "his education", "where did he graduate from",
        "his degree", "what is his major", "bachelor of science",
        "where did he go to university", "which university", "his university",
        "when did he graduate", "his cgpa", "engineering background",
        "mechanical engineer", "what did he major in", "college", "his college",
        "studied at", "alma mater", "what did he study at university",
    ],
    "contact": [
        "contact", "email", "how to reach him", "hire him", "linkedin", "github",
        "phone", "get in touch", "resume", "cv", "download resume",
        "how do i contact", "reach out", "hire", "recruiter", "job offer",
        "how can i contact kamrul", "his email address", "is he available for work",
        "connect with him", "how to contact him", "contact details", "his email",
        "email address", "phone number", "how do i reach kamrul",
        "get in touch with him", "is he hiring", "is he looking for a job",
        "is he open to opportunities", "how do i hire him", "send him a message",
        "his linkedin profile", "his github profile", "contact information",
        "reach kamrul", "how do i get his resume", "can i contact him",
        "how do i email him", "what is his email",
    ],
}

def tokenize(t):
    t = t.lower()
    words = re.findall(r"[a-z0-9]+", t)
    toks = list(words)
    for w in words:
        if len(w) >= 4:
            toks += [w[i:i+3] for i in range(len(w) - 2)]
    toks += [words[i] + "_" + words[i+1] for i in range(len(words) - 1)]
    return toks

docs = [(q, cls) for cls, qs in DATA.items() for q in qs]
random.seed(42)
random.shuffle(docs)

classes = sorted(DATA.keys())
C = len(classes)

def fit(X, Y, epochs=300, seed=42):
    rng = np.random.default_rng(seed)
    V = X.shape[1]
    W = rng.normal(0, 0.02, (C, V))
    b = np.zeros(C)
    lr = 0.25
    for epoch in range(epochs):
        idx = np.arange(len(X))
        rng.shuffle(idx)
        for start in range(0, len(X), 32):
            batch = idx[start:start+32]
            Xb, Yb = X[batch], Y[batch]
            logits = Xb @ W.T + b
            logits -= logits.max(axis=1, keepdims=True)
            p = np.exp(logits)
            p /= p.sum(axis=1, keepdims=True)
            p[np.arange(len(batch)), Yb] -= 1
            W -= lr * ((p.T @ Xb) / len(batch) + 1e-4 * W)
            b -= lr * p.mean(axis=0)
        lr *= 0.995
    return W, b

def vect_all(qs, vocab, vid, idf):
    V = len(vocab)
    out = np.zeros((len(qs), V))
    for i, q in enumerate(qs):
        x = np.zeros(V)
        for tok in tokenize(q):
            j = vid.get(tok)
            if j is not None:
                x[j] += 1
        x[x > 0] = 1 + np.log(x[x > 0])
        x = x * idf
        n = np.linalg.norm(x)
        if n > 0:
            x = x / n
        out[i] = x
    return out

def predict(q, vocab, vid, idf, W, b):
    x = vect_all([q], vocab, vid, idf)[0]
    logits = x @ W.T + b
    logits -= logits.max()
    p = np.exp(logits)
    p /= p.sum()
    return classes[int(np.argmax(p))], float(p.max())

# ---- 5-fold cross-validation ----
folds = [[] for _ in range(5)]
for i, d in enumerate(docs):
    folds[i % 5].append(d)
accs = []
for k in range(5):
    val = folds[k]
    tr = [d for j in range(5) if j != k for d in folds[j]]
    df = {}
    for q, _ in tr:
        for tok in set(tokenize(q)):
            df[tok] = df.get(tok, 0) + 1
    vocab = sorted(df)
    vid = {t: i for i, t in enumerate(vocab)}
    idf = np.array([math.log((len(tr) + 1) / (df[t] + 1)) + 1 for t in vocab], dtype=np.float64)
    X = vect_all([q for q, _ in tr], vocab, vid, idf)
    Y = np.array([classes.index(c) for _, c in tr])
    W, b = fit(X, Y)
    ok = sum(1 for q, c in val if predict(q, vocab, vid, idf, W, b)[0] == c)
    accs.append(ok / len(val))
    print("fold %d: %.1f%%" % (k, 100 * accs[-1]))
print("CV accuracy: %.1f%% (+/- %.1f)" % (100 * np.mean(accs), 100 * np.std(accs)))

# ---- final model trained on everything ----
df = {}
for q, _ in docs:
    for tok in set(tokenize(q)):
        df[tok] = df.get(tok, 0) + 1
vocab = sorted(df)
vid = {t: i for i, t in enumerate(vocab)}
idf = np.array([math.log((len(docs) + 1) / (df[t] + 1)) + 1 for t in vocab], dtype=np.float64)
X = vect_all([q for q, _ in docs], vocab, vid, idf)
Y = np.array([classes.index(c) for _, c in docs])
W, b = fit(X, Y, epochs=500)

model = {
    "classes": classes,
    "vocab": {t: vid[t] for t in vocab},
    "idf": idf.tolist(),
    "W": W.tolist(),
    "b": b.tolist(),
}
model["idf"] = [round(v, 7) for v in model["idf"]]
model["W"] = [[round(v, 7) for v in row] for row in model["W"]]
model["b"] = [round(v, 7) for v in model["b"]]
s = json.dumps(model, separators=(",", ":"))
target = Path(__file__).resolve().parents[1] / "public/classifier/model.json"
target.write_text(s + "\n")
print("model.json bytes:", len(s))
print("samples:")
for q in ["what is his tech stack?", "where did he study?", "hire him", "what has he written?", "what did he build at work?", "who is kamrul?", "what projects has he built?", "how do i contact him?"]:
    pc, prob = predict(q, vocab, vid, idf, W, b)
    print("  %r -> %s (%.0f%%)" % (q, pc, 100 * prob))
