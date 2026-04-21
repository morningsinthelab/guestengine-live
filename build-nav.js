#!/usr/bin/env node
// ============================================================
// build-nav.js — Single source of truth for site-wide nav HTML
// ============================================================
// Run: node build-nav.js
//
// Stamps the shared nav (header + mobile overlay) into every
// HTML page. Edit the nav ONLY in this file, then re-run.
//
// Three link-prefix variants:
//   homepage  — anchor links without leading slash (#pricing)
//   subpage   — root-relative anchors (/#pricing)
//   directory — absolute URLs (https://guestengine.live/...)
// ============================================================

const fs = require('fs');
const path = require('path');

// -- NAV LINK DEFINITIONS (single source of truth) -----------

const NAV_LINKS = [
  { href: '/directory/',   label: 'Directory' },
  { href: '/marketplace/', label: 'Marketplace' },
  { href: '/shows/',       label: 'Shows' },
  { href: '#pricing',      label: 'Pricing',  isAnchor: true },
  { href: '#network',      label: 'Network',  isAnchor: true },
  { href: '/signal/',      label: 'Signal' },
  { href: '/why/',         label: 'Why' },
  { href: '/join/',        label: 'Join' },
];

const LOGIN_URL = 'https://app.conversationos.live/portal/login';
const SIGNUP_PATH = '/join/';
const SITE_ORIGIN = 'https://guestengine.live';

// -- LINK-PREFIX VARIANTS ------------------------------------

function resolveHref(link, variant) {
  if (variant === 'directory') {
    // directory/index.html uses absolute URLs for everything
    // except the Directory link itself (stays root-relative)
    if (link.href === '/directory/') return link.href;
    if (link.isAnchor) return SITE_ORIGIN + '/' + link.href;
    return SITE_ORIGIN + link.href;
  }
  if (variant === 'homepage') {
    // Homepage uses bare anchors (#pricing) — no leading /
    return link.href; // already correct as-is
  }
  // subpage: anchors get leading / (/#pricing)
  if (link.isAnchor) return '/' + link.href;
  return link.href;
}

function resolveSignupHref(variant) {
  if (variant === 'directory') return SITE_ORIGIN + SIGNUP_PATH;
  return SIGNUP_PATH;
}

// -- HTML GENERATORS -----------------------------------------

function buildHeader(variant) {
  const navLinks = NAV_LINKS
    .map(l => `      <a href="${resolveHref(l, variant)}">${l.label}</a>`)
    .join('\n');

  return `  <header class="ge-header" id="geHeader">
    <a href="/" class="ge-header__logo">
      <img src="/assets/c-icon.png" alt="" class="ge-header__logo-icon"><div class="ge-header__logo-text"><span class="ge-header__logo-cos">ConversationOS</span><div class="ge-header__logo-ge"><span class="ge-header__logo-guest">Guest</span><span class="ge-header__logo-engine">Engine</span></div></div>
    </a>
    <nav class="ge-header__nav" id="geNav">
${navLinks}
    </nav>
    <div class="ge-header__actions">
      <a href="${LOGIN_URL}" class="ge-header__login">Log In</a>
      <a href="${resolveSignupHref(variant)}" class="ge-header__signup">Sign Up</a>
    </div>
    <button class="ge-header__hamburger" id="geHamburger" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </button>
  </header>`;
}

function buildMobileOverlay(variant) {
  const navLinks = NAV_LINKS
    .map(l => `    <a href="${resolveHref(l, variant)}">${l.label}</a>`)
    .join('\n');

  return `  <div class="ge-header__mobile-overlay" id="geMobileMenu">
${navLinks}
    <a href="${LOGIN_URL}" class="ge-header__login">Log In</a>
    <a href="${resolveSignupHref(variant)}" class="ge-header__signup">Sign Up</a>
  </div>
`;
}

function buildFullNav(variant) {
  return buildHeader(variant) + '\n' + buildMobileOverlay(variant);
}

// -- FILE LIST & VARIANT MAP ---------------------------------

// All HTML pages in the site
const ALL_PAGES = [
  'index.html',
  'attorneys/index.html',
  'authors/index.html',
  'coaches/index.html',
  'consultants/index.html',
  'corporate-executives/index.html',
  'directory/index.html',
  'directory/index-mockup.html',
  'financial-advisors/index.html',
  'founders/index.html',
  'guides/author-podcast-booking/index.html',
  'guides/coach-visibility/index.html',
  'guides/consultant-inbound/index.html',
  'guides/founder-personal-brand/index.html',
  'guides/podcast-growth/index.html',
  'guides/real-estate-authority/index.html',
  'health-wellness/index.html',
  'join/index.html',
  'marketplace/index.html',
  'nonprofit-leaders/index.html',
  'podcasters/index.html',
  'profile/index.html',
  'profile/sample/index.html',
  'realestate/index.html',
  'shows/index.html',
  'signal/index.html',
  'therapists/index.html',
  'why/index.html',
];

function getVariant(file) {
  if (file === 'index.html') return 'homepage';
  if (file === 'directory/index.html') return 'directory';
  return 'subpage';
}

// -- REPLACEMENT REGEX ----------------------------------------
// Matches the full nav block: <header> + <div mobile overlay>
const NAV_REGEX = /  <header class="ge-header" id="geHeader">[\s\S]*?<\/header>\n  <div class="ge-header__mobile-overlay" id="geMobileMenu">[\s\S]*?<\/div>\n/;

// -- MAIN -----------------------------------------------------

let updated = 0;
let errors = 0;

ALL_PAGES.forEach(file => {
  const filePath = path.join(__dirname, file);

  if (!fs.existsSync(filePath)) {
    console.error(`SKIP (not found): ${file}`);
    errors++;
    return;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  const variant = getVariant(file);
  const newNav = buildFullNav(variant);

  if (!NAV_REGEX.test(html)) {
    console.error(`SKIP (no nav match): ${file}`);
    errors++;
    return;
  }

  const result = html.replace(NAV_REGEX, newNav);
  fs.writeFileSync(filePath, result, 'utf8');
  updated++;
  console.log(`✓ ${file} (${variant})`);
});

console.log(`\nDone — ${updated} files updated, ${errors} errors.`);

if (errors > 0) {
  process.exit(1);
}
