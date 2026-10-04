import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const root = 'https://fitymaszukulet.hu';
const routes = ['/', '/dr-fekete-ferenc/', '/fitymaszukulet/', '/papulak/', '/peniszgorbulet/'];
const titles = new Set();
const descriptions = new Set();
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.deepEqual(locations.sort(), routes.map(route => root + route).sort());
assert.match(readFileSync('dist/robots.txt', 'utf8'), /Sitemap: https:\/\/fitymaszukulet\.hu\/sitemap\.xml/);

for (const route of routes) {
  const html = readFileSync(`dist${route}index.html`, 'utf8');
  assert.match(html, /<html lang="hu"/);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${route}: single H1`);
  assert.ok(html.includes(`rel="canonical" href="${root}${route}"`), `${route}: canonical`);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = html.match(/name="description" content="([^"]+)"/)?.[1];
  assert.ok(title && description);
  assert.ok(!titles.has(title) && !descriptions.has(description), `${route}: unique metadata`);
  titles.add(title); descriptions.add(description);

  const graph = JSON.parse(html.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)[1])['@graph'];
  const ids = new Set(graph.map(node => node['@id']));
  const doctor = graph.find(node => node['@type'] === 'Person');
  const practice = graph.find(node => node['@type'] === 'Physician');
  assert.equal(doctor['@id'], `${root}/dr-fekete-ferenc/#person`);
  assert.equal(doctor.url, `${root}/dr-fekete-ferenc/`);
  assert.equal(practice['@id'], `${root}/#practice`);
  assert.equal(practice.url, `${root}/`);
  assert.equal(practice.openingHoursSpecification.length, 2);
  const checkRefs = value => {
    if (!value || typeof value !== 'object') return;
    if (value['@id']) assert.ok(ids.has(value['@id']), `Unresolved schema reference: ${value['@id']}`);
    Object.values(value).forEach(checkRefs);
  };
  graph.forEach(checkRefs);
  const medical = graph.find(node => node['@type'] === 'MedicalWebPage');
  if (medical) {
    assert.ok(html.includes(`datetime="${medical.dateModified}"`));
    for (const url of medical.citation) assert.ok(html.includes(`href="${url}"`));
    if (medical.lastReviewed) assert.ok(html.includes(`datetime="${medical.lastReviewed}"`));
  }
  for (const match of html.matchAll(/href="(\/[^"?#]*)/g)) {
    const path = match[1];
    assert.ok(existsSync(`dist${path}`) || existsSync(`dist${path}/index.html`), `${route}: missing link ${path}`);
  }
}
console.log('SEO checks passed: five pages, sitemap, robots, metadata, schema references, dates, sources and internal links.');
