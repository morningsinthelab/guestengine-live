/**
 * Golden Footer Unification Script
 * Replaces ALL footers across guestengine.live with a single canonical footer
 * Run: node footer-unify.js
 */

const fs = require('fs');
const path = require('path');

// ─── The Golden Footer HTML ───
const GOLDEN_FOOTER = `  <!-- FOOTER -->
  <footer class="footer" role="contentinfo" aria-label="Site footer" itemscope itemtype="https://schema.org/WPFooter">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <a href="/" class="nav__logo" aria-label="Guest Engine home">
            <svg class="nav__logo-icon" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="36" height="36" rx="6" fill="#fbbf24"/>
              <text x="8" y="26" font-family="Syncopate, sans-serif" font-weight="700" font-size="22" fill="#020617">G</text>
            </svg>
            <span class="nav__wordmark">Guest<strong>ENGINE</strong></span>
          </a>
          <p class="footer__tagline">The live conversation platform where we set the stage, set the conversation, and set you up &mdash; powered by <a href="https://conversationos.live" target="_blank" rel="noopener">ConversationOS</a>.</p>
          <p class="footer__founder">ABOUT THE FOUNDER</p>
          <p class="footer__founder-text">Founded by <a href="https://keithbilous.com" target="_blank" rel="noopener">Keith Bilous</a>, creator of the MiTL morning format and the ConversationOS production system.</p>
          <div class="footer__social">
            <a href="https://youtube.com/@morningsinthelab" target="_blank" rel="noopener" aria-label="YouTube" class="footer__social-link">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="https://linkedin.com/in/keithbilous" target="_blank" rel="noopener" aria-label="LinkedIn" class="footer__social-link">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://x.com/keithbilous" target="_blank" rel="noopener" aria-label="X (Twitter)" class="footer__social-link">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>
        <div class="footer__col">
          <h4 class="footer__heading">Guest Engine</h4>
          <a href="/authors/" class="footer__link">Authors &amp; Speakers</a>
          <a href="/coaches/" class="footer__link">Coaches &amp; Mentors</a>
          <a href="/founders/" class="footer__link">Founders</a>
          <a href="/realestate/" class="footer__link">Real Estate</a>
          <a href="/podcasters/" class="footer__link">Podcasters</a>
          <a href="/consultants/" class="footer__link">Consultants</a>
          <a href="/therapists/" class="footer__link">Therapists</a>
          <a href="/financial-advisors/" class="footer__link">Financial Advisors</a>
          <a href="/attorneys/" class="footer__link">Attorneys</a>
          <a href="/health-wellness/" class="footer__link">Health &amp; Wellness</a>
          <a href="/nonprofit-leaders/" class="footer__link">Nonprofit Leaders</a>
          <a href="/corporate-executives/" class="footer__link">Corporate Executives</a>
          <a href="/why/" class="footer__link footer__link--accent">Why Guest Engine</a>
          <a href="/signal/" class="footer__link footer__link--accent">Free Signal Report</a>
        </div>
        <div class="footer__col">
          <h4 class="footer__heading">Network Shows</h4>
          <a href="https://mornings.live" class="footer__link" target="_blank" rel="noopener">Mornings in the Lab</a>
          <span class="footer__link footer__link--upcoming">It Starts with Joy LIVE</span>
          <span class="footer__link footer__link--upcoming">The Jason Hewlett Show</span>
          <span class="footer__link footer__link--upcoming">Kindness Rising</span>
        </div>
        <div class="footer__col">
          <h4 class="footer__heading">MiTL Ecosystem</h4>
          <a href="https://mitl.studio" class="footer__link" target="_blank" rel="noopener">MiTL Studio</a>
          <a href="https://mornings.live" class="footer__link" target="_blank" rel="noopener">mornings.live</a>
          <a href="https://keithbilous.com" class="footer__link" target="_blank" rel="noopener">keithbilous.com</a>
          <a href="https://conversationos.live" class="footer__link" target="_blank" rel="noopener">ConversationOS</a>
          <a href="https://app.conversationos.live" class="footer__link" target="_blank" rel="noopener">Guest Engine App</a>
          <a href="https://clips.conversationos.live" class="footer__link" target="_blank" rel="noopener">ClipENGINE</a>
          <a href="https://production.mitl.studio" class="footer__link" target="_blank" rel="noopener">Production</a>
          <a href="https://thisis.mitl.studio" class="footer__link" target="_blank" rel="noopener">thisis.mitl.studio</a>
        </div>
      </div>
      <div class="footer__bottom">
        <p>&copy; 2026 GUEST ENGINE. CREATED BY <a href="https://keithbilous.com" target="_blank" rel="noopener">KEITH BILOUS</a>. AI-POWERED MATCHING. HUMAN-LED PRODUCTION. &mdash; Powered by <a href="https://conversationos.live" target="_blank" rel="noopener">ConversationOS</a>, the production platform behind 1,000+ live episodes.</p>
      </div>
    </div>
  </footer>`;

