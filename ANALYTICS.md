# Website analytics

The public website reuses Google tag `AW-1014492058` from the old WordPress site.
Its Analytics destination must already be connected in Google's tag settings;
the AW ID alone does not prove that GA4 is receiving events. No Google account
configuration is changed by this code.

The Hungarian consent dialog blocks the Google script until acceptance. Visitors
can reject or reopen settings at the bottom of every public page. Advertising
storage, advertising user data, personalization and Google signals stay disabled.
Revoking consent removes Analytics cookies and reloads the page without the tag.

Page views use Google's config command. Contact events are `phone_click`,
`email_click`, and `contact_click` (links to the current page's contact section).
They measure clicks, not completed calls, emails, or appointments. No contact
values or link text are included in these events. Page query strings, fragments
and referrer URLs are omitted from the explicit page configuration.

## Before and after deployment

1. In the existing Google tag settings, confirm that the intended GA4 property
   is connected as a destination. Disable enhanced measurement features that
   collect form, search or other visitor-entered information. This is a medical
   website: do not configure patient data, user IDs or advertising audiences.
2. Review the site's privacy information with the owner for this use of Analytics.
3. Deploy the website normally. No DNS changes are needed.
4. In a fresh browser session, check that rejecting consent makes no requests to
   googletagmanager.com or google-analytics.com. Accept and check that the tag loads.
5. Use Google Tag Assistant and the property's Realtime report to confirm page
   views and all three click events reach the correct property. A successful
   script download alone is not proof of collection. Mark phone/email clicks as
   key events in GA4 if desired; this code does not create Ads conversions.
6. Reject through the footer settings and confirm tracking stops after reload.

Run `node scripts/check-analytics.mjs` for the local consent/event checks and
`npm run build` for the Astro build. Account receipt requires the live checks above.
