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

  if (typeof module === 'object' && module.exports) module.exports = { ownerDestination: ownerDestination };
  if (!root || !root.document) return;

  var hasSession = false;
  try { hasSession = !!root.sessionStorage.getItem('cos_auth_token'); } catch (e) {}
  try { hasSession = hasSession || !!root.localStorage.getItem('cos_auth_token'); } catch (e) {}
  var destination = ownerDestination(root.location, hasSession);
  if (destination) {
    // Relative, same-origin navigation keeps JWT fragments off the public network domain.
    root.location.replace(destination);
  } else if (/^\/manage\/profile\/[a-zA-Z0-9_-]+\/?$/.test(root.location.pathname)) {
    var robots = root.document.querySelector('meta[name="robots"]');
    if (robots) robots.setAttribute('content', 'noindex, nofollow');
  }
})(typeof window !== 'undefined' ? window : null);
