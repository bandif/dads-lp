# Editing the website

Open **https://fitymaszukulet.hu/admin/** and sign in with your invited email address and password. No GitHub account is needed.

The editor is in Hungarian:

- **Főoldal**: opening section, treatment cards, reviews, introduction, benefits, appointment steps, and FAQs.
- **Aloldalak**: the doctor's profile, the three treatment pages, and **Költségek**. On Költségek, edit the introduction, treatment names, prices, notes, and closing information. Treatments can be added, removed, and reordered; enter prices as displayed text (for example, `100 000 Ft` or `150 000–400 000 Ft`). The email address follows **Közös elemek → Rendelő adatai**.
- **Közös elemek**: contact details, header/menu, footer, contact section, and the information-page footnote.

Choose a section, change its text or select/upload an image, then publish. Publication commits the content to `main`; Netlify rebuilds the website. Wait for that deployment to finish before checking the public page. Phone/email/map links follow the contact details automatically. Existing image descriptions remain in the templates; the editor has no alt-text, SEO, CSS, or HTML fields.

## One-time production setup

The CMS uses Netlify Identity and Git Gateway with the site's connected repository, branch `main`.

1. Connect Netlify to this repository and production branch. The included `netlify.toml` sets `npm run build` and `dist`.
2. Enable Identity, set registration to **Invite only**, and enable **Identity → Services → Git Gateway**. The owner has completed these settings.
3. Deploy these changes before inviting editors. The CMS loads Netlify's Identity widget. Public pages forward invitation, confirmation, and password-recovery links to `/admin/`, keeping their tokens in the URL fragment. Default Netlify email templates can stay unchanged.
4. Under **Identity → Users → Invite users**, invite the editor's email address. They accept the invitation and set their own password. Resend expired invitations from Netlify. Forgotten passwords can be reset from the CMS login screen.
5. Open `/admin/`, sign in, publish a small text change, and verify the Git commit and successful Netlify deployment. Restore the text if it was only a test. The production branch must permit Git Gateway's commits.

No GitHub OAuth app or editor repository invitation is needed. See [Decap's Identity integration](https://decapcms.org/docs/choosing-a-backend/). [Git Gateway is deprecated](https://docs.netlify.com/manage/security/secure-access-to-sites/git-gateway/); this setup uses the service the owner has chosen and enabled.

## Local editing

In two terminals, run:

```sh
npm run dev
npm run cms
```

Visit `http://localhost:4321/admin/`. Decap detects its local proxy and reads/writes the local content files without an Identity login. The proxy's first run downloads the pinned `decap-server` package. Keep the proxy local to your machine. Local saves change files; they do not push Git commits or deploy Netlify.

## Files and checks

Content lives in `src/content/site/*.json`. The templates import those files at build time. `public/admin/config.yml` uses JSON syntax (valid YAML) so its field definitions can be checked without another dependency. Uploaded images are saved under `public/uploads/`.

Run `npm run build`, `npm run check:cms`, and `npm run check:seo`. Existing route names, internal link targets, accessibility attributes, and decorative icons are maintained in code. Fixed card/menu slots keep their existing destinations; FAQs and appointment steps are repeatable.

The displayed medical update date and source names are editable with each treatment page. Changing text does not imply medical approval; an actual medical review remains a separate process. Structured contact data uses the same source as the visible contact section. Free-form office hours are deliberately not translated into machine-readable opening times, to avoid stale or incorrect hours.
