const fs = require('fs');
const path = require('path');

const baseDir = '/home/user/workspace/guestengine-live';

// ============================================================
// VERTICAL PAGE CONFIGS
// ============================================================
const verticals = {
  authors: {
    name: 'Authors & Speakers',
    slug: 'authors',
    audience: 'authors, speakers, thought leaders, writers, non-fiction authors, keynote speakers',
    serviceType: 'Guest Appearance & Content Production for Authors',
    description: 'Guest Engine for authors and speakers — one live appearance gives you clips for your book launch, a speaker reel, an SEO profile, and a month of social content.',
  },
  coaches: {
    name: 'Coaches & Mentors',
    slug: 'coaches',
    audience: 'life coaches, fitness coaches, executive coaches, mentors, wellness coaches, health coaches, business coaches',
    serviceType: 'Guest Appearance & Content Production for Coaches',
    description: 'Guest Engine for coaches and mentors — one live conversation gives you expertise clips, social posts, an SEO profile, and a credibility reel.',
  },
  founders: {
    name: 'Startup Founders',
    slug: 'founders',
    audience: 'startup founders, entrepreneurs, CEOs, co-founders, tech founders, small business owners',
    serviceType: 'Guest Appearance & Content Production for Founders',
    description: 'Guest Engine for founders and entrepreneurs — one live appearance gives you pitch-ready clips, investor-facing content, an SEO profile, and a founder highlight reel.',
  },
  realestate: {
    name: 'Real Estate Professionals',
    slug: 'realestate',
    audience: 'real estate agents, brokers, property managers, realtors, real estate investors, property professionals',
    serviceType: 'Guest Appearance & Content Production for Real Estate Professionals',
    description: 'Guest Engine for real estate professionals — one live appearance gives you listing-ready clips, client-facing content, an SEO profile, and a market authority reel.',
  },
  podcasters: {
    name: 'Podcast Hosts',
    slug: 'podcasters',
    audience: 'podcast hosts, podcasters, show hosts, content creators, media hosts, livestream hosts',
    serviceType: 'Guest Appearance & Content Production for Podcast Hosts',
    description: 'Guest Engine for podcast hosts — cross-promote your show with a live appearance, get clips for your feed, an SEO profile, and access to the MITL production stack.',
  },
  consultants: {
    name: 'Consultants & Fractional Executives',
    slug: 'consultants',
    audience: 'consultants, fractional executives, fractional CMOs, fractional CTOs, B2B consultants, management consultants, strategy consultants',
    serviceType: 'Guest Appearance & Content Production for Consultants',
    description: 'Guest Engine for consultants and fractional executives — one live appearance gives you authority-building clips, case study content, an SEO profile, and a thought leadership reel.',
  },
};

// ============================================================
// 1. ADD STRUCTURED DATA + CANONICAL + LLMS LINK TO EACH VERTICAL
// ============================================================
Object.values(verticals).forEach(v => {
  const filePath = path.join(baseDir, v.slug, 'index.html');
  let html = fs.readFileSync(filePath, 'utf8');

  // JSON-LD structured data for this vertical
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `Guest Engine for ${v.name}`,
    "url": `https://guestengine.live/${v.slug}/`,
    "serviceType": v.serviceType,
    "description": v.description,
    "audience": {
      "@type": "Audience",
      "audienceType": v.audience
    },
    "offers": {
      "@type": "Offer",
      "price": "497",
      "priceCurrency": "USD",
      "description": "One-time guest appearance with full content production package"
    },
    "provider": {
      "@type": "Organization",
      "name": "Guest Engine",
      "url": "https://guestengine.live",
      "parentOrganization": {
        "@type": "Organization",
        "name": "Mornings in the Lab",
        "url": "https://mitl.studio"
      }
    },
    "isPartOf": {
      "@type": "WebSite",
      "name": "Guest Engine",
      "url": "https://guestengine.live"
    }
  }, null, 2);

  // Build injection block
  const injectionBlock = `
  <!-- Canonical -->
  <link rel="canonical" href="https://guestengine.live/${v.slug}/">

  <!-- LLM Discovery -->
  <link rel="llms-txt" href="https://guestengine.live/llms.txt">
  <link rel="alternate" type="text/plain" href="https://guestengine.live/llms-full.txt" title="LLM Full Documentation">

  <!-- Structured Data -->
  <script type="application/ld+json">
  ${jsonLd}
  </script>`;

  // Insert before </head>
  html = html.replace('</head>', injectionBlock + '\n</head>');

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`  ✓ ${v.slug}/index.html — JSON-LD + canonical + llms link`);
});

