document.querySelectorAll<HTMLElement>(".condition-nav").forEach((nav) => {
  const entries = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'))
    .map((link) => ({ link, section: document.getElementById(decodeURIComponent(link.hash.slice(1))) }))
    .filter((entry): entry is { link: HTMLAnchorElement; section: HTMLElement } => !!entry.section);
  const content = nav.closest(".condition-layout")?.querySelector(".condition-content");
  if (!entries.length || !content) return;

  let scheduled = false;
  const update = () => {
    scheduled = false;
    const headerBottom = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;
    const readingLine = Math.max(0, headerBottom) + 40;
    const bounds = content.getBoundingClientRect();
    let active: HTMLAnchorElement | undefined;

    if (bounds.top < window.innerHeight && bounds.bottom > readingLine) {
      active = entries[0].link;
      for (const entry of entries) {
        if (entry.section.getBoundingClientRect().top <= readingLine) active = entry.link;
        else break;
      }
    }

    for (const { link } of entries) {
      if (link === active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("hashchange", schedule);
  window.addEventListener("pageshow", schedule);
  new ResizeObserver(schedule).observe(content);
  update();
});
