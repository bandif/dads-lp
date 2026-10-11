// Default Netlify emails link to the homepage. Keep their tokens in the
// browser's fragment and let the CMS Identity widget complete the flow.
(() => {
  const params = new URLSearchParams(window.location.hash.slice(1));
  const tokens = ['invite_token', 'recovery_token', 'confirmation_token', 'email_change_token', 'access_token'];
  if (tokens.some(key => params.get(key))) {
    window.location.replace('/admin/' + window.location.hash);
  }
})();
