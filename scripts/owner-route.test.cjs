const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { ownerDestination } = require('../profile/owner-route.js');

test('ordinary public profile visits do not move before the public cutover', () => {
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
  const window = { document: { querySelector: () => ({ setAttribute: (_key, value) => { robots = value; } }) },
    location: { pathname: '/manage/profile/ej-snyder', replace: () => assert.fail('redirect loop') },
    sessionStorage: { getItem: () => null }, localStorage: { getItem: () => 'synthetic-session' } };
  vm.runInNewContext(source, { window, URLSearchParams });
  assert.equal(robots, 'noindex, nofollow');
});
