/* Keep owner sessions and credential handoffs on Guest Engine during the public-site migration. */
(function (root) {
  'use strict';

  function ownerDestination(location, hasSession) {
    var match = /^\/profile\/([a-zA-Z0-9_-]+)\/?$/.exec(location.pathname);
    if (!match) return null;
    var hash = location.hash || '';
    var query = new URLSearchParams(location.search || '');
    var ownerIntent = /^#audit/i.test(hash) || /(?:^#|&)t=/.test(hash) || query.has('vip') || hasSession;
    if (hasSession && !hash && !query.has('vip')) hash = '#audit';
    // Routing intent is not authentication. The existing API still checks every owner request.
    return ownerIntent ? '/manage/profile/' + match[1] + (location.search || '') + hash : null;
  }

  function canonicalUrl(value) {
    return typeof value === 'string' && /^https:\/\/mornings\.network\/shows\/center-stage\/guests\/[a-zA-Z0-9_-]+$/.test(value) ? value : null;
  }

  function publicDestination(location, hasSession, canonical) {
    if (!/^\/profile\/[a-zA-Z0-9_-]+\/?$/.test(location.pathname) || ownerDestination(location, hasSession)) return null;
    // Deliberately omit all query data and fragments from cross-origin navigation.
    return canonicalUrl(canonical);
  }

  if (typeof module === 'object' && module.exports) module.exports = { ownerDestination: ownerDestination, publicDestination: publicDestination, canonicalUrl: canonicalUrl };
  if (!root || !root.document) return;

  var hasSession = false;
  try { hasSession = !!root.sessionStorage.getItem('cos_auth_token'); } catch (e) {}
  try { hasSession = hasSession || !!root.localStorage.getItem('cos_auth_token'); } catch (e) {}
  var canonicalMeta = root.document.querySelector && root.document.querySelector('meta[name="guest-public-url"]');
  var canonical = canonicalUrl(canonicalMeta && canonicalMeta.getAttribute('content'));
  if (canonical) root.GuestEnginePublicUrl = canonical;
  var destination = ownerDestination(root.location, hasSession);
  if (destination) {
    // Relative, same-origin navigation keeps JWT fragments off the public network domain.
    root.location.replace(destination);
  } else if (/^\/manage\/profile\/[a-zA-Z0-9_-]+\/?$/.test(root.location.pathname)) {
    var robots = root.document.querySelector('meta[name="robots"]');
    if (robots) robots.setAttribute('content', 'noindex, nofollow');
  } else {
    var publicUrl = publicDestination(root.location, hasSession, canonical);
    if (publicUrl) root.location.replace(publicUrl);
  }
})(typeof window !== 'undefined' ? window : null);
