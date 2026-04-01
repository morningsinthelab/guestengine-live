// Vertical page generator — builds HTML from config
// Run: node vertical-template.js

const fs = require('fs');
const path = require('path');

const verticals = [
  {
    slug: 'authors',
    eyebrow: 'FOR AUTHORS & SPEAKERS',
    title: 'You Wrote the Book.<br><span class="gold">We Give You the Stage.</span>',
    subtitle: 'One live appearance. A full content package — clips for your book launch, a transcript for your newsletter, an SEO profile that ranks alongside your Amazon page, and a highlight reel that gets you booked for paid keynotes.',
    painTitle: 'You wrote the book.<br>Now <span class="gold">nobody knows</span>.',
    painSub: 'You pitched 50 podcasts and heard nothing. PR firms want $3,000/month. Your book deserves an audience — you just need the right stage and the content to prove it.',
    painThem: [
      'Pitch 50 podcasts, hear from 2',
      'PR retainers starting at $3,000/mo',
      'DIY content that looks DIY',
      'No media kit, no speaker reel',
      'Invisible to AI search engines'
    ],
    painUs: [
      'Guaranteed live appearance on a daily show',
      'One flat fee — $297, done',
      'Professional clips for your book launch',
      'Highlight reel for speaking page & media kit',
      'SEO profile that ranks for your name + book title',
      'Transcript you can repurpose into articles & newsletters',
      'AI search engines surface your profile forever'
    ],
    deliverables: [
      { icon: 'fa-solid fa-microphone-lines', title: 'Live Author Spotlight', desc: 'A full guest segment where you discuss your book, your story, and your expertise with a live daily audience.' },
      { icon: 'fa-solid fa-scissors', title: '5 Book Launch Clips', desc: 'Short-form clips optimized for LinkedIn, X, Instagram, and TikTok — perfect for launch week or ongoing promotion.' },
      { icon: 'fa-solid fa-pen-fancy', title: '10 Social Posts', desc: 'Pre-written posts that position you as a thought leader, not just an author. Ready to publish across every platform.' },
      { icon: 'fa-solid fa-file-lines', title: 'Full Transcript', desc: 'Turn your conversation into a newsletter issue, a LinkedIn article, a blog post, or a chapter excerpt companion.' },
      { icon: 'fa-solid fa-globe', title: 'Author Profile Page', desc: 'A permanent, indexed page that ranks for your name and book title. Compounds over time as AI search engines surface it.' },
      { icon: 'fa-solid fa-film', title: 'Speaker Reel', desc: 'A polished highlight reel for your speaking page, media kit, or conference applications. The thing that gets you booked for keynotes.' }
    ],
    ctaText: 'Book Your Author Spotlight — $297',
    ctaSubtext: 'Less than one hour with a PR firm. More content than a month of trying.',
    closingTitle: 'Your book deserves<br><span class="gold">an audience.</span>',
    closingSub: 'Stop pitching into the void. Show up once, walk away with a media kit, a content library, and a permanent profile that works while you write your next chapter.',
    metaTitle: 'Guest Engine for Authors — You Wrote the Book. We Give You the Stage.',
    metaDesc: 'One live appearance gives authors a full content package — clips for your book launch, a speaker reel, an SEO profile, and a month of social content. $297 flat fee.'
  },
  {
    slug: 'coaches',
    eyebrow: 'FOR COACHES & MENTORS',
    title: 'Stop Coaching and Creating.<br><span class="gold">Just Coach.</span>',
    subtitle: 'One live conversation gives you a month of content you didn\'t have to make — clips that demonstrate your expertise, an SEO profile your next client finds, and social posts that work while you work with clients.',
    painTitle: 'Great at coaching.<br><span class="gold">Invisible online.</span>',
    painSub: 'You change lives every day but your Instagram has 400 followers. You know you need content but you\'re spending all day with clients, not setting up ring lights and writing captions.',
    painThem: [
      'Spend Sunday creating reels that get 12 likes',
      'Hire a social media manager for $1,500/mo',
      'Your expertise is invisible to Google',
      'No media kit, no credibility markers',
      'AI search engines don\'t know you exist'
    ],
    painUs: [
      'One conversation becomes a month of content',
      'One flat fee — $297, done',
      '5 clips that demonstrate your expertise naturally',
      'SEO profile your next client finds when they Google you',
      '10 social posts — a month of content, no ring light required',
      'Highlight reel that positions you as the expert',
      'Backlinks that boost your website\'s domain authority'
    ],
    deliverables: [
      { icon: 'fa-solid fa-microphone-lines', title: 'Live Expert Segment', desc: 'A real conversation about your methodology, your philosophy, and what makes you different — broadcast to a live daily audience.' },
      { icon: 'fa-solid fa-scissors', title: '5 Expertise Clips', desc: 'Short-form clips that show you coaching, advising, and delivering value — without a ring light or a script.' },
      { icon: 'fa-solid fa-pen-fancy', title: '10 Social Posts', desc: 'Pre-written posts for LinkedIn, Instagram, X — your voice, your message, ready to publish for the next month.' },
      { icon: 'fa-solid fa-file-lines', title: 'Full Transcript', desc: 'Repurpose into a lead magnet, a newsletter, an email sequence, or a blog post for your coaching website.' },
      { icon: 'fa-solid fa-globe', title: 'Coach Profile Page', desc: 'A permanent page that ranks for your name + your niche. The page your next client finds before your Instagram.' },
      { icon: 'fa-solid fa-film', title: 'Credibility Reel', desc: 'A polished highlight reel for your website, your linktree, or your coaching intake page. Social proof that works 24/7.' }
    ],
    ctaText: 'Book Your Expert Segment — $297',
    ctaSubtext: 'One client covers it. The content works for months.',
    closingTitle: 'Your expertise deserves<br><span class="gold">visibility.</span>',
    closingSub: 'Stop trading hours for content. Show up once, have a real conversation, and walk away with everything you need to be visible online for the next month.',
    metaTitle: 'Guest Engine for Coaches — Stop Creating. Start Being Seen.',
    metaDesc: 'One live conversation gives coaches a full content package — expertise clips, social posts, an SEO profile, and a credibility reel. $297 flat fee.'
  },
  {
    slug: 'founders',
    eyebrow: 'FOR FOUNDERS & ENTREPRENEURS',
    title: 'You\'re Building the Company.<br><span class="gold">We Build Your Profile.</span>',
    subtitle: 'One live appearance gives you press-grade content for your LinkedIn, your pitch deck, your investor updates, and your personal brand — without a PR agency retainer.',
    painTitle: 'Building something big.<br><span class="gold">Nobody\'s heard of you.</span>',
    painSub: 'You need press, credibility, and content. PR agencies want $5,000/month and a 6-month commitment. You need to look like you can afford that before you can afford that.',
    painThem: [
      'PR retainers: $3,000–$10,000/month',
      '6-month minimum commitments',
      'Months before your first placement',
      'No content from the appearance',
      'Zero ROI tracking'
    ],
    painUs: [
      'Guaranteed live appearance this month',
      'One flat fee — $297, no retainer',
      '5 clips for LinkedIn and investor updates',
      'SEO profile = your "as featured on" page',
      'Highlight reel for pitch decks and speaking',
      'Transcript for blog posts and thought leadership',
      'Backlinks that build your startup\'s domain authority'
    ],
    deliverables: [
      { icon: 'fa-solid fa-microphone-lines', title: 'Live Founder Spotlight', desc: 'Tell your founding story, your vision, and your market thesis to a live audience. Authentic, unscripted, real.' },
      { icon: 'fa-solid fa-scissors', title: '5 Founder Clips', desc: 'Short-form clips for LinkedIn, X, and investor updates — the kind of content that gets shared in Slack channels.' },
      { icon: 'fa-solid fa-pen-fancy', title: '10 Social Posts', desc: 'Pre-written thought leadership posts. Your insights, your voice — positioned for the platforms that matter for fundraising and recruitment.' },
      { icon: 'fa-solid fa-file-lines', title: 'Full Transcript', desc: 'Repurpose into a founding story blog post, a newsletter for your customers, or a narrative for your next fundraise.' },
      { icon: 'fa-solid fa-globe', title: 'Founder Profile Page', desc: 'A permanent page that ranks for your name + your company. The "as seen on" page that builds credibility with investors and partners.' },
      { icon: 'fa-solid fa-film', title: 'Pitch Reel', desc: 'A polished highlight reel for your pitch deck, your LinkedIn featured section, or your company\'s about page.' }
    ],
    ctaText: 'Book Your Founder Spotlight — $297',
    ctaSubtext: 'Less than one day of a PR retainer. Content that lasts months.',
    closingTitle: 'Your story is the<br><span class="gold">pitch.</span>',
    closingSub: 'Investors, partners, and customers buy founders before they buy products. Show up, tell your story, and walk away with the content that makes you unforgettable.',
    metaTitle: 'Guest Engine for Founders — Press-Grade Content Without the PR Retainer.',
    metaDesc: 'One live appearance gives founders clips, social posts, an SEO profile, and a pitch reel — no PR agency, no retainer. $297 flat fee.'
  },
  {
    slug: 'realestate',
    eyebrow: 'FOR REAL ESTATE PROFESSIONALS',
    title: 'Be the Agent<br><span class="gold">Everyone Already Knows.</span>',
    subtitle: 'One live appearance gives you a month of video content, an SEO profile that ranks in your market, and the credibility that makes sellers pick up the phone.',
    painTitle: 'Selling houses.<br><span class="gold">Invisible in your market.</span>',
    painSub: 'You\'re competing against 50 agents in your zip code who all look the same online. You need video content and local authority but you\'re too busy showing houses to create it.',
    painThem: [
      'Record a market update video nobody watches',
      'Pay a videographer $500 per shoot',
      'Your website doesn\'t rank for your own name',
      'No differentiation from every other agent',
      'Zillow and Realtor.com own your digital identity'
    ],
    painUs: [
      'One conversation = a month of local market content',
      'One flat fee — $297, done',
      '5 clips that position you as the local market expert',
      'SEO profile that ranks for "[Your Name] + [City] realtor"',
      '10 social posts tailored for real estate audiences',
      'Highlight reel for your listing presentations',
      'Backlinks that help your website outrank Zillow for your name'
    ],
    deliverables: [
      { icon: 'fa-solid fa-microphone-lines', title: 'Live Market Expert Segment', desc: 'Share your market insights, your approach to client relationships, and what makes your service different — broadcast live.' },
      { icon: 'fa-solid fa-scissors', title: '5 Market Authority Clips', desc: 'Short-form clips that position you as the go-to agent in your market. Perfect for Instagram, Facebook, and local community groups.' },
      { icon: 'fa-solid fa-pen-fancy', title: '10 Social Posts', desc: 'Pre-written posts for Facebook, Instagram, LinkedIn — designed for real estate audiences and local market visibility.' },
      { icon: 'fa-solid fa-file-lines', title: 'Full Transcript', desc: 'Turn your conversation into a market newsletter, a client email, or a blog post on your brokerage website.' },
      { icon: 'fa-solid fa-globe', title: 'Agent Profile Page', desc: 'A permanent page that ranks for your name + your market. The page buyers and sellers find before your brokerage bio.' },
      { icon: 'fa-solid fa-film', title: 'Listing Presentation Reel', desc: 'A polished highlight reel for your listing presentations, your website, or your next recruiting conversation.' }
    ],
    ctaText: 'Book Your Expert Segment — $297',
    ctaSubtext: 'One closing covers it. The content wins you the next 10 listings.',
    closingTitle: 'Own your market.<br><span class="gold">Online and off.</span>',
    closingSub: 'Stop being one of 50 agents who all look the same. Show up once, tell your story, and walk away with the content that makes you the obvious choice.',
    metaTitle: 'Guest Engine for Real Estate — Be the Agent Everyone Already Knows.',
    metaDesc: 'One live appearance gives real estate agents video clips, social posts, an SEO profile, and a listing presentation reel. $297 flat fee.'
  },
  {
    slug: 'podcasters',
    eyebrow: 'FOR PODCAST HOSTS',
    title: 'Grow Your Show<br><span class="gold">From Someone Else\'s Stage.</span>',
    subtitle: 'Appear as a guest on the MITL Live Network. Cross-promote your podcast, walk away with clips that promote your show, and experience the production stack that could power your next season.',
    painTitle: 'Great show.<br><span class="gold">Small audience.</span>',
    painSub: 'You\'re putting out episodes every week but growth is flat. You need exposure to new audiences — and the best way to grow a podcast is to be a guest on someone else\'s.',
    painThem: [
      'Guest on shows smaller than yours',
      'No content from the appearance',
      'Zero production support',
      'No cross-promotion strategy',
      'Same audience, no growth'
    ],
    painUs: [
      'Appear on a daily show with 1,000+ episodes',
      'One flat fee — $297',
      '5 clips that promote YOUR show to OUR audience',
      'Profile page that links directly to your podcast',
      'Cross-promotion to a live daily network',
      'Experience the ConversationOS production stack firsthand',
      'The guest experience IS the demo for hosting your own show'
    ],
    deliverables: [
      { icon: 'fa-solid fa-microphone-lines', title: 'Live Cross-Promotion Segment', desc: 'A full guest segment where you share your story, your show, and your expertise — broadcast to a daily audience that isn\'t yours yet.' },
      { icon: 'fa-solid fa-scissors', title: '5 Show Promo Clips', desc: 'Short-form clips designed to drive listeners to YOUR podcast. Optimized for every social platform.' },
      { icon: 'fa-solid fa-pen-fancy', title: '10 Social Posts', desc: 'Pre-written posts that promote both your appearance AND your own show. Dual-purpose content.' },
      { icon: 'fa-solid fa-file-lines', title: 'Full Transcript', desc: 'Repurpose into a newsletter, a collab recap post, or a behind-the-scenes thread about cross-promotion.' },
      { icon: 'fa-solid fa-globe', title: 'Podcaster Profile Page', desc: 'A permanent page linking to your show, your episodes, and your guest booking page. SEO juice that compounds.' },
      { icon: 'fa-solid fa-film', title: 'Sizzle Reel', desc: 'A highlight reel you can use to pitch yourself as a guest on other shows — or to recruit guests for your own.' }
    ],
    ctaText: 'Book Your Cross-Promotion Spot — $297',
    ctaSubtext: 'Grow your audience. Experience the production stack. See what\'s possible.',
    closingTitle: 'Your next 1,000 listeners<br><span class="gold">are in someone else\'s audience.</span>',
    closingSub: 'Stop posting episodes into the void. Show up on a stage that already has a crowd, and bring them back to yours.',
    metaTitle: 'Guest Engine for Podcasters — Grow Your Show From Someone Else\'s Stage.',
    metaDesc: 'Appear as a guest on the MITL Live Network. Get cross-promotion clips, a podcaster profile, and a production stack demo. $297 flat fee.'
  },
  {
    slug: 'consultants',
    eyebrow: 'FOR CONSULTANTS & FRACTIONAL EXECUTIVES',
    title: 'Your Next Client<br><span class="gold">Is Googling You Right Now.</span>',
    subtitle: 'One live conversation builds the thought leadership content that attracts your next engagement — clips for LinkedIn, an SEO profile that ranks, and a highlight reel that closes the deal before the intro call.',
    painTitle: 'World-class expertise.<br><span class="gold">No thought leadership.</span>',
    painSub: 'You\'re a fractional CMO, a strategy consultant, a senior advisor — but your digital presence doesn\'t reflect it. You need content that positions you as the authority, not just another profile on LinkedIn.',
    painThem: [
      'Write LinkedIn posts that feel forced',
      'Pay a ghostwriter $2,000/month',
      'Your Google results are thin',
      'No differentiation from other consultants',
      'Referrals dry up between engagements'
    ],
    painUs: [
      'One conversation = months of thought leadership content',
      'One flat fee — $297, no ghostwriter retainer',
      '5 clips that demonstrate strategic thinking on camera',
      'SEO profile that ranks for your name + your specialty',
      '10 LinkedIn-optimized posts from a real conversation',
      'Highlight reel for your consulting website or proposals',
      'Backlinks that build domain authority for your practice'
    ],
    deliverables: [
      { icon: 'fa-solid fa-microphone-lines', title: 'Live Thought Leadership Segment', desc: 'Share your frameworks, your market perspective, and your expertise in an authentic conversation — not a scripted webinar.' },
      { icon: 'fa-solid fa-scissors', title: '5 Strategy Clips', desc: 'Short-form clips that showcase your thinking. The kind of content that gets shared by CEOs and forwarded to boards.' },
      { icon: 'fa-solid fa-pen-fancy', title: '10 LinkedIn Posts', desc: 'Pre-written thought leadership posts extracted from your real insights. Your voice, your frameworks — positioned for B2B.' },
      { icon: 'fa-solid fa-file-lines', title: 'Full Transcript', desc: 'Turn your conversation into a white paper, a case study framework, a client newsletter, or a proposal appendix.' },
      { icon: 'fa-solid fa-globe', title: 'Consultant Profile Page', desc: 'A permanent page that ranks for your name + your practice area. The page that shows up when a potential client Googles you.' },
      { icon: 'fa-solid fa-film', title: 'Authority Reel', desc: 'A polished highlight reel for proposals, your website, or your LinkedIn featured section. Credibility on demand.' }
    ],
    ctaText: 'Book Your Strategy Segment — $297',
    ctaSubtext: 'One engagement covers it. The content attracts the next ten.',
    closingTitle: 'Stop waiting for<br><span class="gold">referrals.</span>',
    closingSub: 'Build the digital presence that attracts clients between engagements. Show up once, walk away with the thought leadership library that positions you as the obvious choice.',
    metaTitle: 'Guest Engine for Consultants — Thought Leadership Without the Ghostwriter.',
    metaDesc: 'One live conversation gives consultants LinkedIn clips, social posts, an SEO profile, and an authority reel. $297 flat fee.'
  }
];

