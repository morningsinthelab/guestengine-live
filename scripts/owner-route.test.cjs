const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { ownerDestination, publicDestination, canonicalUrl } = require('../profile/owner-route.js');

test('ordinary public profile visits have no owner intent', () => {
  assert.equal(ownerDestination({ pathname: '/profile/david-frangioni', search: '?ref=share', hash: '#story' }, false), null);
});

test('audit and JWT handoffs preserve fragments only on the same origin', () => {
  const hash = '#audit&t=header.payload.signature'; // Synthetic, not a real credential.
  assert.equal(ownerDestination({ pathname: '/profile/david-frangioni/', search: '?ref=email', hash }, false),
    '/manage/profile/david-frangioni?ref=email' + hash);
  assert.equal(ownerDestination({ pathname: '/profile/ej-snyder', hash: '#audit' }, false), '/manage/profile/ej-snyder#audit');
});

test('checkout returns and returning guest sessions reach their management page', () => {
  for (const value of ['activated', 'cancelled']) {
    assert.equal(ownerDestination({ pathname: '/profile/david-frangioni', search: '?vip=' + value, hash: '#audit' }, false),
      '/manage/profile/david-frangioni?vip=' + value + '#audit');
  }
  assert.equal(ownerDestination({ pathname: '/profile/ej-snyder' }, true), '/manage/profile/ej-snyder#audit');
  assert.equal(ownerDestination({ pathname: '/profile/ej-snyder', search: '?vip=activated' }, true), '/manage/profile/ej-snyder?vip=activated');
});

test('management, export, and malformed paths cannot loop or create an external redirect', () => {
  for (const pathname of ['/manage/profile/ej-snyder', '/profile/ej-snyder.json', '/profile/ej-snyder/transcript/',
    '/profile//evil.example', '/profile/%2f%2fevil.example', '/pricing/', '/join/']) {
    assert.equal(ownerDestination({ pathname, hash: '#audit' }, true), null);
  }
});

test('blocked storage does not interrupt the page or a valid audit handoff', () => {
  const source = fs.readFileSync(require.resolve('../profile/owner-route.js'), 'utf8');
  let replacement;
  const window = { document: {}, location: { pathname: '/profile/ej-snyder', hash: '#audit', replace: value => { replacement = value; } },
    get sessionStorage() { throw Error('blocked'); }, get localStorage() { throw Error('blocked'); } };
  vm.runInNewContext(source, { window, URLSearchParams });
  assert.equal(replacement, '/manage/profile/ej-snyder#audit');
});

test('management documents are not indexed and can use an existing local session', () => {
  const source = fs.readFileSync(require.resolve('../profile/owner-route.js'), 'utf8');
  let robots;
  const window = { document: { querySelector: selector => selector === 'meta[name="robots"]' ? { setAttribute: (_key, value) => { robots = value; } } : null },
    location: { pathname: '/manage/profile/ej-snyder', replace: () => assert.fail('redirect loop') },
    sessionStorage: { getItem: () => null }, localStorage: { getItem: () => 'synthetic-session' } };
  vm.runInNewContext(source, { window, URLSearchParams });
  assert.equal(robots, 'noindex, nofollow');
});

test('public visits use the exact approved canonical URL and discard query data and fragments', () => {
  const canonical = 'https://mornings.network/shows/center-stage/guests/aj-zeglen';
  assert.equal(publicDestination({ pathname: '/profile/aj-zagglin/', search: '?ref=share&token=private', hash: '#story' }, false, canonical), canonical);
  for (const location of [
    { pathname: '/profile/aj-zagglin', hash: '#audit&t=header.payload.signature' },
    { pathname: '/profile/aj-zagglin', search: '?vip=activated' },
    { pathname: '/manage/profile/aj-zagglin' },
  ]) assert.equal(publicDestination(location, false, canonical), null);
  assert.equal(publicDestination({ pathname: '/profile/aj-zagglin' }, true, canonical), null);
});

test('missing mappings and arbitrary destinations cannot create cross-origin redirects', () => {
  for (const value of [null, '', '__GUEST_CANONICAL_URL__', 'https://evil.example/person',
    'https://mornings.network.evil.example/shows/center-stage/guests/aj-zeglen',
    'https://mornings.network/shows/center-stage/guests/../private',
    'https://mornings.network/shows/center-stage/guests/aj-zeglen?token=private']) {
    assert.equal(canonicalUrl(value), null);
    assert.equal(publicDestination({ pathname: '/profile/aj-zagglin' }, false, value), null);
  }
});

test('anonymous browser bridge redirects before loading the owner application', () => {
  const source = fs.readFileSync(require.resolve('../profile/owner-route.js'), 'utf8');
  const canonical = 'https://mornings.network/shows/center-stage/guests/david-frangioni';
  let replacement;
  const window = { document: { querySelector: () => ({ getAttribute: () => canonical }) },
    location: { pathname: '/profile/david-frangioni', search: '?ref=email', hash: '#story', replace: value => { replacement = value; } },
    sessionStorage: { getItem: () => null }, localStorage: { getItem: () => null } };
  vm.runInNewContext(source, { window, URLSearchParams });
  assert.equal(replacement, canonical);
  assert.equal(window.GuestEnginePublicUrl, canonical);
});

test('the nginx map exactly matches all reviewed aliases and canonical destinations', () => {
  const routes = JSON.parse(fs.readFileSync(require.resolve('../docs/legacy-guest-urls.json'), 'utf8'));
  const config = fs.readFileSync(require.resolve('../nginx/guest-canonical.map'), 'utf8');
  const entries = [...config.matchAll(/^"([a-zA-Z0-9_-]+)" "([^"]+)";$/gm)];
  assert.equal(entries.length, 248);
  assert.equal(new Set(entries.map(entry => entry[1])).size, 248);
  assert.equal(new Set(entries.map(entry => entry[2])).size, 245);
  assert.deepEqual(entries.map(entry => ({ from: 'https://guestengine.live/profile/' + entry[1], to: entry[2] })), routes);
  for (const entry of entries) assert.equal(canonicalUrl(entry[2]), entry[2]);
});
