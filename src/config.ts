import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://kamrul1157024.github.io/",
  author: "MD Kamrul Hassan",
  desc: "Senior Software Engineer at Optimizely, building AI agent platforms. Notes on backend, distributed systems, design patterns and developer tooling — in English and Bengali.",
  title: "MD Kamrul Hassan",
  ogImage: "kamrul.jpg",
  lightAndDarkMode: true,
  postPerPage: 8,
};

export const LOCALE = ["en-EN"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/kamrul1157024",
    linkTitle: `${SITE.title} on Github`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/kamrul1157024/",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:kamrul1157024@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
];
