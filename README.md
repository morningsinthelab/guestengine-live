# GuestEngine — Public Site

**Production URL:** [guestengine.live](https://guestengine.live)

---

## The Product (canonical)

> **GuestEngine is the operating system for becoming the AI-discoverable authority on a subject. You come on the show. We measure where you start on the four pillars of authority — Expertise, Experience, Authoritativeness, Trustworthiness. Then we run a stack of activities designed to make you the answer when an LLM is asked who the authority is on your topic. The Signal Score is the receipt. The LLM answer is the proof.**

This is the keystone product narrative. Every page in this repo — every line of copy, every pricing tier, every CTA — derives from it.

**Canonical product docs (in the `conversationos` repo):**

- **[Product Narrative v1](https://github.com/morningsinthelab/conversationos/blob/main/docs/product/Product-Narrative-v1.md)** — the full product definition: subject contract, four pillars (E-E-A-T), atomic activity unit, triggering event, LLM-discoverability lens, quarterly LLM probe, authority graduation arc, Authority Guarantee, forbidden patterns.
- **[Activity × Pillar × LLM-Surface Matrix v1](https://github.com/morningsinthelab/conversationos/blob/main/docs/product/Activity-Matrix-v1.md)** — the engineering spec: 25 activities scored across all four pillars with LLM-surface tags.

**Rule:** if a page in this repo disagrees with the Product Narrative, the Product Narrative wins. Update the page.

---

## What This Repo Is

The public-facing marketing site for GuestEngine — the guest authority product built on top of ConversationOS. Static HTML, vanilla JS, served from Railway. Houses:

- **`index.html`** — home page
- **`pricing/`** — pricing tiers (currently mid-rewrite to v2: two tiers, Reach Pro killed)
- **`why/`** — the four-pillars + LLM-discoverability story
- **`signal/`** — Signal Score explainer
- **`tour/`** — product walkthrough
- **`join/`** — onboarding entry point
- **`directory/`** — public member directory
- **`profile/`** — per-customer Authority Pages (`profile/[slug]/`)
- **`shows/`** — network shows landing pages
- **Category landing pages** — `agencies/`, `attorneys/`, `authors/`, `coaches/`, `consultants/`, `corporate-executives/`, `creators/`, `ecommerce/`, `financial-advisors/`, `fitness/`, `founders/`, `guides/`, `health-wellness/`, `marketplace/`, `nonprofit-leaders/`, `podcasters/`, `realestate/`, `restaurants/`, `saas/`, `therapists/`

---

## The Forbidden Patterns (operating discipline)

From [Product Narrative §11](https://github.com/morningsinthelab/conversationos/blob/main/docs/product/Product-Narrative-v1.md). These patterns are banned from any page, copy, or CTA in this repo:

- **"Premium" anything without a definition** — premium relative to what?
- **"Priority" placebos** — calling something priority when work is already prioritized for everyone
- **Departments that don't exist** — "MitL ops" implies a team; there is no MitL ops
- **Community features for communities that haven't formed**
- **Feature bundles instead of outcome bundles** — every tier sells velocity toward the same outcome
- **The same product depowered as a "lower tier"**
- **Promising LLM outputs** — we promise inputs, we measure outputs, we never promise them

If a page violates one of these, file a PR to fix it.

---

## Customer Zero

**David Frangioni** is GuestEngine's Customer Zero (VIP tier, $297/mo).

- **Signed subject contract:** *"David Frangioni on AI in music production and the future of audio engineering."*
- **Authority Page:** [guestengine.live/profile/david-frangioni](https://guestengine.live/profile/david-frangioni)
- **Twin email (outbound only):** `davidvip@bapl.ai`
- **Twin Bible:** [docs/digital-twins/david-frangioni/Twin-Bible-v0.5.md](https://github.com/morningsinthelab/conversationos/blob/main/docs/digital-twins/david-frangioni/Twin-Bible-v0.5.md) (in conversationos repo)
- **First Weekly Signal Intelligence Report:** Monday 2026-05-18, 12:00 UTC

Every product decision is tested against David's experience first before it ships to the rest of the network.

---

## What's Shipping Next

In dependency order:

1. **Methodology page** (`/methodology`) — public trust artifact showing the full activity matrix, the math, the worked example, the Authority Guarantee, the FAQ in schema.org markup. The link target every other page will point to when explaining how scoring works.
2. **Pricing page v2** — two tiers (Member $97 + VIP $297, Reach Pro deleted), every line item tagged to a matrix row, Authority Guarantee section embedded, links to `/methodology`.
3. **`/why` page rewrite** — full E-E-A-T + LLM-discoverability story
4. **`/signal` page rewrite** — Signal Score explainer + LLM probe as the proof layer
5. **Authority Page schema.org Person + sameAs markup** — David's first, then template-ize for all profiles
6. **Open Graph preview generator** — subject sentence + current Signal Score on every profile share image
7. **Home page hero refresh** — one-sentence narrative as the headline

Each ships as `david-customer-zero/<artifact>`.

---

## Local Dev

```bash
# Static site — open any HTML file in a browser, or:
python3 -m http.server 8000
```

Deployment: Railway (see `railway.json`, `Dockerfile`).

---

## Related Repos

- **[`morningsinthelab/conversationos`](https://github.com/morningsinthelab/conversationos)** — the private engine: Signal Engine, Listening Engine, Digital Twin Engine, Sophia, Mack, all the AI infrastructure that powers what this site displays. **Canonical product docs live there.**
- **`morningsinthelab/character-engine`** — character/twin runtime
- **`morningsinthelab/conversationos-mcp`** — MCP server exposing engines to external agents
- **`morningsinthelab/mornings-network`** — show network metadata

---

## Agent Instructions

If you're an agent landing in this repo to make changes, read **[`CLAUDE.md`](./CLAUDE.md)** first. It defines the autonomous execution rules. Always load the Product Narrative before touching any guest-facing copy.
