const fs = require('fs');
const path = require('path');

// === REUSABLE HTML BLOCKS ===

const sophiaWidget = `
  <!-- SOPHIA CHAT WIDGET -->
  <a href="https://ge.conversationos.live" class="sophia-fab" aria-label="Talk to Sophia, our AI producer">
    <div class="sophia-fab__icon"><i class="fa-solid fa-comments"></i></div>
    <span>Talk to Sophia</span>
    <div class="sophia-fab__pulse"></div>
  </a>
`;

const calculatorHTML = `
  <!-- CONTENT CALCULATOR -->
  <section class="calculator reveal" id="calculator">
    <div class="container">
      <p class="section__eyebrow">THE MATH</p>
      <h2 class="section__title">Stop making content. <span class="gold">Start showing up.</span></h2>
      <p class="section__sub">See how one 45-minute appearance replaces your entire content calendar.</p>
      <div class="calculator__grid">
        <div>
          <div class="calculator__input-group">
            <label class="calculator__label">Hours you spend on content each month</label>
            <div class="calculator__slider-wrap">
              <input type="range" class="calculator__slider" id="calcHours" min="1" max="60" value="20">
              <span class="calculator__value" id="calcHoursVal">20h</span>
            </div>
          </div>
          <div class="calculator__input-group">
            <label class="calculator__label">Your hourly rate (or what your time is worth)</label>
            <div class="calculator__slider-wrap">
              <input type="range" class="calculator__slider" id="calcRate" min="25" max="500" step="25" value="150">
              <span class="calculator__value" id="calcRateVal">$150</span>
            </div>
          </div>
        </div>
        <div class="calculator__results">
          <p class="calculator__results-title">YOUR CURRENT CONTENT COST</p>
          <div class="calculator__row">
            <span class="calculator__row-label">Monthly time investment</span>
            <span class="calculator__row-value" id="calcTimeVal">20 hours</span>
          </div>
          <div class="calculator__row">
            <span class="calculator__row-label">Monthly cost (your time)</span>
            <span class="calculator__row-value" id="calcCostVal">$3,000</span>
          </div>
          <div class="calculator__row">
            <span class="calculator__row-label">Annual content cost</span>
            <span class="calculator__row-value" id="calcAnnualVal">$36,000</span>
          </div>
          <div class="calculator__row calculator__row--highlight">
            <span class="calculator__row-label">One Guest Engine appearance</span>
            <span class="calculator__row-value">$497</span>
          </div>
          <div class="calculator__row calculator__row--highlight">
            <span class="calculator__row-label">Time investment</span>
            <span class="calculator__row-value">45 min</span>
          </div>
          <div class="calculator__row calculator__row--highlight">
            <span class="calculator__row-label">You save</span>
            <span class="calculator__row-value" id="calcSaveVal">$2,703/mo</span>
          </div>
        </div>
      </div>
    </div>
  </section>
`;

const packageHTML = `
  <!-- CONTENT PACKAGE VISUAL -->
  <section class="package reveal">
    <div class="container">
      <p class="section__eyebrow">YOUR CONTENT PACKAGE</p>
      <h2 class="section__title">This is what you walk away with. <span class="gold">All of it.</span></h2>
      <p class="section__sub">One appearance. Seven assets. Replace your entire content calendar.</p>
      <div class="package__grid">
        <div class="package__item package__item--wide">
          <div class="package__placeholder">
            <div class="package__placeholder-icon"><i class="fa-solid fa-microphone-lines"></i></div>
            <span class="package__placeholder-label">LIVE APPEARANCE</span>
            <span class="package__placeholder-desc">Full guest segment on a daily broadcast</span>
          </div>
        </div>
        <div class="package__item">
          <div class="package__placeholder">
            <div class="package__placeholder-icon"><i class="fa-solid fa-scissors"></i></div>
            <span class="package__placeholder-label">5 VIDEO CLIPS</span>
            <span class="package__placeholder-desc">Optimized for social</span>
          </div>
        </div>
        <div class="package__item">
          <div class="package__placeholder">
            <div class="package__placeholder-icon"><i class="fa-solid fa-pen-fancy"></i></div>
            <span class="package__placeholder-label">10 SOCIAL POSTS</span>
            <span class="package__placeholder-desc">Ready to publish</span>
          </div>
        </div>
        <div class="package__item">
          <div class="package__placeholder">
            <div class="package__placeholder-icon"><i class="fa-solid fa-file-lines"></i></div>
            <span class="package__placeholder-label">FULL TRANSCRIPT</span>
            <span class="package__placeholder-desc">Repurpose anywhere</span>
          </div>
        </div>
        <div class="package__item">
          <div class="package__placeholder">
            <div class="package__placeholder-icon"><i class="fa-solid fa-globe"></i></div>
            <span class="package__placeholder-label">SEO PROFILE PAGE</span>
            <span class="package__placeholder-desc">Indexed forever</span>
          </div>
        </div>
        <div class="package__item">
          <div class="package__placeholder">
            <div class="package__placeholder-icon"><i class="fa-solid fa-link"></i></div>
            <span class="package__placeholder-label">BACKLINKS</span>
            <span class="package__placeholder-desc">Boost domain authority</span>
          </div>
        </div>
        <div class="package__item">
          <div class="package__placeholder">
            <div class="package__placeholder-icon"><i class="fa-solid fa-film"></i></div>
            <span class="package__placeholder-label">HIGHLIGHT REEL</span>
            <span class="package__placeholder-desc">For your media kit</span>
          </div>
        </div>
      </div>
      <div class="section__cta" style="margin-top: 2rem;">
        <a href="/profile/sample/" class="btn btn--outline">See a Sample Guest Profile <span class="btn__arrow">&rarr;</span></a>
      </div>
    </div>
  </section>
`;

