export type Project = {
  repo: string;
  name: string;
  blurb: string;
  tech: string[];
  featured: boolean;
  stars: number;
  forks: number;
  url: string;
};

const GITHUB_USER = "kamrul1157024";

type Curated = Omit<Project, "stars" | "forks" | "url">;

const CURATED: Curated[] = [
  {
    repo: "terminal-ai",
    name: "terminal-ai",
    blurb:
      "CLI that turns natural language into shell commands and runs them, with an agentic loop for multi-step tasks.",
    tech: ["TypeScript", "LLM", "CLI"],
    featured: true,
  },
  {
    repo: "helios",
    name: "helios",
    blurb:
      "Platform that orchestrates AI coding agents on your own machine instead of a hosted sandbox.",
    tech: ["Go", "Agents"],
    featured: true,
  },
  {
    repo: "nvim-pr",
    name: "nvim-pr",
    blurb:
      "Neovim plugin that pulls the GitHub pull request context for whatever line the cursor is on.",
    tech: ["Lua", "Neovim"],
    featured: true,
  },
  {
    repo: "Social-Media-App",
    name: "Social Media App",
    blurb:
      "Blog-style social platform with rich-text posts, booklets and follows. Classifies political posts with ML.",
    tech: ["Java", "Spring Boot", "Django", "React", "TensorFlow"],
    featured: true,
  },
  {
    repo: "teams-cli",
    name: "teams-cli",
    blurb: "Unix-style command line client for Microsoft Teams.",
    tech: ["Go", "CLI"],
    featured: false,
  },
  {
    repo: "scripts-and-conf",
    name: "scripts-and-conf",
    blurb: "Personal dotfiles, Neovim config and day-to-day shell scripts.",
    tech: ["Lua", "Shell"],
    featured: false,
  },
  {
    repo: "d-ipcam",
    name: "d-ipcam",
    blurb: "Dahua IP camera viewer for macOS.",
    tech: ["Python", "macOS"],
    featured: false,
  },
  {
    repo: "Design-Patterns-Shorthand-Bengali",
    name: "Design Patterns Shorthand",
    blurb:
      "Design patterns explained in Bengali with runnable Java examples. Source for the design pattern posts here.",
    tech: ["Java", "Bengali"],
    featured: false,
  },
  {
    repo: "simple-user-app",
    name: "simple-user-app",
    blurb:
      "End-to-end DevOps exercise: provisioning, container orchestration and reverse proxying for a small app.",
    tech: ["Terraform", "Docker", "AWS", "Nginx"],
    featured: false,
  },
];

type RepoStats = { stars: number; forks: number };

async function fetchStats(): Promise<Map<string, RepoStats>> {
  const stats = new Map<string, RepoStats>();
  const token = import.meta.env.GITHUB_TOKEN ?? process.env.GITHUB_TOKEN;

  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );

  if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);

  const repos = (await res.json()) as Array<{
    name: string;
    stargazers_count: number;
    forks_count: number;
  }>;

  for (const repo of repos) {
    stats.set(repo.name, {
      stars: repo.stargazers_count,
      forks: repo.forks_count,
    });
  }

  return stats;
}

// Star counts are a nice-to-have, so a rate limited or offline build falls back
// to zeroes rather than failing. Resolved once per process: the dev server
// re-renders on every request and would otherwise burn the rate limit.
let statsPromise: Promise<Map<string, RepoStats>> | undefined;

export default async function getProjects(): Promise<Project[]> {
  statsPromise ??= fetchStats().catch((err: Error) => {
    console.warn(
      `[getProjects] could not fetch GitHub stats, rendering without them: ${err.message}`
    );
    return new Map<string, RepoStats>();
  });

  const stats = await statsPromise;

  return CURATED.map(project => ({
    ...project,
    stars: stats.get(project.repo)?.stars ?? 0,
    forks: stats.get(project.repo)?.forks ?? 0,
    url: `https://github.com/${GITHUB_USER}/${project.repo}`,
  }));
}
