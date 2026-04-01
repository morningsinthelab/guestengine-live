const fs = require('fs');
const path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'optimization-data.json'), 'utf8'));

const verticals = ['authors', 'coaches', 'founders', 'realestate', 'podcasters', 'consultants'];
const dirToKey = { authors: 'authors', coaches: 'coaches', founders: 'founders', realestate: 'realestate', podcasters: 'podcasters', consultants: 'consultants' };

// CSS for new sections (append to vertical.css)
const newCSS = `
/* --- WHO THIS IS FOR --- */
.whoisfor {
  padding: clamp(4rem, 8vw, 6rem) 0;
  border-top: 1px solid var(--border);
}

.whoisfor__list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.whoisfor__item {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  font-size: 0.875rem;
  color: var(--text-body);
  line-height: 1.55;
}

.whoisfor__item i {
  color: var(--gold);
  margin-top: 0.2rem;
  font-size: 0.75rem;
  flex-shrink: 0;
}

/* --- PRICE COMPARISON --- */
.pricecomp {
  padding: clamp(4rem, 8vw, 6rem) 0;
}

.pricecomp__table {
  max-width: 600px;
  margin-top: 1.5rem;
}

.pricecomp__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.pricecomp__row:last-child { border-bottom: none; }

.pricecomp__label {
  font-size: 0.9375rem;
  color: var(--text-body);
}

.pricecomp__value {
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-muted);
  text-align: right;
}

.pricecomp__row--highlight {
  margin-top: 0.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--gold-dim);
  border-bottom: none;
}

.pricecomp__row--highlight .pricecomp__label {
  font-weight: 600;
  color: var(--text-primary);
}

.pricecomp__row--highlight .pricecomp__value {
  font-size: 1.125rem;
  color: var(--gold);
}

/* --- FAQ ACCORDION --- */
.faq {
  padding: clamp(5rem, 10vw, 8rem) 0;
  background: var(--bg-alt);
}

.faq__list {
  max-width: 740px;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.faq__item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.faq__question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.125rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  transition: background 0.2s var(--ease);
}

.faq__question:hover { background: rgba(255, 255, 255, 0.02); }

.faq__question i {
  color: var(--gold);
  font-size: 0.75rem;
  transition: transform 0.2s var(--ease);
  flex-shrink: 0;
  margin-left: 1rem;
}

.faq__item.active .faq__question i { transform: rotate(180deg); }

.faq__answer {
  padding: 0 1.5rem 1.25rem;
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.7;
  display: none;
}

.faq__item.active .faq__answer { display: block; }

/* --- PROFILE PREVIEW --- */
.profilepreview {
  padding: clamp(4rem, 8vw, 6rem) 0;
  text-align: center;
}

.profilepreview__card {
  max-width: 700px;
  margin: 1.5rem auto 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 2rem;
  display: flex;
  gap: 1.5rem;
  align-items: center;
  text-align: left;
  transition: all 0.3s var(--ease);
}

.profilepreview__card:hover {
  border-color: rgba(251, 191, 36, 0.3);
  transform: translateY(-2px);
}

.profilepreview__avatar {
  width: 80px;
  height: 80px;
  min-width: 80px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--bg-alt), rgba(251, 191, 36, 0.08));
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gold);
}

.profilepreview__info h4 {
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary);
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.profilepreview__info p {
  font-size: 0.8125rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.profilepreview__tags {
  display: flex;
  gap: 0.375rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.profilepreview__tag {
  font-family: var(--font-display);
  font-size: 0.5rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.2rem 0.5rem;
  background: var(--gold-dim);
  color: var(--gold);
  border-radius: var(--radius-sm);
}

@media (max-width: 768px) {
  .whoisfor__list { grid-template-columns: 1fr; }
  .profilepreview__card { flex-direction: column; text-align: center; }
}
`;

// Append CSS
const vertCSS = path.join(__dirname, 'vertical.css');
let css = fs.readFileSync(vertCSS, 'utf8');
if (!css.includes('whoisfor')) {
  css += newCSS;
  fs.writeFileSync(vertCSS, css, 'utf8');
  console.log('✓ vertical.css — new section styles added');
}

// FAQ accordion JS
const faqJS = `
// FAQ Accordion
document.querySelectorAll('.faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const wasActive = item.classList.contains('active');
    // Close all
    document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('active'));
    // Toggle current
    if (!wasActive) item.classList.add('active');
  });
});
`;