// ─── New CSS additions for social icons, 4-col grid, accent links ───
const FOOTER_CSS_ADDITIONS = `
/* --- FOOTER SOCIAL ICONS --- */
.footer__social {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.25rem;
}
.footer__social-link {
  color: var(--text-muted);
  transition: color 0.2s var(--ease);
  display: flex;
  align-items: center;
}
.footer__social-link:hover { color: var(--gold); }

/* --- FOOTER ACCENT LINKS (Why, Signal) --- */
.footer__link--accent {
  color: var(--gold) !important;
  font-weight: 600;
  margin-top: 0.25rem;
}
.footer__link--accent:hover { opacity: 0.8; }

/* --- FOOTER UPCOMING SHOWS (unlinked) --- */
.footer__link--upcoming {
  color: var(--text-muted);
  opacity: 0.5;
  font-size: 0.8125rem;
  cursor: default;
}

/* --- FOOTER FOUNDER LINK --- */
.footer__founder-text a {
  color: var(--gold);
  transition: opacity 0.2s;
}
.footer__founder-text a:hover { opacity: 0.8; }

/* --- FOOTER TAGLINE LINK --- */
.footer__tagline a {
  color: var(--gold);
  transition: opacity 0.2s;
}
.footer__tagline a:hover { opacity: 0.8; }
`;

// ─── Find all HTML files ───
function findHtmlFiles(dir) {
  let results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.name === '.git' || item.name === 'node_modules') continue;
    if (item.isDirectory()) {
      results = results.concat(findHtmlFiles(fullPath));
    } else if (item.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

// ─── Replace footer in a file ───
function replaceFooter(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  
  // Match the footer block — could start with <!-- FOOTER --> or directly with <footer
  const footerRegex = /(\s*<!-- FOOTER -->\s*)?<footer[\s\S]*?<\/footer>/;
  const match = html.match(footerRegex);
  
  if (!match) {
    console.log(`  ⚠️  No footer found in ${filePath}`);
    return false;
  }
  
  html = html.replace(footerRegex, GOLDEN_FOOTER);
  fs.writeFileSync(filePath, html, 'utf8');
  return true;
}

// ─── Inject CSS additions into style.css ───
function updateStyleCSS() {
  const cssPath = path.join(__dirname, 'style.css');
  let css = fs.readFileSync(cssPath, 'utf8');
  
  if (css.includes('.footer__social')) {
    console.log('  ℹ️  Footer CSS additions already present in style.css');
    return;
  }
  
  // Insert before the scroll animations section
  css = css.replace(
    '/* --- SCROLL ANIMATIONS --- */',
    FOOTER_CSS_ADDITIONS + '\n/* --- SCROLL ANIMATIONS --- */'
  );
  
  // Update grid to 4 columns
  css = css.replace(
    'grid-template-columns: 2fr 1fr 1fr;',
    'grid-template-columns: 2fr 1fr 1fr 1fr;'
  );
  
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('  ✅ Updated style.css with social icons, accent links, 4-col grid');
}

// ─── Also inject CSS into pages that have inline <style> blocks ───
function injectInlineCSS(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  
  // Check if page has inline footer styles that override grid
  if (html.includes('.footer__grid') && html.includes('<style>')) {
    // Update inline 3-col grid to 4-col
    html = html.replace(
      /\.footer__grid\s*\{[^}]*grid-template-columns:\s*2fr 1fr 1fr;/g,
      (match) => match.replace('2fr 1fr 1fr', '2fr 1fr 1fr 1fr')
    );
    fs.writeFileSync(filePath, html, 'utf8');
    return true;
  }
  return false;
}

// ─── Main ───
console.log('🔧 Golden Footer Unification — guestengine.live\n');

const htmlFiles = findHtmlFiles(__dirname);
console.log(`Found ${htmlFiles.length} HTML files\n`);

let replaced = 0;
let failed = 0;

for (const file of htmlFiles) {
  const rel = path.relative(__dirname, file);
  const ok = replaceFooter(file);
  if (ok) {
    console.log(`  ✅ ${rel}`);
    replaced++;
    // Also check for inline style overrides
    injectInlineCSS(file);
  } else {
    failed++;
  }
}

// Update the shared stylesheet
updateStyleCSS();

console.log(`\n✅ Done: ${replaced} footers replaced, ${failed} skipped`);
console.log('   All pages now use the canonical golden footer');
