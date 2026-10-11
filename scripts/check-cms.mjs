import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';

const config = JSON.parse(readFileSync('public/admin/config.yml', 'utf8'));
assert.equal(config.backend.repo, 'bandif/dads-lp');
assert.equal(config.backend.branch, 'main');
assert.equal(config.backend.name, 'github');
const normalize = value => value.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
  .replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
  .replace(/&#(?:39|x27);/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/\*\*/g, '').replace(/\*/g, '').replace(/\s+/g, '');
const htmlByRoute = Object.fromEntries(['index', 'dr-fekete-ferenc', 'fitymaszukulet', 'papulak', 'peniszgorbulet'].map(name => [name,
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
console.log(`CMS checks passed: ${configured.length} entries, ${checked} fields, all content and image bindings, admin output.`);
