#!/usr/bin/env node
/**
 * Homepage SEO Over-Optimization
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Upgrade html tag
html = html.replace('<html lang="en">', '<html lang="en" dir="ltr" prefix="og: https://ogp.me/ns#">');

// 2. Inject meta tags after og:image line
const homeMeta = `
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@gabornings">
  <meta name="twitter:title" content="Guest Engine — Your Professional Profile, Produced and Indexed Forever">
  <meta name="twitter:description" content="Other platforms book you on a show. We set the conversation before you arrive — research what your audience is arguing about, brief the host, and produce the whole thing live. $497.">
  <meta name="twitter:image" content="https://guestengine.live/og-image.png">

  <!-- OG Extras -->
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Guest Engine — the guest placement platform where you leave with content, not just a calendar invite">
  <meta property="og:site_name" content="Guest Engine">
  <meta property="og:locale" content="en_US">

  <!-- Robots & Indexing -->
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1">
  <meta name="bingbot" content="index, follow">

  <!-- Additional Meta -->
  <meta name="author" content="Keith Bilous">
  <meta name="publisher" content="Guest Engine — Mornings in the Lab">
  <meta name="keywords" content="guest engine, guest placement platform, podcast guest booking, professional profile, SEO profile, generative engine optimization, AI search optimization, content production, video clips, social posts, highlight reel, guest appearance, mornings in the lab, conversationos, keith bilous, GEO, permanent indexed profile">
  <meta name="theme-color" content="#020617">
  <meta name="format-detection" content="telephone=no">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-title" content="Guest Engine">
  <meta name="application-name" content="Guest Engine">

  <!-- Canonical -->
  <link rel="canonical" href="https://guestengine.live/">

  <!-- LLM Discovery -->
  <link rel="llms-txt" href="https://guestengine.live/llms.txt">
  <link rel="alternate" type="text/plain" href="https://guestengine.live/llms-full.txt" title="LLM Full Documentation">`;

html = html.replace(
  '<meta property="og:image" content="https://guestengine.live/og-image.png">',
  '<meta property="og:image" content="https://guestengine.live/og-image.png">\n' + homeMeta
);

// 3. Add WebPage + Speakable schema before </head>
const homeSchemas = `
  <!-- WebPage Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://guestengine.live/#webpage",
    "url": "https://guestengine.live/",
    "name": "Guest Engine — Your Professional Profile, Produced and Indexed Forever",
    "description": "The guest placement platform where you leave with content, not just a calendar invite. One live appearance produces a permanent SEO profile, video clips, social posts, and a highlight reel. $497.",
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://guestengine.live/#website",
      "name": "Guest Engine",
      "url": "https://guestengine.live"
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".hero__title", ".hero__sub", ".section__title"]
    },
    "inLanguage": "en-US",
    "datePublished": "2026-01-15",
    "dateModified": "2026-04-10"
  }
  </script>

  <!-- WebSite Schema with SearchAction -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://guestengine.live/#website",
    "name": "Guest Engine",
    "url": "https://guestengine.live",
    "description": "Professional guest placement and content production platform. Get booked, get produced, get indexed forever.",
    "publisher": {
      "@type": "Organization",
      "name": "Guest Engine",
      "url": "https://guestengine.live"
    },
    "inLanguage": "en-US"
  }
  </script>`;

html = html.replace('</head>', homeSchemas + '\n</head>');

fs.writeFileSync(filePath, html);
console.log('✓ index.html — homepage SEO over-optimized');

// Also check/optimize guide pages
const guideDir = path.join(__dirname, 'guides');
const guideDirs = fs.readdirSync(guideDir).filter(d => fs.statSync(path.join(guideDir, d)).isDirectory());

guideDirs.forEach(gdir => {
  const gFile = path.join(guideDir, gdir, 'index.html');
  if (!fs.existsSync(gFile)) return;
  
  let ghtml = fs.readFileSync(gFile, 'utf8');
  
  // Add robots meta if missing
  if (!ghtml.includes('name="robots"')) {
    ghtml = ghtml.replace('</head>', '  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">\n</head>');
  }
  
  // Add Twitter card if missing
  if (!ghtml.includes('twitter:card')) {
    const guideTitle = ghtml.match(/<title>(.*?)<\/title>/)?.[1] || 'Guest Engine Guide';
    const guideDesc = ghtml.match(/name="description" content="(.*?)"/)?.[1] || '';
    const twitterBlock = `
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@gabornings">
  <meta name="twitter:title" content="${guideTitle}">
  <meta name="twitter:description" content="${guideDesc}">
  <meta name="twitter:image" content="https://guestengine.live/og-image.png">`;
    ghtml = ghtml.replace('</head>', twitterBlock + '\n</head>');
  }
  
  fs.writeFileSync(gFile, ghtml);
  console.log(`✓ guides/${gdir}/index.html — optimized`);
});

console.log('\n=== HOMEPAGE & GUIDES OPTIMIZATION COMPLETE ===');
