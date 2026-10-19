import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const config = JSON.parse(readFileSync('public/admin/config.yml', 'utf8'));
assert.equal(config.backend.branch, 'main');
assert.equal(config.backend.name, 'git-gateway');
assert.ok(!('repo' in config.backend));
const normalize = value => value.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
  .replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
  .replace(/&#(?:39|x27);/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/\*\*/g, '').replace(/\*/g, '').replace(/\s+/g, '');
const htmlByRoute = Object.fromEntries(['index', 'dr-fekete-ferenc', 'fitymaszukulet', 'papulak', 'peniszgorbulet', 'koltsegek'].map(name => [name,
  readFileSync(name === 'index' ? 'dist/index.html' : `dist/${name}/index.html`, 'utf8')]));
let checked = 0;
function check(fields, data, path, html) {
  assert.deepEqual(Object.keys(data).sort(), fields.map(f => f.name).sort(), `${path}: content/schema mismatch`);
  for (const field of fields) {
    assert.ok(!/^(alt|seo|description|icon|href)$/.test(field.name), `${path}: technical field exposed`);
    const value = data[field.name];
    const key = `${path}.${field.name}`;
    if (field.widget === 'object') check(field.fields, value, key, html);
    else if (field.widget === 'list') {
      assert.ok(Array.isArray(value));
      if (field.min) assert.ok(value.length >= field.min);
      if (field.max) assert.ok(value.length <= field.max);
      for (const item of value) {
        if (field.fields) check(field.fields, item, key, html);
        else assert.ok(normalize(html).includes(normalize(item)), `${key}: missing list text in build`);
      }
    } else {
      assert.equal(typeof value, 'string', key);
      if (field.widget === 'image') {
        if (value.startsWith('/')) assert.ok(existsSync(`public${value}`), `${key}: missing image`);
        else assert.equal(new URL(value).protocol, 'https:', `${key}: expected an HTTPS image`);
        assert.ok(html.includes(`src="${value}"`), `${key}: image not connected`);
      } else if (field.widget === 'datetime' || field.name === 'url') {
        assert.ok(html.includes(value.replaceAll('&', '&amp;')), `${key}: missing date/source`);
      } else if (!(path.startsWith('MedicalEditorial') && field.name === 'text4')) {
        assert.ok(normalize(html).includes(normalize(value)), `${key}: text not rendered`);
      }
      checked++;
    }
  }
}
for (const collection of config.collections) {
  for (const entry of collection.files) {
    const data = JSON.parse(readFileSync(entry.file, 'utf8'));
    const html = collection.name === 'pages' ? htmlByRoute[entry.name]
      : entry.name === 'MedicalEditorial' ? htmlByRoute.fitymaszukulet : htmlByRoute.index;
    check(entry.fields, data, entry.name, html);
  }
}
const configured = config.collections.flatMap(c => c.files.map(f => f.file.split('/').at(-1))).sort();
assert.deepEqual(configured, readdirSync('src/content/site').sort());
assert.match(readFileSync('dist/admin/index.html', 'utf8'), /decap-cms@3\.16\.3/);
assert.match(readFileSync('dist/admin/index.html', 'utf8'), /noindex/);
assert.ok(existsSync('dist/admin/config.yml'));
const admin = readFileSync('dist/admin/index.html', 'utf8');
assert.ok(admin.indexOf('identity.netlify.com/v1/netlify-identity-widget.js') > -1);
assert.ok(admin.indexOf('netlify-identity-widget.js') < admin.indexOf('decap-cms@'));
const redirect = readFileSync('dist/identity-redirect.js', 'utf8');
for (const token of ['invite_token', 'recovery_token', 'confirmation_token', 'email_change_token', 'access_token']) {
  let destination;
  const hash = `#${token}=test%2Btoken&token_type=bearer`;
  runInNewContext(redirect, { URLSearchParams, window: { location: { hash, replace: value => { destination = value; } } } });
  assert.equal(destination, `/admin/${hash}`, `${token}: preserve callback fragment`);
}
for (const hash of ['', '#kapcsolat', '#gyakori-kerdesek', '#invite_token=', '#not_invite_token=test']) {
  runInNewContext(redirect, { URLSearchParams, window: { location: { hash, replace: () => assert.fail(`Unexpected redirect: ${hash}`) } } });
}
for (const html of Object.values(htmlByRoute)) assert.ok(html.includes('src="/identity-redirect.js"'));
console.log(`CMS checks passed: ${configured.length} entries, ${checked} fields, all content and image bindings, admin output.`);
