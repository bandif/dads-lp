import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../public/analytics.js', import.meta.url), 'utf8');
function browser(saved = null, blockedStorage = false) {
  const handlers = {};
  const scripts = [];
  let opened = false;
  let reloaded = false;
  const dialog = { showModal() { opened = true; }, close() { opened = false; } };
  class Element {
    constructor(href) { this.href = href; Object.assign(this, { hash: '', origin: 'https://fitymaszukulet.hu', pathname: '/' }); }
    closest() { return this; }
    getAttribute() { return this.href; }
  }
  const window = {};
  const context = {
    window, Element,
    location: { origin: 'https://fitymaszukulet.hu', hostname: 'fitymaszukulet.hu', pathname: '/', reload() { reloaded = true; } },
    localStorage: {
      getItem() { if (blockedStorage) throw Error(); return saved; },
      setItem(_, value) { if (blockedStorage) throw Error(); saved = value; },
    },
    document: {
      cookie: '_ga=example',
      getElementById(id) { return id === 'analytics-consent' ? dialog : { addEventListener(_, fn) { handlers[id] = fn; } }; },
      addEventListener(_, fn) { handlers.click = fn; },
      createElement() { return {}; },
      head: { appendChild(script) { scripts.push(script); } },
    },
  };
  runInNewContext(source, context);
  return { handlers, scripts, window, Element, opened: () => opened, reloaded: () => reloaded, saved: () => saved };
}

const fresh = browser();
assert.equal(fresh.opened(), true);
assert.equal(fresh.scripts.length, 0);
fresh.handlers.click({ target: new fresh.Element('tel:123') });
assert.equal(fresh.window.dataLayer, undefined);
fresh.handlers['analytics-reject']();
assert.equal(fresh.saved(), 'denied');
assert.equal(fresh.scripts.length, 0);
fresh.handlers['analytics-settings']();
fresh.handlers['analytics-accept']();
fresh.handlers['analytics-accept']();
assert.equal(fresh.scripts.length, 1);
assert.equal(fresh.scripts[0].src, 'https://www.googletagmanager.com/gtag/js?id=AW-1014492058');
const commands = fresh.window.dataLayer;
assert.equal(commands[0][2].ad_user_data, 'denied');
assert.equal(commands[1][2].analytics_storage, 'granted');
assert.equal(commands.filter(c => c[0] === 'config').length, 1);
assert.equal(commands.find(c => c[0] === 'config')[2].page_location, 'https://fitymaszukulet.hu/');
for (const href of ['tel:123', 'mailto:private@example.com', '#kapcsolat', '/other/']) {
  const link = new fresh.Element(href);
  if (href === '#kapcsolat') link.hash = href;
  fresh.handlers.click({ target: link });
}
assert.deepEqual(Array.from(commands.filter(c => c[0] === 'event'), c => c[1]), ['phone_click', 'email_click', 'contact_click']);
assert.ok(!JSON.stringify(commands).includes('private@example.com'));
fresh.handlers['analytics-reject']();
assert.equal(fresh.reloaded(), true);
assert.equal(fresh.saved(), 'denied');
const count = commands.length;
fresh.handlers.click({ target: new fresh.Element('tel:123') });
assert.equal(commands.length, count);
assert.equal(browser('denied').scripts.length, 0);
assert.equal(browser('granted').scripts.length, 1);
const blocked = browser(null, true);
assert.equal(blocked.scripts.length, 0);
blocked.handlers['analytics-accept']();
assert.equal(blocked.scripts.length, 1);
blocked.handlers['analytics-reject']();
assert.equal(blocked.reloaded(), true);
console.log('Analytics consent and contact-event checks passed.');
