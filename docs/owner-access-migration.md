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

## Public cutover

The canonical audience site is live at mornings.network (network PRs #79–81). `docs/legacy-guest-urls.json` copies its reviewed 248-source-URL map, covering 245 unique guest pages and three identity aliases. `nginx/guest-canonical.map` is the corresponding nginx lookup; regression tests require the two files to match exactly. Add mappings only after verifying the canonical destination. Unmapped profiles retain their existing behavior; no new identity match is guessed.

- `/directory`, `/directory/all`, their trailing-slash forms, and their `index.html` forms return 301 to the canonical directory. Only `q`, `topic`, and recognized `segment` filters are forwarded. Other query data is dropped.
- Mapped `.md`, `.json`, and transcript paths return 301 to `/profile.md`, `/data.json`, and `/transcript` on the canonical guest page. These public-only redirects explicitly clear inherited URL fragments.
- Mapped HTML profiles return a small browser bridge with the exact canonical link in both the HTML and HTTP `Link` header. Anonymous visitors continue to mornings.network with no query or fragment data. Audit links, saved sessions, and checkout returns continue to `/manage/profile/:sourceSlug` on Guest Engine. JavaScript-disabled visitors get visible links to the canonical guest page and their Guest Engine login tools.
- Management routes remain unindexed and uncached, retain their original source identity for API authorization, and identify the Mornings URL in canonical/OG/structured-data metadata when a reviewed mapping exists.
- The Guest Engine sitemap no longer lists the retired directory. `llms.txt` points to the canonical guest directory and public exports. The export generator skips migrated guests rather than recreating competing public files.

Never replace the HTML bridge with a blanket HTTP redirect: nginx cannot see URL fragments or browser storage. That would break returning owner flows or carry a JWT fragment across origins. The bridge loads only its same-origin routing script before navigation. Public forwarding never carries credentials, query parameters, or fragments. Public fallback links also use a no-referrer policy.

## Verification

Run `node scripts/owner-route.test.cjs` for anonymous visits, token/audit handoffs, sessions, checkout returns, invalid paths, blocked storage, redirect loops, destination validation, and all reviewed mappings. Run `node --check profile/owner-route.js` and `node --check scripts/generate-agent-files.mjs` for syntax.

Build the Docker image, run `nginx -t`, and expose it on localhost port 3126. Then `python scripts/cutover-http.test.py` checks all 248 HTML bridges and 744 export redirects, directory filters, management metadata, unmapped profiles, and internal-route protection. Browser regression checks use synthetic credentials and mocked API responses for anonymous/alias visits, signed-out audit access, slow/zero-score profiles, token handoff, saved sessions, checkout returns, and JavaScript-disabled fallback. No live purchase, owner action, or real credential is necessary.

Deployment uses the repository's existing Railway production service, `guestengine-cx` in `skillful-reflection`. Confirm the exact merged commit succeeds in Railway's GitHub deployment status and verify representative anonymous public URLs and management responses after deployment.

Rollback: revert the public routing changes, including the directory/export locations and mapped HTML rewrite, while retaining the `/manage/profile/:slug` foundation for existing owner links. Removing only the JavaScript include would leave a fallback page rather than restore the old profile application. No database rollback is needed.
