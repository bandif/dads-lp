# SEO implementation and release checks

## Page purposes

- `/`: specialist, experience, Budapest practice and booking.
- `/dr-fekete-ferenc/`: professional background and credentials.
- `/fitymaszukulet/`: symptoms, short frenulum distinction, treatment and recovery.
- `/papulak/` and `/peniszgorbulet/`: distinct treatment guides.

Do not add separate circumcision or short-frenulum pages until there is enough distinct, useful content and search data to justify them.

## Medical review

`src/data/medical-content.ts` holds references and fixed editorial modification dates. The 2026-10-04 date records this substantive editorial update, not a medical review. Do not refresh it automatically on builds.

No doctor authorship or completed medical review is claimed. The visible specialist link identifies the treating doctor. After Dr. Fekete reviews the current text, enter the genuine `reviewedOn` date for each reviewed page; the visible reviewer attribution and `lastReviewed`/`reviewedBy` schema will then appear together. Re-review materially changed medical content.

Sources appear in compact expandable sections on treatment pages, not in the homepage FAQ. They support general medical information, not this practice's fees or service arrangements.

## Entity and contact consistency

`src/data/practice.ts` supplies shared contact details to the header, footer, contact panel and schema. Update it when the practice changes. The practice entity is `https://fitymaszukulet.hu/#practice`; the individual doctor is `https://fitymaszukulet.hu/dr-fekete-ferenc/#person`. Consultations are Tuesday/Thursday 09:00–12:00 and 16:00–19:00; weekday telephone availability is not represented as clinic opening hours.

## Live hosting and migration

On 2026-10-04 the web lookup returned the older WordPress site at the production domain. Its robots.txt and sitemap.xml could not be fetched. Direct requests to these and WordPress sitemap alternatives were blocked by the execution environment's network proxy. This does not establish that the live files are missing.

The Astro build now outputs robots.txt and sitemap.xml, discovering static Astro pages at build time. Dynamic routes would need explicit support. Canonicals and sitemap entries use trailing slashes. No arbitrary priority, change frequency or automatically refreshed lastmod values are emitted.

Before switching hosting, inventory existing WordPress URLs and configure individual permanent redirects to equivalent new pages. Preserve useful older content; do not redirect every old URL to the homepage. The repository has no hosting configuration, so server redirects have not been installed.

After deployment:

1. Confirm production robots.txt and sitemap.xml return HTTP 200 with the generated contents, not old WordPress or fallback HTML responses.
2. Verify all five canonical pages, HTTP-to-HTTPS/host redirects and trailing-slash behavior. Ensure the host does not set a noindex header. Keep staging out of search with host-level access control or noindex.
3. Validate rendered structured data with Google's Rich Results Test and Schema.org Validator. Valid schema does not guarantee a search feature.
4. In the verified Search Console property, submit `https://fitymaszukulet.hu/sitemap.xml`, inspect the canonical pages and monitor indexing and redirects.
5. Use Search Console query/page/country data to choose keyword priorities; no keyword volumes or ranking improvements have been assumed.

## Google Business Profile

No authenticated Business Profile or Search Console connection was available for this task; no profile edits or sitemap submissions were made.

Reconcile the verified listing with the site's doctor name, phone, address and consultation hours. Include the building/floor directions, relevant services actually provided and genuine practice photographs. Review holiday exceptions separately. Existing local image assets are used on the website; no synthetic practice photographs or unverified map/place identifiers were added.

## Guidance

- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://support.google.com/business/answer/7091