const calcScript = `
  <script>
  // Content Calculator
  (function() {
    const hours = document.getElementById('calcHours');
    const rate = document.getElementById('calcRate');
    if (!hours || !rate) return;
    function update() {
      const h = parseInt(hours.value);
      const r = parseInt(rate.value);
      const monthly = h * r;
      const annual = monthly * 12;
      const save = monthly - 497;
      document.getElementById('calcHoursVal').textContent = h + 'h';
      document.getElementById('calcRateVal').textContent = '$' + r;
      document.getElementById('calcTimeVal').textContent = h + ' hours';
      document.getElementById('calcCostVal').textContent = '$' + monthly.toLocaleString();
      document.getElementById('calcAnnualVal').textContent = '$' + annual.toLocaleString();
      document.getElementById('calcSaveVal').textContent = '$' + Math.max(0, save).toLocaleString() + '/mo';
    }
    hours.addEventListener('input', update);
    rate.addEventListener('input', update);
    update();
  })();
  </script>
`;

// === PROCESS HOMEPAGE ===
const homePath = path.join(__dirname, 'index.html');
let home = fs.readFileSync(homePath, 'utf8');

// Add Sophia widget before </body>
if (!home.includes('sophia-fab')) {
  home = home.replace('</body>', sophiaWidget + '\n</body>');
}

// Add calculator + package after "How It Works" section (before Network section)
if (!home.includes('calculator reveal')) {
  home = home.replace(
    '  <section class="section" id="network">',
    calculatorHTML + '\n' + packageHTML + '\n  <section class="section" id="network">'
  );
}

// Add calculator script before </body>
if (!home.includes('calcHours')) {
  // already added via calculatorHTML, just need the script
}
home = home.replace('</body>', calcScript + '\n</body>');

// Add pricing to homepage hero
if (!home.includes('hero__pricing')) {
  home = home.replace(
    '      <div class="hero__stats">',
    '      <p class="hero__pricing"><strong>$497</strong> — one appearance, everything included</p>\n      <div class="hero__stats">'
  );
}

fs.writeFileSync(homePath, home, 'utf8');
console.log('✓ index.html — all upgrades added');

// === PROCESS VERTICALS ===
const verticals = ['authors', 'coaches', 'founders', 'realestate', 'podcasters', 'consultants'];

for (const dir of verticals) {
  const filePath = path.join(__dirname, dir, 'index.html');
  let html = fs.readFileSync(filePath, 'utf8');

  // Add Sophia widget
  if (!html.includes('sophia-fab')) {
    html = html.replace('</body>', sophiaWidget + '\n</body>');
  }

  // Add calculator + package before the final CTA section
  if (!html.includes('calculator reveal')) {
    html = html.replace(
      '  <section class="section section--cta">',
      calculatorHTML + '\n' + packageHTML + '\n  <section class="section section--cta">'
    );
  }

  // Add calculator script
  if (!html.includes('calcHours') || !html.includes('update()')) {
    html = html.replace('</body>', calcScript + '\n</body>');
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✓ ${dir}/index.html — all upgrades added`);
}
