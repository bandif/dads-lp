# Editing the website

Open **https://fitymaszukulet.hu/admin/** and sign in with GitHub.

The editor is in Hungarian:

- **Főoldal**: opening section, treatment cards, reviews, introduction, benefits, appointment steps, and FAQs.
- **Aloldalak**: the doctor's profile and the three treatment pages, grouped by their visible sections.
- **Közös elemek**: contact details, header/menu, footer, contact section, and the information-page footnote.

Choose a section, change its text or select/upload an image, then publish. Publication commits the content to `main`; Netlify rebuilds the website. Wait for that deployment to finish before checking the public page. Phone/email/map links follow the contact details automatically. Existing image descriptions remain in the templates; the editor has no alt-text, SEO, CSS, or HTML fields.

## One-time production setup

The repository configuration is ready for `bandif/dads-lp`, branch `main`. Authentication must be configured in the site owner's accounts:

1. Connect the Netlify project to this repository and production branch. The included `netlify.toml` sets `npm run build` and `dist`.
2. In [GitHub OAuth Apps](https://github.com/settings/developers), register an application. Use `https://fitymaszukulet.hu` as the homepage and **`https://api.netlify.com/auth/done`** as the authorization callback URL.
3. In Netlify, open **Project configuration → Security → OAuth → Authentication Providers → Install Provider**. Select GitHub and save the application's Client ID and Client Secret there. Never put the secret in this repository or the CMS configuration.
4. Give the editor's GitHub account write access to `bandif/dads-lp`. Accept the repository invitation before logging into the CMS. The `main` branch must permit the editor's direct content commits.
5. Deploy these changes, open `/admin/`, sign in, publish a small text change, and verify the new Git commit and successful Netlify deployment. Then restore the text if it was only a test.

No Netlify Identity or Git Gateway setup is needed. GitHub OAuth uses Netlify's hosted authentication service. See [Decap's GitHub backend](https://decapcms.org/docs/github-backend/) and [Netlify's OAuth setup](https://docs.netlify.com/manage/security/secure-access-to-sites/oauth-provider-tokens/). [Git Gateway is deprecated](https://docs.netlify.com/manage/security/secure-access-to-sites/git-gateway/).

## Local editing

In two terminals, run:

```sh
npm run dev
npm run cms
```

Visit `http://localhost:4321/admin/`. Decap detects its local proxy and reads/writes the local content files without a GitHub login. The proxy's first run downloads the pinned `decap-server` package. Keep the proxy local to your machine. Local saves change files; they do not push Git commits or deploy Netlify.

## Files and checks

Content lives in `src/content/site/*.json`. The templates import those files at build time. `public/admin/config.yml` uses JSON syntax (valid YAML) so its field definitions can be checked without another dependency. Uploaded images are saved under `public/uploads/`.

Run `npm run build`, `npm run check:cms`, and `npm run check:seo`. Existing route names, internal link targets, accessibility attributes, and decorative icons are maintained in code. Fixed card/menu slots keep their existing destinations; FAQs and appointment steps are repeatable.

The displayed medical update date and source names are editable with each treatment page. Changing text does not imply medical approval; an actual medical review remains a separate process. Structured contact data uses the same source as the visible contact section. Free-form office hours are deliberately not translated into machine-readable opening times, to avoid stale or incorrect hours.
