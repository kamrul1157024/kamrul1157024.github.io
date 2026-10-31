import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { resume } from "../data/resume";
import { SITE } from "@config";
import getSortedPosts from "@utils/getSortedPosts";
import slugify from "@utils/slugify";

// Static, build-generated guide following the llms.txt proposal: https://llmstxt.org/.
export const get: APIRoute = async ({ site }) => {
  const base = site ?? new URL(SITE.website);
  const url = (path: string) => new URL(path, base).href;
  const posts = getSortedPosts(
    await getCollection("blog", ({ data }) => !data.draft)
  );
  const lines = [
    `# ${resume.name}`,
    "",
    `> Personal portfolio and résumé of ${resume.name}, ${resume.role}, with ${resume.experienceLabel}, based in ${resume.location}.`,
    "",
    "Kamrul maintains backend services, agentic architecture, and platform infrastructure for Mark, Optimizely's AI agent platform. The site contains his public career history, technical skills, selected projects, education, and technical writing in English and Bengali.",
    "",
    "Mark is the current product name in the résumé. C*Opal is a historical hackathon project name, not an alternative name for Mark. The Ask widget is a local classifier-based section guide, not a generative AI service. This file is a content guide, not a robots.txt file or a statement of crawl permissions.",
    "",
    "## Portfolio",
    "",
    `- [Full résumé in Markdown](${url(
      "index.md"
    )}): Biography, responsibilities, infrastructure, career history, skills, projects, and education; generated from the same content as the homepage.`,
    `- [Homepage](${url("")}): Human-readable Ledger résumé.`,
    `- [Printable résumé](${url("resume/")}): Print-friendly career details.`,
    `- [All projects](${url(
      "projects/"
    )}): Curated developer tools and side projects.`,
    "",
    "## Writing",
    "",
    ...posts.map(
      ({ data }) =>
        `- [${data.title}](${url(`posts/${slugify(data)}.md`)}): ${
          data.description
        }`
    ),
    "",
    "## Optional",
    "",
    `- [GitHub profile](${resume.github}): Public repositories.`,
    `- [LinkedIn profile](${resume.linkedin}): Professional profile.`,
    `- [RSS feed](${url("rss.xml")}): Technical article feed.`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
