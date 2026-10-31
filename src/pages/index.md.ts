import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { resume } from "../data/resume";
import { SITE } from "@config";
import getSortedPosts from "@utils/getSortedPosts";
import slugify from "@utils/slugify";

export const get: APIRoute = async ({ site }) => {
  const base = site ?? new URL(SITE.website);
  const url = (path: string) => new URL(path, base).href;
  const posts = getSortedPosts(
    await getCollection("blog", ({ data }) => !data.draft)
  );
  const lines = [
    `# ${resume.name}`,
    "",
    `> ${resume.role}. ${resume.experienceLabel}. Based in ${resume.location}.`,
    "",
    resume.bio,
    "",
    `Email: [${resume.email}](mailto:${resume.email}) · [GitHub](${resume.github}) · [LinkedIn](${resume.linkedin})`,
    "",
    "## Experience",
    "",
    ...resume.roles.flatMap(role => [
      `### ${role.title} — ${role.company}`,
      "",
      role.dates,
      "",
      ...(role.note ? [role.note, ""] : []),
      ...role.bullets.map(bullet => `- ${bullet}`),
      "",
    ]),
    "## Technical Skills",
    "",
    ...resume.skills.map(skill => `- **${skill.label}:** ${skill.text}`),
    "",
    "## Projects",
    "",
    ...resume.projects.map(
      project =>
        `- **${
          project.url ? `[${project.name}](${project.url})` : project.name
        }:** ${project.blurb}`
    ),
    "",
    `[All projects](${url("projects/")})`,
    "",
    "## Education",
    "",
    resume.education,
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
    "## Site",
    "",
    `- [Human-readable résumé](${url("")})`,
    `- [Printable résumé](${url("resume/")})`,
    `- [Writing index](${url("posts/")})`,
    "",
    "The optional Ask panel is a local intent classifier that routes questions to public résumé sections. It is not a generative chatbot. It does not provide private company information or personal details beyond those published here.",
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