function generatePage(v) {
  const deliverablesHtml = v.deliverables.map(d => `
        <div class="feature-card">
          <div class="feature-card__icon"><i class="${d.icon}"></i></div>
          <h3 class="feature-card__title">${d.title}</h3>
          <p class="feature-card__desc">${d.desc}</p>
        </div>`).join('');

  const painThemHtml = v.painThem.map(p => `            <li><i class="fa-solid fa-xmark"></i> ${p}</li>`).join('\n');
  const painUsHtml = v.painUs.map(p => `            <li><i class="fa-solid fa-check"></i> ${p}</li>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${v.metaTitle}</title>
  <meta name="description" content="${v.metaDesc}">
  <meta property="og:title" content="${v.metaTitle}">
  <meta property="og:description" content="${v.metaDesc}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://guestengine.live/${v.slug}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="../style.css">
  <link rel="stylesheet" href="../vertical.css">
</head>
<body>

  <nav class="nav" id="nav">
    <div class="nav__inner">
      <a href="/" class="nav__logo" aria-label="Guest Engine home">
        <svg class="nav__logo-icon" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="36" height="36" rx="6" fill="#fbbf24"/>
          <text x="8" y="26" font-family="Syncopate, sans-serif" font-weight="700" font-size="22" fill="#020617">G</text>
        </svg>
        <span class="nav__wordmark">Guest<strong>ENGINE</strong></span>
      </a>
      <div class="nav__links" id="navLinks">
        <a href="/#for-guests" class="nav__link">For Guests</a>
        <a href="/#for-hosts" class="nav__link">For Hosts</a>
        <a href="/#how-it-works" class="nav__link">How It Works</a>
        <a href="/#network" class="nav__link">Network</a>
      </div>
      <div class="nav__actions">
        <a href="https://ge.conversationos.live" class="nav__link nav__link--login">Log In</a>
        <a href="https://ge.conversationos.live" class="btn btn--primary btn--sm">Get Started</a>
      </div>
      <button class="nav__hamburger" id="navToggle" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <header class="hero hero--vertical">
    <div class="hero__bg">
      <div class="hero__placeholder">
        <div class="hero__placeholder-grid">
          <div class="hero__placeholder-cell"></div>
          <div class="hero__placeholder-cell hero__placeholder-cell--accent"></div>
          <div class="hero__placeholder-cell"></div>
          <div class="hero__placeholder-cell"></div>
          <div class="hero__placeholder-cell hero__placeholder-cell--accent"></div>
          <div class="hero__placeholder-cell"></div>
        </div>
      </div>
      <div class="hero__overlay"></div>
    </div>
    <div class="hero__content">
      <p class="hero__eyebrow">${v.eyebrow}</p>
      <h1 class="hero__title">${v.title}</h1>
      <p class="hero__sub">${v.subtitle}</p>
      <div class="hero__ctas">
        <a href="https://ge.conversationos.live" class="btn btn--primary btn--lg">${v.ctaText.split('—')[0].trim()} <span class="btn__arrow">&rarr;</span></a>
      </div>
    </div>
  </header>

  <section class="split">
    <div class="container">
      <p class="section__eyebrow">THE PROBLEM</p>
      <h2 class="section__title">${v.painTitle}</h2>
      <p class="section__sub">${v.painSub}</p>
      <div class="split__grid">
        <div class="card card--compare">
          <div class="card__badge card__badge--muted">WITHOUT GUEST ENGINE</div>
          <ul class="card__list card__list--muted">
${painThemHtml}
          </ul>
        </div>
        <div class="card card--compare card--compare-highlight">
          <div class="card__badge card__badge--gold">WITH GUEST ENGINE</div>
          <ul class="card__list card__list--gold">
${painUsHtml}
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--alt">
    <div class="container">
      <p class="section__eyebrow">WHAT YOU GET</p>
      <h2 class="section__title">One appearance. <span class="gold">Six deliverables.</span></h2>
      <p class="section__sub">Everything you need to be visible, credible, and everywhere — from a single conversation.</p>
      <div class="features__grid features__grid--3col">
${deliverablesHtml}
      </div>
      <div class="section__cta">
        <a href="https://ge.conversationos.live" class="btn btn--primary btn--lg">${v.ctaText} <span class="btn__arrow">&rarr;</span></a>
        <p class="section__cta-note">${v.ctaSubtext}</p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <p class="section__eyebrow">HOW IT WORKS</p>
      <h2 class="section__title">Four steps. <span class="gold">Zero friction.</span></h2>
      <div class="steps__grid">
        <div class="step">
          <div class="step__number">01</div>
          <div class="step__line"></div>
          <h3 class="step__title">Sign Up</h3>
          <p class="step__desc">Create your profile in under 3 minutes. Tell us about your expertise and what you want to talk about.</p>
        </div>
        <div class="step">
          <div class="step__number">02</div>
          <div class="step__line"></div>
          <h3 class="step__title">Get Prepped</h3>
          <p class="step__desc">Sophia, our AI producer, develops your talking points, topic angles, and a green room briefing before you go live.</p>
        </div>
        <div class="step">
          <div class="step__number">03</div>
          <div class="step__line"></div>
          <h3 class="step__title">Go Live</h3>
          <p class="step__desc">Show up for a real, unscripted conversation. Remote or in-studio. No teleprompter, no script — just you.</p>
        </div>
        <div class="step">
          <div class="step__number">04</div>
          <div class="step__line"></div>
          <h3 class="step__title">Get Produced</h3>
          <p class="step__desc">Within 48 hours: clips, posts, transcript, SEO profile, and highlight reel. Your content engine, activated.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--cta">
    <div class="container container--narrow">
      <h2 class="section__title section__title--center">${v.closingTitle}</h2>
      <p class="section__sub section__sub--center">${v.closingSub}</p>
      <div class="cta__buttons">
        <a href="https://ge.conversationos.live" class="btn btn--primary btn--lg">${v.ctaText} <span class="btn__arrow">&rarr;</span></a>
      </div>
    </div>
  </section>

  <footer class="footer">
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
          <p class="footer__tagline">Get booked. Get produced. Get everywhere.</p>
        </div>
        <div class="footer__col">
          <h4 class="footer__heading">For You</h4>
          <a href="/authors/" class="footer__link">Authors & Speakers</a>
          <a href="/coaches/" class="footer__link">Coaches & Mentors</a>
          <a href="/founders/" class="footer__link">Founders</a>
          <a href="/realestate/" class="footer__link">Real Estate</a>
          <a href="/podcasters/" class="footer__link">Podcasters</a>
          <a href="/consultants/" class="footer__link">Consultants</a>
        </div>
        <div class="footer__col">
          <h4 class="footer__heading">Network</h4>
          <a href="https://mitl.studio" class="footer__link" target="_blank" rel="noopener">MITL Studio</a>
          <a href="https://production.mitl.studio" class="footer__link" target="_blank" rel="noopener">Production</a>
          <a href="https://conversationos.live" class="footer__link" target="_blank" rel="noopener">ConversationOS</a>
        </div>
      </div>
      <div class="footer__bottom">
        <p>&copy; 2026 Guest Engine. A product of <a href="https://conversationos.live" target="_blank" rel="noopener">ConversationOS</a>.</p>
      </div>
    </div>
  </footer>

  <script src="../main.js"></script>
</body>
</html>`;
}

// Generate all pages
verticals.forEach(v => {
  const dir = path.join(__dirname, v.slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), generatePage(v));
  console.log(`Generated: /${v.slug}/index.html`);
});

console.log('Done — all vertical pages generated.');
