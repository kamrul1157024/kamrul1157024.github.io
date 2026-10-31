(() => {
  let theme = "dark";
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") theme = saved;
  } catch {
    /* Storage may be disabled; the toggle still works for this page. */
  }
  function reflect() {
    document.documentElement.dataset.theme = theme;
    const button = document.getElementById("theme-btn");
    if (button) {
      const next = theme === "dark" ? "light" : "dark";
      button.textContent = `${next} mode`;
      button.setAttribute("aria-label", `Switch to ${next} mode`);
    }
  }
  reflect();
  document.addEventListener("DOMContentLoaded", () => {
    reflect();
    document.getElementById("theme-btn")?.addEventListener("click", () => {
      theme = theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("theme", theme);
      } catch {
        /* Keep the page-local preference. */
      }
      reflect();
    });
  });
  window.addEventListener("storage", event => {
    if (event.key === "theme") {
      theme = event.newValue === "light" ? "light" : "dark";
      reflect();
    }
  });
})();