// ============================================================
// 2. ADD CANONICAL + LLMS LINK TO HOMEPAGE (already has JSON-LD)
// ============================================================
{
  const homePath = path.join(baseDir, 'index.html');
  let html = fs.readFileSync(homePath, 'utf8');

  const homeInjection = `
  <!-- Canonical -->
  <link rel="canonical" href="https://guestengine.live/">

  <!-- LLM Discovery -->
  <link rel="llms-txt" href="https://guestengine.live/llms.txt">
  <link rel="alternate" type="text/plain" href="https://guestengine.live/llms-full.txt" title="LLM Full Documentation">`;

  html = html.replace('</head>', homeInjection + '\n</head>');
  fs.writeFileSync(homePath, html, 'utf8');
  console.log('  ✓ index.html — canonical + llms link');
}

// ============================================================
// 3. UPDATE llms.txt WITH VERTICAL PAGES
// ============================================================
const llmsTxt = `# Guest Engine

> The only guest platform where you leave with content, not just a calendar invite.

Guest Engine is a two-sided guest placement platform for podcast and live show hosts and guests. Built on ConversationOS by Keith Bilous, creator of the MiTL morning format.

## What Guest Engine Does

Guest Engine connects guests who want to be featured on live shows with hosts who need quality guests — and produces the entire experience end-to-end.

### For Guests
- Book appearances on live shows across the MITL Live Network
- AI producer (Sophia) handles pre-show prep, topic angles, and green room briefing
- Walk away with 7 deliverables: live appearance, 5 video clips, 10 social posts, full transcript, SEO profile page, backlinks, and highlight reel
- One flat fee: $497 per appearance
- Permanent, indexed profile page with SEO + GEO (Generative Engine Optimization)

### For Hosts
- List your show and set guest criteria
- Receive AI-scored guest candidates in your pipeline
- Sophia handles booking, scheduling, and prep packets
- Full production stack: clips, transcripts, social posts, distribution
- Revenue share on guest bookings
- Powered by ConversationOS production engines

## Industry-Specific Pages

Guest Engine serves specific professional verticals with tailored positioning:

- [Guest Engine for Authors & Speakers](https://guestengine.live/authors/) — Book launches, speaker reels, media kits
- [Guest Engine for Coaches & Mentors](https://guestengine.live/coaches/) — Expertise clips, credibility reels, client-facing content
- [Guest Engine for Founders](https://guestengine.live/founders/) — Pitch-ready clips, investor content, founder profiles
- [Guest Engine for Real Estate](https://guestengine.live/realestate/) — Market authority clips, listing content, agent profiles
- [Guest Engine for Podcasters](https://guestengine.live/podcasters/) — Cross-promotion, show clips, production stack access
- [Guest Engine for Consultants](https://guestengine.live/consultants/) — Thought leadership clips, case study content, authority profiles

## Platform Details
- Brand site: https://guestengine.live
- App: https://app.conversationos.live
- Parent Platform: https://conversationos.live
- Network: https://mitl.studio
- Production: https://production.mitl.studio
- Show: https://mornings.live
- Founder: https://keithbilous.com

## Pricing
- Guest appearance: $497 (one-time, includes full content package)
- Guest free profile: $0 (listed in directory)
- Host listing: Free
- Host pro tools: Available (ConversationOS integration)

## Key Differentiators
1. Production included — not just matchmaking
2. SEO + GEO profiles indexed by Google and AI search engines (Perplexity, ChatGPT, Gemini)
3. Powered by ConversationOS (Build, Clip, Distribution, Narrative, Character engines)
4. Part of the MITL Live Network (1,000+ episodes, 700+ consecutive mornings, 3 years daily LIVE)
5. AI producer Sophia handles the entire guest lifecycle
6. Created by Keith Bilous — AI-powered matching, human-led production

## Contact
- AI Producer: Sophia (via app.conversationos.live)
- Network: Mornings in the Lab (mornings.live)
- Platform: ConversationOS (conversationos.live)
- Founder: Keith Bilous (keithbilous.com)

## Extended Documentation
- [Full details](https://guestengine.live/llms-full.txt)
`;

