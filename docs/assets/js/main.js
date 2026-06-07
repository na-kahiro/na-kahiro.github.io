(function () {
  const THEME_KEY = "theme";
  const THEMES = ["auto", "light", "dark"];
  const THEME_ICONS = {
    auto: "bi-circle-half",
    light: "bi-sun-fill",
    dark: "bi-moon-stars-fill",
  };

  function getStoredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    return THEMES.includes(stored) ? stored : "auto";
  }

  function resolveTheme(theme) {
    if (theme !== "auto") return theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-bs-theme", resolveTheme(theme));
    localStorage.setItem(THEME_KEY, theme);
  }

  function syncThemeIcon() {
    const icon = document.getElementById("theme-icon");
    if (!icon) return;
    icon.className = `bi ${THEME_ICONS[getStoredTheme()]}`;
  }

  function initThemeToggle() {
    const button = document.getElementById("theme-toggle");
    if (!button) return;

    syncThemeIcon();
    button.addEventListener("click", function () {
      const current = getStoredTheme();
      const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
      applyTheme(next);
      syncThemeIcon();
    });
  }

  function formatCareerDate(yyyymm) {
    return yyyymm ? `${yyyymm.slice(0, 4)}/${yyyymm.slice(4, 6)}` : "Present";
  }

  function appendIcon(parent, iconClass, extraClass) {
    const icon = document.createElement("i");
    icon.className = `bi ${iconClass}${extraClass ? ` ${extraClass}` : ""}`;
    parent.appendChild(icon);
    return icon;
  }

  function renderProfile() {
    const careerContainer = document.getElementById("career-container");
    const tagsContainer = document.getElementById("research-tags-container");

    if (careerContainer) {
      const list = document.createElement("ul");
      list.className = "list-unstyled mb-0 d-flex flex-column gap-2";

      CAREER.forEach(({ from, to, institution, role }) => {
        const item = document.createElement("li");
        item.className = "d-flex gap-3 align-items-baseline";

        const time = document.createElement("span");
        time.className = "career-time text-nowrap";
        time.textContent = `${formatCareerDate(from)} \u2013 ${formatCareerDate(to)}`;

        const careerRole = document.createElement("span");
        careerRole.className = "career-role";
        careerRole.textContent = `${institution} \u00b7 ${role}`;

        item.append(time, careerRole);
        list.appendChild(item);
      });

      careerContainer.replaceChildren(list);
    }

    if (tagsContainer) {
      const fragment = document.createDocumentFragment();
      RESEARCH.tags.forEach(({ label, icon }) => {
        const tag = document.createElement("span");
        tag.className = "tag-chip";
        appendIcon(tag, icon, "text-primary");

        const text = document.createElement("span");
        text.textContent = label;
        tag.appendChild(text);
        fragment.appendChild(tag);
      });

      tagsContainer.replaceChildren(fragment);
    }
  }

  function renderLinks() {
    const container = document.getElementById("links-container");
    if (!container) return;

    const fragment = document.createDocumentFragment();
    LINKS.forEach(({ label, icon, url }) => {
      const link = document.createElement("a");
      link.href = url;
      link.className = "profile-link";

      appendIcon(link, icon);

      const text = document.createElement("span");
      text.className = "profile-link-label";
      text.textContent = label;
      link.appendChild(text);

      if (url !== "#") {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }

      fragment.appendChild(link);
    });

    container.replaceChildren(fragment);
  }

  function renderWhatsNew() {
    const container = document.getElementById("whatsnew-container");
    if (!container) return;

    const fragment = document.createDocumentFragment();
    WHATSNEW.forEach(({ date, tag, title, body, link }) => {
      const item = document.createElement(link ? "a" : "div");
      item.className = "feed-item";

      if (link) {
        item.href = link;
        item.target = "_blank";
        item.rel = "noopener noreferrer";
      }

      const meta = document.createElement("div");
      meta.className = "d-flex justify-content-between align-items-center mb-1";

      const tagBadge = document.createElement("span");
      tagBadge.className = "badge rounded-pill feed-tag";
      tagBadge.textContent = tag;

      const dateLabel = document.createElement("small");
      dateLabel.className = "text-body-tertiary";
      dateLabel.textContent = date;
      meta.append(tagBadge, dateLabel);

      const titleElement = document.createElement("div");
      titleElement.className = "fw-semibold mb-1";
      titleElement.append(document.createTextNode(title));
      if (link) {
        appendIcon(titleElement, "bi-box-arrow-up-right", "small text-primary ms-2");
      }

      const bodyElement = document.createElement("div");
      bodyElement.className = "text-body-secondary small";
      bodyElement.textContent = body;

      item.append(meta, titleElement, bodyElement);
      fragment.appendChild(item);
    });

    container.replaceChildren(fragment);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initThemeToggle();
    renderProfile();
    renderLinks();
    renderWhatsNew();
  });
})();
