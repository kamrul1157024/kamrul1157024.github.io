import React, { useEffect } from "react";

const SCRIPT_OPTIONS: Record<string, string> = {
  src: "https://giscus.app/client.js",
  "data-repo": "kamrul1157024/kamrul1157024.github.io",
  "data-repo-id": "MDEwOlJlcG9zaXRvcnkxMDM1NzQwODQ=",
  "data-category": "Show and tell",
  "data-category-id": "DIC_kwDOBixqRM4CWTSF",
  "data-mapping": "pathname",
  "data-strict": "0",
  "data-reactions-enabled": "1",
  "data-emit-metadata": "0",
  "data-input-position": "top",
  "data-lang": "en",
  "data-loading": "lazy",
  crossOrigin: "anonymous",
  async: "",
};

const THEME_MAP = {
  dark: "dark_high_contrast",
  light: "light_high_contrast",
};

export default function GiscusComment() {
  useEffect(() => {
    const updateGiscusCommentTheme = () => {
      const currentTheme = localStorage.getItem("theme") as "light" | "dark";
      const script = document.createElement("script");

      Object.keys(SCRIPT_OPTIONS).forEach(key => {
        script.setAttribute(key, SCRIPT_OPTIONS[key]);
      });

      script.setAttribute("data-theme", THEME_MAP[currentTheme || "dark"]);

      document.body.appendChild(script);
    };
    updateGiscusCommentTheme();
    window.addEventListener("storage", updateGiscusCommentTheme);
    return () => {
      window.removeEventListener("storage", updateGiscusCommentTheme);
    };
  }, []);

  return (
    <section className="giscus max-w-screen-md mx-auto mt-10">
      <script></script>
    </section>
  );
}