for (const dir of verticals) {
  const key = dirToKey[dir];
  const d = data[key];
  const filePath = path.join(__dirname, dir, 'index.html');
  let html = fs.readFileSync(filePath, 'utf8');

  // Skip if already injected
  if (html.includes('whoisfor')) {
    console.log(`⏭  ${dir} — already has optimizations`);
    continue;
  }

  // === BUILD HTML BLOCKS ===

  // 1. "Who This Is For" section
  const whoItems = d.who_for.items.map(item =>
    `          <div class="whoisfor__item"><i class="fa-solid fa-circle-check"></i> ${item}</div>`
  ).join('\n');

  const whoHTML = `
  <!-- WHO THIS IS FOR -->
  <section class="whoisfor reveal">
    <div class="container">
      <p class="section__eyebrow">${d.who_for.title}</p>
      <div class="whoisfor__list">
${whoItems}
      </div>
    </div>
  </section>`;

  // 2. Price comparison section
  const priceRows = d.price_anchor.rows.map(row => {
    const cls = row.highlight ? ' pricecomp__row--highlight' : '';
    return `          <div class="pricecomp__row${cls}">
            <span class="pricecomp__label">${row.label}</span>
            <span class="pricecomp__value">${row.value}</span>
          </div>`;
  }).join('\n');

  const priceHTML = `
  <!-- PRICE COMPARISON -->
  <section class="pricecomp reveal">
    <div class="container">
      <p class="section__eyebrow">${d.price_anchor.title}</p>
      <h2 class="section__title">Compare the <span class="gold">investment.</span></h2>
      <div class="pricecomp__table">
${priceRows}
      </div>
    </div>
  </section>`;

  // 3. FAQ section
  const faqItems = d.faqs.map(faq =>
    `          <div class="faq__item">
            <button class="faq__question">${faq.q} <i class="fa-solid fa-chevron-down"></i></button>
            <div class="faq__answer">${faq.a}</div>
          </div>`
  ).join('\n');

  const faqHTML = `
  <!-- FAQ -->
  <section class="faq reveal">
    <div class="container">
      <p class="section__eyebrow">FREQUENTLY ASKED QUESTIONS</p>
      <h2 class="section__title">Everything you need <span class="gold">to know.</span></h2>
      <div class="faq__list">
${faqItems}
      </div>
    </div>
  </section>`;

  // 4. Profile preview section
  const profileHTML = `
  <!-- PROFILE PREVIEW -->
  <section class="profilepreview reveal">
    <div class="container container--narrow">
      <p class="section__eyebrow">SEE THE PRODUCT</p>
      <h2 class="section__title section__title--center">This is what your <span class="gold">profile looks like.</span></h2>
      <p class="section__sub section__sub--center">Every guest gets a permanent, SEO-indexed profile page. Here's a sample.</p>
      <a href="/profile/sample/" class="profilepreview__card">
        <div class="profilepreview__avatar">SC</div>
        <div class="profilepreview__info">
          <h4>Sarah Chen</h4>
          <p>Entrepreneur, Author, 3x Founder — featured on Mornings in the Lab</p>
          <div class="profilepreview__tags">
            <span class="profilepreview__tag">VIDEO</span>
            <span class="profilepreview__tag">CLIPS</span>
            <span class="profilepreview__tag">SEO</span>
            <span class="profilepreview__tag">INDEXED</span>
          </div>
        </div>
      </a>
      <div class="section__cta" style="margin-top: 1.5rem;">
        <a href="/profile/sample/" class="btn btn--outline btn--sm">View Sample Profile <span class="btn__arrow">&rarr;</span></a>
      </div>
    </div>
  </section>`;

  // 5. FAQ Schema (JSON-LD)
  const faqSchemaItems = d.faqs.map(faq => `    {
      "@type": "Question",
      "name": "${faq.q.replace(/"/g, '\\"')}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "${faq.a.replace(/"/g, '\\"')}"
      }
    }`).join(',\n');

  const faqSchema = `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
${faqSchemaItems}
    ]
  }
  </script>`;

  // === INJECT INTO HTML ===

  // Insert who-for + price comparison after the "split" (problem) section
  html = html.replace(
    /(<\/section>\s*\n\s*<section class="section section--alt">)/,
    whoHTML + '\n' + priceHTML + '\n$1'
  );

  // Insert FAQ + profile preview before the calculator
  html = html.replace(
    /(\s*<!-- CONTENT CALCULATOR -->)/,
    faqHTML + '\n' + profileHTML + '\n$1'
  );

  // Add FAQ schema before </head>
  html = html.replace('</head>', faqSchema + '\n</head>');

  // Add FAQ accordion JS before </body>
  if (!html.includes('faq__question')) {
    // Already in the HTML from the faqHTML block
  }
  html = html.replace('</body>', `  <script>${faqJS}</script>\n</body>`);

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✓ ${dir}/index.html — all optimizations injected`);
}

console.log('\\nDone. All optimizations injected.');
