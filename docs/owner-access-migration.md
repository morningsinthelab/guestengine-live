# Guest owner access during the mornings.network migration

The owner confirmed on November 1, 2026 that Guest Engine will retain guest sign-in, profile management, and VIP tools while public guest profiles move to mornings.network. ConversationOS stays the shared source of truth.

This change introduces `/manage/profile/:slug` as a stable Guest Engine management entry point. It serves the existing profile application, uses the existing API authorization checks, and returns `X-Robots-Tag: noindex, nofollow`. It does not change prices, subscriptions, checkout requests, owner permissions, or the database.

The legacy `/profile/:slug` route remains available. A same-origin browser bridge moves these owner flows to the management route:

- `#audit` deep links and token handoffs in the fragment;
- a previously stored `cos_auth_token` in session or local storage;
- `?vip=...` checkout returns, preserving the complete query and fragment.

Routing intent grants no permissions. A stale token still faces the existing API authentication checks. The bridge never reads a credential into a cross-origin URL, logs it, or forwards it to mornings.network. Blocked browser storage does not break audit links. The management route does not redirect again.

Audit deep links open after the profile finishes loading, including when its Signal Score is zero. The old three-second poll depended on a visible score card and could prevent these guests from reaching their sign-in tools.

The network uses the existing `/profile/:sourceSlug#audit` link for guest access, including the source identity aliases. That link works both before and after this change is deployed. Existing portal handoffs, old emails, and checkout callbacks do not need to be rewritten to ship this foundation.

## Public cutover is separate

This PR does not redirect ordinary public profile visits, the public directory, exports, or transcripts. Those destinations are prepared in mornings-network PR #80, stacked on design PR #79. Verify the canonical production pages before enabling public traffic changes.

When public profile forwarding is added, retain the browser bridge: nginx cannot see URL fragments or browser storage. Never replace `/profile/:slug` with a blanket HTTP redirect, which could carry a JWT fragment across origins or break guest login. Public-only directory and export paths can use permanent server redirects after their destination checks pass.

## Verification

Run `node --test scripts/owner-route.test.cjs` for anonymous visits, token/audit handoffs, sessions, checkout returns, invalid paths, blocked storage, and redirect loops. Run `node --check profile/owner-route.js` for syntax. Browser regression checks should use synthetic credentials and mocked API responses; no live purchase, owner action, or real credential is necessary.

Rollback: remove the owner-route script include to keep legacy profile handling in place. Leave the management alias available while links to it exist. No database rollback is needed.
