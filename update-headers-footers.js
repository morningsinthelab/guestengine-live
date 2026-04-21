const fs = require('fs');
const path = require('path');

// Files to update
const files = [
  'index.html',
  'authors/index.html',
  'coaches/index.html',
  'founders/index.html',
  'realestate/index.html',
  'podcasters/index.html',
  'consultants/index.html'
];

const baseDir = '/home/user/workspace/guestengine-live';

// Determine prefix based on whether file is in subdirectory
function getPrefix(file) {
  return file.includes('/') ? '../' : '';
}

// New nav for homepage
function getHomepageNav() {
  return `  <nav class="nav" id="nav">
    <div class="nav__inner">
      <a href="/" class="nav__logo" aria-label="Guest Engine home">
        <svg class="nav__logo-icon" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="36" height="36" rx="6" fill="#fbbf24"/>
          <text x="8" y="26" font-family="Syncopate, sans-serif" font-weight="700" font-size="22" fill="#020617">G</text>
        </svg>
        <span class="nav__wordmark">Guest<strong>ENGINE</strong></span>
      </a>
      <div class="nav__links" id="navLinks">
        <a href="#for-guests" class="nav__link">FOR GUESTS</a>
        <a href="#for-hosts" class="nav__link">FOR HOSTS</a>
        <a href="#how-it-works" class="nav__link">HOW IT WORKS</a>
        <a href="#network" class="nav__link">NETWORK</a>
      </div>
      <div class="nav__actions">
        <a href="https://app.conversationos.live/portal/login" class="nav__link nav__link--login">LOG IN</a>
        <a href="/join/" class="btn btn--primary btn--sm">GET STARTED</a>
      </div>
      <button class="nav__hamburger" id="navToggle" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>`;
}

// New nav for vertical pages
function getVerticalNav() {
  return `  <nav class="nav" id="nav">
    <div class="nav__inner">
      <a href="/" class="nav__logo" aria-label="Guest Engine home">
        <svg class="nav__logo-icon" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="36" height="36" rx="6" fill="#fbbf24"/>
          <text x="8" y="26" font-family="Syncopate, sans-serif" font-weight="700" font-size="22" fill="#020617">G</text>
        </svg>
        <span class="nav__wordmark">Guest<strong>ENGINE</strong></span>
      </a>
      <div class="nav__links" id="navLinks">
        <a href="/#for-guests" class="nav__link">FOR GUESTS</a>
        <a href="/#for-hosts" class="nav__link">FOR HOSTS</a>
        <a href="/#how-it-works" class="nav__link">HOW IT WORKS</a>
        <a href="/#network" class="nav__link">NETWORK</a>
      </div>
      <div class="nav__actions">
        <a href="https://app.conversationos.live/portal/login" class="nav__link nav__link--login">LOG IN</a>
        <a href="/join/" class="btn btn--primary btn--sm">GET STARTED</a>
      </div>
      <button class="nav__hamburger" id="navToggle" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>`;
}

// New unified footer — follows mitl.studio/mornings.live patterns:
// - "ABOUT THE FOUNDER" section like mitl.studio
// - MITL NETWORK column with family cross-links like mornings.live
// - "Created by Keith Bilous" in copyright like all family sites
// - Identity statement like mitl.studio's "AI-POWERED SYSTEMS. HUMAN-LED PRODUCTION."
function getFooter(prefix) {
  return `  <footer class="footer">
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
          <p class="footer__tagline">The guest placement platform where you leave with content, not just a calendar invite. Powered by the MITL Live Network.</p>
          <p class="footer__founder">ABOUT THE FOUNDER</p>
          <p class="footer__founder-text">Founded by Keith Bilous, creator of the MiTL morning format and the ConversationOS production system.</p>
        </div>
        <div class="footer__col">
          <h4 class="footer__heading">Guest Engine</h4>
          <a href="/authors/" class="footer__link">Authors &amp; Speakers</a>
          <a href="/coaches/" class="footer__link">Coaches &amp; Mentors</a>
          <a href="/founders/" class="footer__link">Founders</a>
          <a href="/realestate/" class="footer__link">Real Estate</a>
          <a href="/podcasters/" class="footer__link">Podcasters</a>
          <a href="/consultants/" class="footer__link">Consultants</a>
        </div>
        <div class="footer__col">
          <h4 class="footer__heading">MITL Network</h4>
          <a href="https://mitl.studio" class="footer__link" target="_blank" rel="noopener">MiTL Studio</a>
          <a href="https://mornings.live" class="footer__link" target="_blank" rel="noopener">Mornings in the Lab</a>
          <a href="https://keithbilous.com" class="footer__link" target="_blank" rel="noopener">Keith Bilous</a>
          <a href="https://production.mitl.studio" class="footer__link" target="_blank" rel="noopener">Production</a>
          <a href="https://conversationos.live" class="footer__link" target="_blank" rel="noopener">ConversationOS</a>
          <a href="https://app.conversationos.live" class="footer__link" target="_blank" rel="noopener">Guest Engine App</a>
        </div>
      </div>
      <div class="footer__bottom">
        <p>&copy; 2026 GUEST ENGINE. CREATED BY KEITH BILOUS. AI-POWERED MATCHING. HUMAN-LED PRODUCTION.</p>
      </div>
    </div>
  </footer>`;
}

// Process each file
files.forEach(file => {
  const filePath = path.join(baseDir, file);
  let html = fs.readFileSync(filePath, 'utf8');
  const prefix = getPrefix(file);
  const isHomepage = file === 'index.html';

  // Replace nav
  const navRegex = /  <nav class="nav"[\s\S]*?<\/nav>/;
  const newNav = isHomepage ? getHomepageNav() : getVerticalNav();
  html = html.replace(navRegex, newNav);

  // Replace footer
  const footerRegex = /  <footer class="footer">[\s\S]*?<\/footer>/;
  html = html.replace(footerRegex, getFooter(prefix));

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Updated: ${file}`);
});

console.log('\nAll files updated successfully.');
