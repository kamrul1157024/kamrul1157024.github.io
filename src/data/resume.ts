// Resume content preserved from src/pages/resume.md. Keep both in sync.
export const resume = {
  name: "MD Kamrul Hassan",
  role: "Senior Software Engineer at Optimizely",
  experienceLabel: "5+ years of experience",
  email: "kamrul1157024@gmail.com",
  location: "Dhaka, Bangladesh",
  github: "https://github.com/kamrul1157024",
  linkedin: "https://www.linkedin.com/in/kamrul1157024/",
  bio: "I own backend services for Mark — Optimizely's AI agent platform — agent and workflow orchestration, tool calling, and agent memory and retrieval. Outside work I build developer tools: terminal CLIs, Neovim plugins, AI coding agent orchestration. I write about what I learned the hard way, some of it in Bengali.",
  skills: [
    {
      label: "Languages",
      text: "Python, TypeScript, JavaScript, Go, Java, C++, SQL",
    },
    {
      label: "AI & Agents",
      text: "LLM application development, agentic workflows, multi-agent orchestration, tool calling, MCP, RAG, prompt engineering, evals",
    },
    {
      label: "Backend & Frontend",
      text: "Node.js, Express.js, FastAPI, Spring Boot, Flask, Django, React, AngularJS, Microservices, REST APIs",
    },
    {
      label: "Data & Messaging",
      text: "MySQL, MongoDB, Elasticsearch, Event-driven architecture, Message brokers",
    },
    {
      label: "DevOps & Cloud",
      text: "AWS (EC2, VPC, SQS, Kinesis), GCP (Cloud Run, Cloud SQL, Spanner), Docker, Kubernetes, Terraform, Ansible, GitHub Actions, Jenkins, CI/CD, Infrastructure as Code, API gateways, Nginx, Observability",
    },
  ],
  roles: [
    {
      title: "Senior Software Engineer",
      company: "Optimizely",
      dates: "Apr 2026 – Present",
      note: "",
      bullets: [
        "Own backend services for Mark, the Optimizely AI agent platform, covering agent and workflow orchestration, tool calling, and agent memory and retrieval.",
        "Own platform infrastructure and delivery: Terraform-managed Cloud Run and Cloud SQL, Ansible playbooks, multi-arch Docker images, sharded GitHub Actions CI, and an API gateway with signed service-to-service auth, correlation-ID logging and request redaction.",
        "Shipped agentic workflow capabilities and remote sandboxed code execution infrastructure, including multi-agent routing, tool registry integration, fused semantic and keyword recall, and prompt guardrails.",
        "Architected phased zero-downtime data model migrations (double-write, backfill, cutover) and partitioned a shared event bus into dedicated brokers to isolate failure domains.",
        "Mentor engineers through design reviews and pairing, lead technical direction on cross-team initiatives, and drive alignment between product and platform teams.",
      ],
    },
    {
      title: "Software Engineer II",
      company: "Optimizely",
      dates: "Jan 2023 – Apr 2026",
      note: "",
      bullets: [
        "Added boolean query support to the global search system across MySQL and Elasticsearch, and improved search ranking and indexing pipelines for relevance and index freshness.",
        "Led migrations and refactors across services, including Kue to AWS SQS, JavaScript to TypeScript, and AngularJS 1.x to React.",
      ],
    },
    {
      title: "Software Engineer",
      company: "Optimizely",
      dates: "Dec 2021 – Dec 2022",
      note: "Joined via the Welcome acquisition.",
      bullets: [
        "Built a live website proofing system for browsing and annotating live sites collaboratively.",
        "Delivered branded login pages so each organization could authenticate on its own subdomain.",
        "Implemented rate limiting as a rapid response to an active DDoS attack, restoring availability.",
        "Authored technical specs and onboarding docs, and mentored interns and new engineers.",
      ],
    },
    {
      title: "Software Engineer",
      company: "Welcome",
      dates: "Oct 2021 – Nov 2021",
      note: "Software Engineer Intern, Apr 2021 – Sep 2021.",
      bullets: [
        "Developed microservice features in JavaScript and Node.js for the content marketing platform, and wrote API contract tests to catch breaking changes between services.",
      ],
    },
  ],
  projects: [
    {
      name: "Helios",
      url: "https://github.com/kamrul1157024/helios",
      blurb:
        "Daemon managing AI coding sessions over tmux with hook-event tracking, desktop and mobile notifications, voice narration and an Android client.",
    },
    {
      name: "C*Opal",
      url: "",
      blurb:
        "CLI coding agent that indexes existing codebases, self-corrects generated code, and supports MCP servers.",
    },
    {
      name: "terminal-ai",
      url: "https://github.com/kamrul1157024/terminal-ai",
      blurb:
        "Published npm CLI bringing LLM assistance to the terminal (OpenAI GPT-4o, local Llama 3.2 via Ollama).",
    },
    {
      name: "Bangla OCR",
      url: "https://colab.research.google.com/drive/1sGOqpF5XOfQ9-6xuigj21zmv6tLJ2a2j",
      blurb:
        "Modified VGG-16 CNN trained on the Ekush dataset for Bangla OCR. Python, TensorFlow.",
    },
    {
      name: "Social Media App",
      url: "https://github.com/kamrul1157024/Social-Media-App",
      blurb:
        "Full stack platform with rich-text posts, comments, booklets and follows, plus an NLP political-content classifier. Spring Boot, Django, TensorFlow, React, Docker.",
    },
  ],
  education:
    "B.Sc. in Mechanical Engineering — Bangladesh University of Engineering and Technology (BUET), 2016–2021. CGPA 3.03/4.00.",
} as const;
