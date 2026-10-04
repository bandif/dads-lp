import type { APIRoute } from "astro";

// Discover static Astro pages at build time; dynamic routes need explicit entries.
const pages = import.meta.glob("./**/*.astro");
export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error("A production site URL is required for the sitemap.");
  const urls = Object.keys(pages)
    .filter(path => !path.includes("[") && !/\/(404|500)\.astro$/.test(path))
    .map(path => path.replace(/^\.\//, "").replace(/\.astro$/, "").replace(/(^|\/)index$/, "$1"))
    .map(path => new URL(path ? `/${path.replace(/\/$/, "")}/` : "/", site).href)
    .sort();
  const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${escape(url)}</loc></url>`).join("")}</urlset>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
