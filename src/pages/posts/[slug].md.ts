import type { APIRoute } from "astro";
import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { SITE } from "@config";
import slugify from "@utils/slugify";

export async function getStaticPaths() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { slug: slugify(post.data) },
    props: { post },
  }));
}

export const get: APIRoute = ({ props, site }) => {
  const post = props.post as CollectionEntry<"blog">;
  const canonical = new URL(
    `posts/${slugify(post.data)}/`,
    site ?? SITE.website
  ).href;
  return new Response(
    [
      `# ${post.data.title}`,
      "",
      `> ${post.data.description}`,
      "",
      `Author: ${post.data.author ?? SITE.author}`,
      `Published: ${post.data.pubDatetime.toISOString().slice(0, 10)}`,
      `Source: ${canonical}`,
      "",
      post.body,
      "",
    ].join("\n"),
    { headers: { "Content-Type": "text/markdown; charset=utf-8" } }
  );
};