fs.writeFileSync(path.join(baseDir, 'llms.txt'), llmsTxt, 'utf8');
console.log('  ✓ llms.txt — updated with verticals + family links');

// ============================================================
// 4. UPDATE llms-full.txt WITH VERTICAL DETAILS
// ============================================================
const llmsFullTxt = `# Guest Engine — Full Documentation

> The only guest platform where you leave with content, not just a calendar invite.

Guest Engine is a two-sided guest placement and production platform. It connects guests seeking live show appearances with hosts who need quality guests — then produces the entire experience end-to-end. Unlike matchmaking platforms (PodMatch, Matchmaker.fm), Guest Engine includes full production: clips, social posts, transcripts, SEO profiles, and highlight reels.

Created by Keith Bilous, founder of the MITL morning format and the ConversationOS production system. AI-powered matching. Human-led production.

---

## Platform Architecture

Guest Engine is a product of ConversationOS — a modular show management platform with the following engines:

| Engine | Function |
|--------|----------|
| Build Engine | Episode creation, show blueprints, rundowns |
| Conversation Engine | Live show management, teleprompter, real-time tools |
| Distribution Engine | Multi-platform publishing, scheduling, analytics |
| Clip Engine | Automated clip generation, social optimization |
| Narrative Engine | Transcript processing, content repurposing |
| Character Engine | AI character management, personality systems |
| Guest Engine | Guest booking, onboarding, production, off-boarding |

---

## Guest Experience (End-to-End)

### Step 1: Sign Up
Guest creates a profile at app.conversationos.live. Profile includes bio, expertise, topics, links, and optional video pitch.

### Step 2: Get Matched
AI scores compatibility between guest profile and available shows. Factors: topic alignment, audience fit, conversation chemistry prediction, expertise level.

### Step 3: Pre-Show Prep
Sophia (AI producer) handles:
- Topic angle development
- Talking points and conversation starters
- Green room briefing
- Technical check and format overview
- Guest prep packet delivery

### Step 4: Go Live
Guest appears on a show in the MITL Live Network. Format options include:
- Center Stage (featured interview)
- Deep Dive (long-form exploration)
- Community Corner (community conversation)
- Guest can participate remotely or in-studio

### Step 5: Post-Production
Within 48 hours, guest receives:
1. Full recorded appearance (video + audio)
2. 5 short-form video clips optimized for social platforms
3. 10 pre-written social media posts (LinkedIn, X, Instagram)
4. Complete searchable transcript
5. Permanent SEO profile page on guestengine.live
6. High-authority backlinks to guest's website
7. Polished highlight reel for media kit / speaking page

### Step 6: Profile Lives Forever
Guest profile is permanently indexed by:
- Google Search (traditional SEO)
- AI search engines: Perplexity, ChatGPT, Gemini (Generative Engine Optimization)
- Profile compounds in value over time as appearances accumulate

---

## Industry-Specific Verticals

Guest Engine serves these professional verticals with tailored messaging, deliverables, and positioning:

### Authors & Speakers — https://guestengine.live/authors/
- Book launch clips optimized for social media
- Speaker reel for keynote and conference applications
- SEO profile ranking for author name + book title
- Transcript repurposable into newsletter issues and articles
- Audience: authors, speakers, thought leaders, writers, non-fiction authors, keynote speakers

### Coaches & Mentors — https://guestengine.live/coaches/
- Expertise clips demonstrating coaching methodology
- Credibility reel for client acquisition and speaking pages
- SEO profile ranking for coaching specialization
- Social content positioning coach as authority
- Audience: life coaches, fitness coaches, executive coaches, mentors, wellness coaches, health coaches

### Startup Founders — https://guestengine.live/founders/
- Pitch-ready clips for investor decks and media kits
- Founder story content for LinkedIn and X
- SEO profile ranking for founder name + company
- Highlight reel showcasing vision and traction
- Audience: startup founders, entrepreneurs, CEOs, co-founders, tech founders

### Real Estate Professionals — https://guestengine.live/realestate/
- Market authority clips for listing presentations
- Client-facing content for trust building
- SEO profile ranking for agent name + market
- Local market expertise showcase reel
- Audience: real estate agents, brokers, property managers, realtors, investors

### Podcast Hosts — https://guestengine.live/podcasters/
- Cross-promotion clips driving audience to your show
- Behind-the-scenes content for your social channels
- SEO profile with show links and episode archive
- Access to MITL production stack for your own show
- Audience: podcast hosts, show hosts, content creators, media hosts, livestream hosts

### Consultants & Fractional Executives — https://guestengine.live/consultants/
- Thought leadership clips for LinkedIn and client pitches
- Case study content and methodology breakdowns
- SEO profile ranking for consulting specialization
- Authority reel for RFP submissions and speaking
- Audience: consultants, fractional executives, fractional CMOs, fractional CTOs, B2B consultants

---

## Host Experience

### Listing Your Show
Hosts create a show profile with:
- Show description, format, and audience
- Guest criteria (topics, expertise level, audience size)
- Scheduling availability
- Content preferences

### Guest Pipeline
- AI-scored candidates appear in host's pipeline
- Kanban workflow: New → Reviewing → Shortlisted → Accepted → Scheduled → Appeared
- Accept/reject with one click
- No cold DMs or pitch spam

### Production Tools (via ConversationOS)
- Sophia handles all booking logistics
- Automated prep packet generation
- Post-show clip generation via Clip Engine
- Distribution via Distribution Engine
- Transcript processing via Narrative Engine

### Revenue Model for Hosts
- Guests pay $497 per appearance
- Hosts receive revenue share on bookings
- Premium host tools available through ConversationOS subscription

---

## Pricing

| Tier | Who | Price | Includes |
|------|-----|-------|----------|
| Guest Free Profile | Guest | $0 | Listed in directory, discoverable |
| Guest Appearance | Guest | $497 (one-time) | Full appearance + 7-deliverable content package |
| Host Listing | Host | Free | List show, receive guest applications |
| Host Pro | Host | Contact for pricing | AI matching, Sophia booking, production stack |
| ConversationOS | Host | Contact for pricing | Full show production platform |

---

## The MITL Live Network

Guest Engine is the front door to the Mornings in the Lab Live Network:
- 1,000+ episodes produced
- 700+ consecutive mornings broadcasting
- 3 years of daily LIVE content
- Flagship: Mornings in the Lab with Keith & Jon
- Multiple show formats across the network
- Live, unscripted, authentic conversations

---

## MITL Network — Family of Sites

| Site | URL | Description |
|------|-----|-------------|
| Guest Engine (brand) | https://guestengine.live | Guest placement brand page |
| Guest Engine (app) | https://app.conversationos.live | Guest booking and profiles app |
| ConversationOS | https://conversationos.live | Show production platform |
| ConversationOS App | https://app.conversationos.live | Platform application |
| MITL Studio | https://mitl.studio | Network headquarters |
| MITL Production | https://production.mitl.studio | Production services |
| Mornings in the Lab | https://mornings.live | Daily live morning show |
| Keith Bilous | https://keithbilous.com | Founder personal site |

---

## Technical Integration

Guest Engine is built on the ConversationOS platform and integrates with:
- ConversationOS MCP Server (42+ tools)
- Pipedrive (guest pipeline CRM)
- Notion (guest curation database)
- Apollo.io (guest enrichment)
- LinkedIn Sales Navigator (guest discovery)
- YouTube Data API (audience analytics)
- Sophia AI (conversational scheduling)
- Google Workspace (communications)

---

## Contact & Booking

- Book an appearance: https://app.conversationos.live
- AI Producer: Sophia (accessible through the platform)
- Network inquiries: https://mitl.studio
- Show: https://mornings.live
- Platform inquiries: https://conversationos.live
- Founder: Keith Bilous — https://keithbilous.com
`;

