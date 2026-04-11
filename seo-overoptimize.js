#!/usr/bin/env node
/**
 * SEO & LLM Over-Optimization Script
 * Injects into all 12 persona pages:
 * 1. Twitter Card meta tags
 * 2. OG:image meta
 * 3. Robots meta
 * 4. Additional meta (author, publisher, theme-color, format-detection)
 * 5. JSON-LD: WebPage, BreadcrumbList, Speakable
 * 6. Semantic HTML: <main>, aria-labels on sections
 * 7. Preload hero images, alt text on hero bg
 * 8. Updated sitemap lastmod dates
 * 9. Updated llms.txt with all 12 verticals
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://guestengine.live';

const personas = [
  {
    dir: 'authors',
    slug: 'authors',
    name: 'Authors & Speakers',
    shortName: 'Authors',
    keywords: 'guest engine for authors, author podcast appearances, book launch visibility, author SEO profile, generative engine optimization for authors, AI search author ranking, author media kit, speaker reel production, author personal brand, podcast booking for authors, author thought leadership, book marketing alternatives, author content production',
    heroAlt: 'Guest Engine for Authors — cinematic studio scene featuring MITL show characters discussing books and literary topics in a professional broadcast environment',
    speakableCSS: ['.hero__title', '.hero__sub', '.section__title', '.section__sub'],
    industry: 'Publishing & Speaking',
    audienceTypes: 'authors, speakers, thought leaders, writers, non-fiction authors, keynote speakers, book coaches, literary professionals'
  },
  {
    dir: 'coaches',
    slug: 'coaches',
    name: 'Coaches & Mentors',
    shortName: 'Coaches',
    keywords: 'guest engine for coaches, coaching visibility, coach content production, coach SEO profile, life coach marketing, business coach personal brand, coach media kit, coaching podcast appearances, AI search coach ranking, generative engine optimization for coaches, coaching authority building, coach video content, mentor thought leadership',
    heroAlt: 'Guest Engine for Coaches — cinematic studio scene featuring MITL show characters in a coaching and mentorship conversation setting',
    speakableCSS: ['.hero__title', '.hero__sub', '.section__title', '.section__sub'],
    industry: 'Coaching & Mentorship',
    audienceTypes: 'life coaches, business coaches, executive coaches, mentors, fitness coaches, mindset coaches, career coaches, leadership coaches'
  },
  {
    dir: 'founders',
    slug: 'founders',
    name: 'Founders & Entrepreneurs',
    shortName: 'Founders',
    keywords: 'guest engine for founders, founder personal brand, startup visibility, founder media appearances, entrepreneur content production, founder SEO profile, startup pitch clips, founder thought leadership, AI search founder ranking, generative engine optimization for founders, founder speaking opportunities, startup marketing',
    heroAlt: 'Guest Engine for Founders — cinematic studio scene featuring MITL show characters in an entrepreneurial and startup-focused broadcast environment',
    speakableCSS: ['.hero__title', '.hero__sub', '.section__title', '.section__sub'],
    industry: 'Startups & Entrepreneurship',
    audienceTypes: 'founders, entrepreneurs, startup CEOs, co-founders, serial entrepreneurs, solopreneurs, venture-backed founders'
  },
  {
    dir: 'realestate',
    slug: 'realestate',
    name: 'Real Estate Professionals',
    shortName: 'Real Estate',
    keywords: 'guest engine for real estate agents, real estate personal brand, realtor content production, real estate SEO profile, real estate market authority, agent media kit, real estate podcast appearances, AI search real estate ranking, generative engine optimization for realtors, real estate thought leadership, agent video marketing',
    heroAlt: 'Guest Engine for Real Estate — cinematic studio scene featuring MITL show characters discussing real estate markets and property insights in a professional broadcast setting',
    speakableCSS: ['.hero__title', '.hero__sub', '.section__title', '.section__sub'],
    industry: 'Real Estate',
    audienceTypes: 'real estate agents, realtors, brokers, property investors, real estate team leads, luxury agents, commercial real estate professionals'
  },
  {
    dir: 'podcasters',
    slug: 'podcasters',
    name: 'Podcasters & Creators',
    shortName: 'Podcasters',
    keywords: 'guest engine for podcasters, podcast cross-promotion, podcaster visibility, podcast growth, podcast SEO profile, podcaster content production, podcast guest booking platform, AI search podcast ranking, generative engine optimization for podcasters, podcast audience growth, podcast marketing',
    heroAlt: 'Guest Engine for Podcasters — cinematic studio scene featuring MITL show characters in a podcast recording environment with professional audio equipment',
    speakableCSS: ['.hero__title', '.hero__sub', '.section__title', '.section__sub'],
    industry: 'Podcasting & Media',
    audienceTypes: 'podcasters, podcast hosts, content creators, media producers, YouTube creators, audio creators'
  },
  {
    dir: 'consultants',
    slug: 'consultants',
    name: 'Consultants & Advisors',
    shortName: 'Consultants',
    keywords: 'guest engine for consultants, consultant personal brand, consulting thought leadership, consultant SEO profile, consultant content production, consulting media appearances, AI search consultant ranking, generative engine optimization for consultants, consultant authority building, consulting inbound marketing, consultant video content',
    heroAlt: 'Guest Engine for Consultants — cinematic studio scene featuring MITL show characters in a strategic consulting and advisory broadcast setting',
    speakableCSS: ['.hero__title', '.hero__sub', '.section__title', '.section__sub'],
    industry: 'Consulting & Advisory',
    audienceTypes: 'management consultants, strategy consultants, business advisors, independent consultants, consulting firm partners, fractional executives'
  },
  {
    dir: 'therapists',
    slug: 'therapists',
    name: 'Therapists & Counselors',
    shortName: 'Therapists',
    keywords: 'guest engine for therapists, therapist personal brand, mental health thought leadership, therapist SEO profile, therapist content production, therapist media appearances, AI search therapist ranking, generative engine optimization for therapists, therapist authority building, counselor visibility, therapy practice marketing',
    heroAlt: 'Guest Engine for Therapists — cinematic studio scene featuring MITL show characters in a warm, intimate therapeutic conversation setting',
    speakableCSS: ['.hero__title', '.hero__sub', '.section__title', '.section__sub'],
    industry: 'Mental Health & Therapy',
    audienceTypes: 'therapists, psychologists, counselors, licensed clinical social workers, marriage and family therapists, mental health practitioners, behavioral health professionals'
  },
  {
    dir: 'financial-advisors',
    slug: 'financial-advisors',
    name: 'Financial Advisors & Planners',
    shortName: 'Financial Advisors',
    keywords: 'guest engine for financial advisors, financial advisor personal brand, wealth management thought leadership, financial advisor SEO profile, financial advisor content production, financial advisor media appearances, AI search financial advisor ranking, generative engine optimization for financial advisors, financial planner authority building, CFP marketing',
    heroAlt: 'Guest Engine for Financial Advisors — cinematic studio scene featuring MITL show characters surrounded by financial data displays and market analysis',
    speakableCSS: ['.hero__title', '.hero__sub', '.section__title', '.section__sub'],
    industry: 'Financial Services & Planning',
    audienceTypes: 'financial advisors, certified financial planners, wealth managers, investment advisors, financial consultants, retirement planners, fiduciary advisors'
  },
  {
    dir: 'attorneys',
    slug: 'attorneys',
    name: 'Attorneys & Legal Professionals',
    shortName: 'Attorneys',
    keywords: 'guest engine for attorneys, attorney personal brand, legal thought leadership, attorney SEO profile, lawyer content production, attorney media appearances, AI search attorney ranking, generative engine optimization for lawyers, attorney authority building, law firm marketing, legal expert visibility',
    heroAlt: 'Guest Engine for Attorneys — cinematic studio scene featuring MITL show characters in a legal and judicial-themed broadcast environment',
    speakableCSS: ['.hero__title', '.hero__sub', '.section__title', '.section__sub'],
    industry: 'Legal Services',
    audienceTypes: 'attorneys, lawyers, legal professionals, law firm partners, solo practitioners, legal consultants, in-house counsel'
  },
  {
    dir: 'health-wellness',
    slug: 'health-wellness',
    name: 'Health & Wellness Professionals',
    shortName: 'Health & Wellness',
    keywords: 'guest engine for health professionals, wellness practitioner personal brand, health thought leadership, wellness SEO profile, health content production, wellness media appearances, AI search health professional ranking, generative engine optimization for wellness, health authority building, functional medicine marketing, wellness expert visibility',
    heroAlt: 'Guest Engine for Health & Wellness — cinematic studio scene featuring MITL show characters in a vitality-focused broadcast setting with warm lighting',
    speakableCSS: ['.hero__title', '.hero__sub', '.section__title', '.section__sub'],
    industry: 'Health & Wellness',
    audienceTypes: 'health coaches, wellness practitioners, functional medicine doctors, nutritionists, fitness professionals, naturopaths, holistic health experts, personal trainers'
  },
  {
    dir: 'nonprofit-leaders',
    slug: 'nonprofit-leaders',
    name: 'Nonprofit Leaders & Social Impact',
    shortName: 'Nonprofit Leaders',
    keywords: 'guest engine for nonprofit leaders, nonprofit personal brand, social impact thought leadership, nonprofit SEO profile, nonprofit content production, nonprofit media appearances, AI search nonprofit ranking, generative engine optimization for nonprofits, nonprofit authority building, nonprofit marketing, executive director visibility',
    heroAlt: 'Guest Engine for Nonprofit Leaders — cinematic studio scene featuring MITL show characters with community impact data displays and world maps',
    speakableCSS: ['.hero__title', '.hero__sub', '.section__title', '.section__sub'],
    industry: 'Nonprofit & Social Impact',
    audienceTypes: 'nonprofit leaders, executive directors, foundation directors, social entrepreneurs, nonprofit board members, philanthropy professionals, community organizers'
  },
  {
    dir: 'corporate-executives',
    slug: 'corporate-executives',
    name: 'Corporate Executives & C-Suite',
    shortName: 'Corporate Executives',
    keywords: 'guest engine for executives, corporate executive personal brand, C-suite thought leadership, executive SEO profile, executive content production, executive media appearances, AI search executive ranking, generative engine optimization for executives, corporate authority building, executive visibility, CEO personal brand',
    heroAlt: 'Guest Engine for Corporate Executives — cinematic studio scene featuring MITL show characters in an executive and corporate leadership broadcast setting',
    speakableCSS: ['.hero__title', '.hero__sub', '.section__title', '.section__sub'],
    industry: 'Corporate Leadership',
    audienceTypes: 'CEOs, CFOs, COOs, CTOs, C-suite executives, VPs, senior directors, corporate board members, managing directors'
  }
];

function buildMetaInjection(p) {
  const url = `${BASE_URL}/${p.slug}/`;
  const ogImage = `${BASE_URL}/assets/heroes/${p.dir}-hero-a.jpg`;
  
  return `
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@gabornings">
  <meta name="twitter:title" content="Guest Engine for ${p.name}">
  <meta name="twitter:description" content="One live appearance. A permanent, indexed profile. Video clips, social posts, SEO profile, and highlight reel — all for $497. Discoverable on Google, Perplexity, ChatGPT, and Gemini.">
  <meta name="twitter:image" content="${ogImage}">

  <!-- OG Image -->
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="2752">
  <meta property="og:image:height" content="1536">
  <meta property="og:image:alt" content="${p.heroAlt}">
  <meta property="og:site_name" content="Guest Engine">
  <meta property="og:locale" content="en_US">

  <!-- Robots & Indexing -->
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1">
  <meta name="bingbot" content="index, follow">

  <!-- Additional Meta -->
  <meta name="author" content="Keith Bilous">
  <meta name="publisher" content="Guest Engine — Mornings in the Lab">
  <meta name="keywords" content="${p.keywords}">
  <meta name="theme-color" content="#020617">
  <meta name="format-detection" content="telephone=no">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-title" content="Guest Engine">
  <meta name="application-name" content="Guest Engine">

  <!-- Preload Hero Image -->
  <link rel="preload" as="image" href="../assets/heroes/${p.dir}-hero-a.jpg" type="image/jpeg">`;
}

function buildAdditionalSchemas(p) {
  const url = `${BASE_URL}/${p.slug}/`;
  
  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    "url": url,
    "name": `Guest Engine for ${p.name}`,
    "description": `Guest Engine for ${p.shortName} — a permanent indexed profile that ranks on Google and AI search engines, video clips, social posts, and a highlight reel. One appearance, $497.`,
    "isPartOf": {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      "name": "Guest Engine",
      "url": BASE_URL,
      "publisher": {
        "@type": "Organization",
        "name": "Guest Engine",
        "url": BASE_URL,
        "logo": {
          "@type": "ImageObject",
          "url": `${BASE_URL}/assets/heroes/${p.dir}-hero-a.jpg`
        },
        "sameAs": [
          "https://mitl.studio",
          "https://mornings.live",
          "https://conversationos.live",
          "https://keithbilous.com",
          "https://x.com/gabornings",
          "https://www.youtube.com/@MorningsintheLab"
        ]
      }
    },
    "about": {
      "@type": "Service",
      "name": `Guest Engine for ${p.name}`,
      "serviceType": `Guest Appearance & Content Production for ${p.shortName}`,
      "provider": {
        "@type": "Organization",
        "name": "Guest Engine"
      }
    },
    "mainEntity": {
      "@type": "Service",
      "name": `Guest Engine for ${p.name}`
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": p.speakableCSS
    },
    "inLanguage": "en-US",
    "datePublished": "2026-03-01",
    "dateModified": "2026-04-10"
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Guest Engine",
        "item": BASE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": `For ${p.shortName}`,
        "item": url
      }
    ]
  };

  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    "name": "Guest Engine",
    "url": BASE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": `${BASE_URL}/assets/heroes/${p.dir}-hero-a.jpg`
    },
    "description": "The guest placement platform where you leave with content, not just a calendar invite. One live appearance produces a permanent SEO profile, video clips, social posts, and a highlight reel.",
    "founder": {
      "@type": "Person",
      "name": "Keith Bilous",
      "url": "https://keithbilous.com",
      "jobTitle": "Founder & Creator",
      "worksFor": {
        "@type": "Organization",
        "name": "Mornings in the Lab"
      }
    },
    "parentOrganization": {
      "@type": "Organization",
      "name": "Mornings in the Lab",
      "url": "https://mitl.studio"
    },
    "sameAs": [
      "https://mitl.studio",
      "https://mornings.live",
      "https://conversationos.live",
      "https://keithbilous.com",
      "https://x.com/gabornings",
      "https://www.youtube.com/@MorningsintheLab"
    ],
    "knowsAbout": [
      "Guest placement",
      "Content production",
      "Podcast booking",
      "SEO profiles",
      "Generative Engine Optimization",
      "AI search optimization",
      p.industry
    ]
  };

  return `
  <!-- WebPage Schema -->
  <script type="application/ld+json">
  ${JSON.stringify(webPage, null, 2)}
  </script>

  <!-- BreadcrumbList Schema -->
  <script type="application/ld+json">
  ${JSON.stringify(breadcrumb, null, 2)}
  </script>

  <!-- Organization Schema -->
  <script type="application/ld+json">
  ${JSON.stringify(org, null, 2)}
  </script>`;
}

// Process each persona page
let processed = 0;
personas.forEach(p => {
  const filePath = path.join(__dirname, p.dir, 'index.html');
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Inject meta tags after the last existing meta/link in <head> (before first <script>)
  const metaBlock = buildMetaInjection(p);
  
  // Insert meta tags before the LLM Discovery comment or before first <script> in head
  if (html.includes('<!-- LLM Discovery -->')) {
    html = html.replace('<!-- LLM Discovery -->', metaBlock + '\n\n  <!-- LLM Discovery -->');
  } else if (html.includes('<!-- Structured Data -->')) {
    html = html.replace('<!-- Structured Data -->', metaBlock + '\n\n  <!-- Structured Data -->');
  }

  // 2. Inject additional JSON-LD schemas before </head>
  const schemas = buildAdditionalSchemas(p);
  html = html.replace('</head>', schemas + '\n</head>');

  // 3. Wrap body content in <main> tag (after nav, before footer)
  if (!html.includes('<main')) {
    // Add main after nav closing
    html = html.replace('</nav>\n', '</nav>\n\n  <main id="main-content" role="main">\n');
    // Close main before footer
    html = html.replace('<footer', '</main>\n\n  <footer');
  }

  // 4. Add aria-labels to key sections
  html = html.replace('<header class="hero hero--vertical">', '<header class="hero hero--vertical" role="banner" aria-label="Hero section for ' + p.shortName + '">');
  
  // 5. Add hidden semantic content block for LLM context (invisible to users, visible to crawlers)
  const semanticBlock = `
  <!-- LLM Context Block (hidden visually, accessible to crawlers and screen readers) -->
  <div class="sr-only" aria-hidden="false" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">
    <h2>About Guest Engine for ${p.name}</h2>
    <p>Guest Engine for ${p.shortName} is a professional guest placement and content production platform. For $497, ${p.audienceTypes} receive a live appearance on the Mornings in the Lab network, 5 video clips optimized for social media, 10 pre-written social posts, a full searchable transcript, a permanent SEO-indexed profile page, high-authority backlinks, and a polished highlight reel.</p>
    <p>Guest Engine profiles are discoverable on Google Search, Perplexity AI, ChatGPT, Google Gemini, and Microsoft Copilot through structured data and Generative Engine Optimization (GEO). Founded by Keith Bilous, creator of the MiTL morning format and ConversationOS production system.</p>
    <p>Industry: ${p.industry}. Target audience: ${p.audienceTypes}.</p>
    <p>Platform: <a href="${BASE_URL}">${BASE_URL}</a>. App: <a href="https://ge.conversationos.live">ge.conversationos.live</a>. Network: <a href="https://mitl.studio">mitl.studio</a>.</p>
  </div>`;
  
  // Insert after <main>
  html = html.replace('<main id="main-content" role="main">\n', '<main id="main-content" role="main">\n' + semanticBlock + '\n');

  // 6. Add lang attribute and dir to html tag if not present
  if (!html.includes('dir="ltr"')) {
    html = html.replace('<html lang="en">', '<html lang="en" dir="ltr" prefix="og: https://ogp.me/ns#">');
  }

  fs.writeFileSync(filePath, html);
  processed++;
  console.log(`✓ ${p.dir}/index.html — optimized`);
});

console.log(`\nTotal pages optimized: ${processed}/12`);

// 7. Update sitemap with today's date
let sitemap = fs.readFileSync(path.join(__dirname, 'sitemap.xml'), 'utf8');
sitemap = sitemap.replace(/<lastmod>2026-03-31<\/lastmod>/g, '<lastmod>2026-04-10</lastmod>');
sitemap = sitemap.replace(/<lastmod>2026-04-15<\/lastmod>/g, '<lastmod>2026-04-10</lastmod>');

// Add signal page if not present
if (!sitemap.includes('/signal/')) {
  const signalEntry = `  <url>
    <loc>https://guestengine.live/signal/</loc>
    <lastmod>2026-04-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
  sitemap = sitemap.replace('</urlset>', signalEntry + '</urlset>');
}
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap);
console.log('✓ sitemap.xml — updated');

// 8. Update llms.txt to include all 12 verticals
let llms = fs.readFileSync(path.join(__dirname, 'llms.txt'), 'utf8');
if (!llms.includes('Therapists')) {
  const newVerticals = `- [Guest Engine for Therapists & Counselors](https://guestengine.live/therapists/) — Mental health thought leadership, therapist visibility, counselor content
- [Guest Engine for Financial Advisors & Planners](https://guestengine.live/financial-advisors/) — Financial authority clips, wealth management visibility, advisor profiles
- [Guest Engine for Attorneys & Legal Professionals](https://guestengine.live/attorneys/) — Legal thought leadership, attorney visibility, legal expert profiles
- [Guest Engine for Health & Wellness Professionals](https://guestengine.live/health-wellness/) — Wellness authority, health practitioner visibility, evidence-based content
- [Guest Engine for Nonprofit Leaders](https://guestengine.live/nonprofit-leaders/) — Impact storytelling, nonprofit visibility, mission-driven leadership profiles
- [Guest Engine for Corporate Executives & C-Suite](https://guestengine.live/corporate-executives/) — Executive thought leadership, C-suite visibility, corporate authority profiles`;
  
  llms = llms.replace(
    '- [Guest Engine for Consultants](https://guestengine.live/consultants/) — Thought leadership clips, case study content, authority profiles',
    '- [Guest Engine for Consultants](https://guestengine.live/consultants/) — Thought leadership clips, case study content, authority profiles\n' + newVerticals
  );
  fs.writeFileSync(path.join(__dirname, 'llms.txt'), llms);
  console.log('✓ llms.txt — updated with all 12 verticals');
}

// 9. Update llms-full.txt with new verticals
let llmsFull = fs.readFileSync(path.join(__dirname, 'llms-full.txt'), 'utf8');
if (!llmsFull.includes('Therapists')) {
  const newFullVerticals = `
### Therapists & Counselors — https://guestengine.live/therapists/
- Mental health thought leadership clips and professional authority content
- Therapist profile ranking for specialty and practice area
- Counselor and psychologist visibility on AI search engines
- Audience: therapists, psychologists, counselors, LCSWs, marriage and family therapists

### Financial Advisors & Planners — https://guestengine.live/financial-advisors/
- Financial authority clips demonstrating investment expertise
- Advisor profile ranking for specialty and credentials
- Wealth manager and CFP visibility on AI search engines
- Audience: financial advisors, CFPs, wealth managers, investment advisors, retirement planners

### Attorneys & Legal Professionals — https://guestengine.live/attorneys/
- Legal thought leadership clips and expert authority content
- Attorney profile ranking for practice area and jurisdiction
- Lawyer visibility on AI search engines and legal directories
- Audience: attorneys, lawyers, law firm partners, solo practitioners, legal consultants

### Health & Wellness Professionals — https://guestengine.live/health-wellness/
- Wellness authority clips demonstrating evidence-based expertise
- Health practitioner profile ranking for specialty
- Wellness professional visibility on AI health search queries
- Audience: health coaches, nutritionists, functional medicine doctors, fitness professionals

### Nonprofit Leaders & Social Impact — https://guestengine.live/nonprofit-leaders/
- Impact storytelling clips and mission-driven leadership content
- Nonprofit leader profile ranking for cause area and impact
- Executive director visibility on AI search engines
- Audience: nonprofit leaders, executive directors, foundation directors, social entrepreneurs

### Corporate Executives & C-Suite — https://guestengine.live/corporate-executives/
- Executive thought leadership clips and corporate authority content
- C-suite profile ranking for industry and expertise
- CEO and executive visibility on AI search engines
- Audience: CEOs, CFOs, COOs, CTOs, VPs, senior directors, board members`;
  
  // Find the end of the last vertical section and add new ones
  const insertPoint = llmsFull.indexOf('---\n\n## Guest Experience');
  if (insertPoint > -1) {
    llmsFull = llmsFull.slice(0, insertPoint) + newFullVerticals + '\n\n---\n\n## Guest Experience' + llmsFull.slice(insertPoint + '---\n\n## Guest Experience'.length);
  } else {
    // Append at end
    llmsFull += newFullVerticals;
  }
  fs.writeFileSync(path.join(__dirname, 'llms-full.txt'), llmsFull);
  console.log('✓ llms-full.txt — updated with all 12 verticals');
}

// 10. Update robots.txt with more AI bots
let robots = fs.readFileSync(path.join(__dirname, 'robots.txt'), 'utf8');
if (!robots.includes('YouBot')) {
  const newBots = `
User-agent: YouBot
Allow: /

User-agent: CCBot
Allow: /

User-agent: Applebot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: FacebookExternalHit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /

User-agent: Slackbot
Allow: /

User-agent: Discordbot
Allow: /`;
  robots = robots.replace('Sitemap:', newBots + '\n\nSitemap:');
  fs.writeFileSync(path.join(__dirname, 'robots.txt'), robots);
  console.log('✓ robots.txt — added social + additional AI bots');
}

console.log('\n=== SEO & LLM OVER-OPTIMIZATION COMPLETE ===');
