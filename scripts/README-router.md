# Local Ask router

The homepage is a normal resume. Ask is optional: no WebGPU, LLM, external inference API, analytics, or question storage. The model JSON is fetched once when the panel is first opened. Questions and answers stay in memory in the visitor's browser.

- `public/ask-router.js`: pure, allowlisted topic routing. Specific topic shortcuts precede TF-IDF softmax regression. The model can only select identity, experience, skills, projects, writing, education or contact; it cannot execute arbitrary tools or access a filesystem.
- `public/classifier/model.json`: seven-class weights from the design prototype, rounded to seven decimal places (~116 KB uncompressed). Softmax scores are not calibrated confidence. The synthetic training data is small; the router abstains or offers topics when uncertain.
- `src/components/Ask.astro`: approved answers derived from the public resume. No generated claims about salary, availability, phone numbers or unpublished details.
- `public/ask-widget.js`: accessible panel, plain-text rendering, lazy model loading, theme-aware controls and section links. Shortcuts remain available if weights cannot load. No chat history is persisted.

Run `npm run test:router` for deterministic routing, unknown requests and model-validation regression tests. After an Astro build, run `node scripts/check-built-site.mjs` to check that all required public assets and linked pages are packaged.

To retrain offline (not required by the site build):

```sh
python3 -m venv .venv-router
.venv-router/bin/pip install numpy
.venv-router/bin/python scripts/train-router.py
npm run test:router
```

The trainer reports five-fold cross-validation and writes weights to `public/classifier/model.json`. Evaluate against independent real visitor phrasing before relaxing thresholds. Adding examples based on test failures means those examples are no longer held-out evidence.

Resume source: `src/data/resume.ts`, preserved from `src/pages/resume.md`. Keep both updated together. The separate `/resume` route stays available for printing.
