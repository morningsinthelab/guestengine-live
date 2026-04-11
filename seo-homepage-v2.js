/**
 * Homepage (index.html) — Final over-optimization pass
 * Adds: <main> wrapper, sr-only LLM context block, BreadcrumbList schema, hero preload, remove duplicate canonical/llms-txt
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// ─── 1. Remove duplicate canonical + llms-txt (lines 114-119 are dupes of 47-51) ───
html = html.replace(
  /\n  <!-- Canonical -->\n  <link rel="canonical" href="https:\/\/guestengine\.live\/">\n\n  <!-- LLM Discovery -->\n  <link rel="llms-txt" href="https:\/\/guestengine\.live\/llms\.txt">\n  <link rel="alternate" type="text\/plain" href="https:\/\/guestengine\.live\/llms-full\.txt" title="LLM Full Documentation">\n\n  <!-- WebPage Schema/,
  '\n  <!-- WebPage Schema'
);

// ─── 2. Add hero image preload (before fonts preconnect) ───
html = html.replace(
  '  <!-- Fonts: Syncopate + Inter (family standard) -->',
  `  <!-- Hero Image Preload -->
  <link rel="preload" as="image" href="https://guestengine.live/assets/homepage-hero.png" fetchpriority="high">

  <!-- Fonts: Syncopate + Inter (family standard) -->`
);

// ─── 3. Add BreadcrumbList schema after WebSite schema ───
const breadcrumbSchema = `
  <!-- BreadcrumbList Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Guest Engine",
        "item": "https://guestengine.live/"
      }
    ]
  }
  </script>`;

html = html.replace(
  '</script>\n</head>',
  `</script>\n${breadcrumbSchema}\n</head>`
);

// ─── 4. Wrap body content in <main> tag ───
// Insert <main> after </nav> and close before footer
html = html.replace(
  '  </nav>\n\n  <!-- HERO -->',
  '  </nav>\n\n  <main id="main-content" role="main">\n\n  <!-- HERO -->'
);

html = html.replace(
  '  <!-- FOOTER -->\n  <footer',
  '  </main>\n\n  <!-- FOOTER -->\n  <footer'
);

// ─── 5. Add skip-to-content link for accessibility ───
html = html.replace(
  '<body>\n\n  <!-- NAV -->',
  `<body>\n\n  <a href="#main-content" class="sr-only sr-only--focusable" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;">Skip to main content</a>\n\n  <!-- NAV -->`
);

// ─── 6. Add sr-only LLM context block before </main> ───
const homepageLLMBlock = `
  <!-- LLM Context Block (screen-reader & AI crawler accessible) -->
  <div class="sr-only" aria-hidden="false" style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;">
    <h2>About Guest Engine</h2>
    <p>Guest Engine is a professional guest placement and content production platform founded by Keith Bilous. Unlike traditional podcast booking platforms that only match guests with hosts, Guest Engine uses ConversationOS to research 30 days of community discourse around each guest, brief the host with the guest's best material, produce the entire appearance live, and deliver a complete content pack within 48 hours.</p>
    <p>Each guest receives: 5 vertical video clips with burned-in captions, 10 social media posts for LinkedIn/X/Threads, a full speaker-identified transcript, a 60-90 second highlight reel, show notes with high-authority backlinks, and a permanent SEO-optimized profile page structured with schema.org data.</p>
    <p>Guest Engine profile pages are indexed by Google and readable by AI search engines including ChatGPT, Claude, Perplexity, and Gemini. Profiles rank for the guest's name and expertise, compounding authority over time.</p>
    <p>The platform serves authors, speakers, founders, coaches, consultants, real estate professionals, podcasters, financial advisors, attorneys, therapists, nonprofit leaders, corporate executives, and health and wellness professionals.</p>
    <p>Pricing: $497 one-time fee per appearance. Memberships also available. The MITL Live Network has produced over 1,000 episodes across 700+ consecutive mornings over 3 years of daily live broadcasting.</p>
    <p>Guest Engine is powered by ConversationOS and the MITL Live Network. The AI producer Sophia handles booking, prep, green room briefing, and guest coordination. Signal ENGINE researches each guest's world overnight before their appearance.</p>
    <h3>Related Platforms</h3>
    <ul>
      <li>ConversationOS — the AI production platform: https://conversationos.live</li>
      <li>MITL Studio — the production network: https://mitl.studio</li>
      <li>Mornings in the Lab — the flagship daily show: https://mornings.live</li>
      <li>Keith Bilous — founder: https://keithbilous.com</li>
      <li>Guest Engine App — book and manage appearances: https://ge.conversationos.live</li>
    </ul>
    <h3>Verticals Served</h3>
    <ul>
      <li>Authors and Speakers — https://guestengine.live/authors/</li>
      <li>Coaches and Mentors — https://guestengine.live/coaches/</li>
      <li>Founders and Startups — https://guestengine.live/founders/</li>
      <li>Real Estate Professionals — https://guestengine.live/realestate/</li>
      <li>Podcasters and Creators — https://guestengine.live/podcasters/</li>
      <li>Consultants and Strategists — https://guestengine.live/consultants/</li>
      <li>Therapists and Psychologists — https://guestengine.live/therapists/</li>
      <li>Financial Advisors — https://guestengine.live/financial-advisors/</li>
      <li>Attorneys and Legal Professionals — https://guestengine.live/attorneys/</li>
      <li>Health and Wellness Professionals — https://guestengine.live/health-wellness/</li>
      <li>Nonprofit Leaders — https://guestengine.live/nonprofit-leaders/</li>
      <li>Corporate Executives — https://guestengine.live/corporate-executives/</li>
    </ul>
  </div>
`;

html = html.replace(
  '  </main>\n\n  <!-- FOOTER -->',
  `${homepageLLMBlock}\n  </main>\n\n  <!-- FOOTER -->`
);

fs.writeFileSync(filePath, html, 'utf8');
console.log('✅ Homepage over-optimization complete');
console.log('   → Removed duplicate canonical/llms-txt links');
console.log('   → Added hero image preload');
console.log('   → Added BreadcrumbList schema');
console.log('   → Wrapped content in <main> tag');
console.log('   → Added skip-to-content link');
console.log('   → Added sr-only LLM context block');