fs.writeFileSync(path.join(baseDir, 'llms-full.txt'), llmsFullTxt, 'utf8');
console.log('  ✓ llms-full.txt — updated with vertical details + family network');

// ============================================================
// 5. UPDATE robots.txt WITH ADDITIONAL LLM BOT PERMISSIONS
// ============================================================
const robotsTxt = `User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Anthropic-AI
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Cohere-AI
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

Sitemap: https://guestengine.live/sitemap.xml
`;

fs.writeFileSync(path.join(baseDir, 'robots.txt'), robotsTxt, 'utf8');
console.log('  ✓ robots.txt — added ChatGPT-User, Anthropic-AI, Cohere-AI, Meta-ExternalAgent, Googlebot, Bingbot');

// ============================================================
// 6. UPDATE agent.json WITH VERTICALS
// ============================================================
const agentJson = {
  "name": "Guest Engine",
  "description": "Two-sided guest placement and production platform for podcast and live show hosts and guests. Get booked, get produced, get everywhere. Created by Keith Bilous.",
  "url": "https://guestengine.live",
  "provider": {
    "organization": "Mornings in the Lab",
    "url": "https://mitl.studio",
    "founder": "Keith Bilous",
    "founder_url": "https://keithbilous.com"
  },
  "version": "1.1.0",
  "capabilities": {
    "guest_booking": {
      "description": "Book guest appearances on live shows across the MITL Live Network",
      "endpoint": "https://app.conversationos.live"
    },
    "guest_profiles": {
      "description": "Create and manage permanent, SEO-indexed guest profiles",
      "endpoint": "https://app.conversationos.live"
    },
    "host_listing": {
      "description": "List your show and receive AI-matched guest candidates",
      "endpoint": "https://app.conversationos.live"
    },
    "content_production": {
      "description": "Full post-appearance content production: clips, social posts, transcripts, highlight reels",
      "endpoint": "https://app.conversationos.live"
    },
    "ai_producer": {
      "description": "Sophia AI producer handles prep, booking, and green room briefing",
      "endpoint": "https://app.conversationos.live"
    }
  },
  "verticals": {
    "authors": {
      "url": "https://guestengine.live/authors/",
      "description": "Guest appearances and content production for authors, speakers, and thought leaders"
    },
    "coaches": {
      "url": "https://guestengine.live/coaches/",
      "description": "Guest appearances and content production for life coaches, fitness coaches, and mentors"
    },
    "founders": {
      "url": "https://guestengine.live/founders/",
      "description": "Guest appearances and content production for startup founders and entrepreneurs"
    },
    "realestate": {
      "url": "https://guestengine.live/realestate/",
      "description": "Guest appearances and content production for real estate agents, brokers, and property professionals"
    },
    "podcasters": {
      "url": "https://guestengine.live/podcasters/",
      "description": "Guest appearances and cross-promotion for podcast hosts and show creators"
    },
    "consultants": {
      "url": "https://guestengine.live/consultants/",
      "description": "Guest appearances and content production for consultants and fractional executives"
    }
  },
  "authentication": {
    "schemes": ["none"],
    "notes": "Guest profiles are publicly browsable. Booking requires account creation."
  },
  "documentation": {
    "llms_txt": "https://guestengine.live/llms.txt",
    "llms_full_txt": "https://guestengine.live/llms-full.txt"
  },
  "parent_platform": {
    "name": "ConversationOS",
    "url": "https://conversationos.live",
    "app_url": "https://app.conversationos.live"
  },
  "network": {
    "name": "MITL Live Network",
    "url": "https://mitl.studio",
    "production_url": "https://production.mitl.studio",
    "show_url": "https://mornings.live",
    "founder_url": "https://keithbilous.com"
  }
};

fs.writeFileSync(path.join(baseDir, '.well-known', 'agent.json'), JSON.stringify(agentJson, null, 2) + '\n', 'utf8');
console.log('  ✓ .well-known/agent.json — added verticals + founder + network details');

console.log('\n✅ All LLM optimization complete.');
