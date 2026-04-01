const fs = require('fs');
const path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'optimization-data.json'), 'utf8'));

const verticals = ['authors', 'coaches', 'founders', 'realestate', 'podcasters', 'consultants'];
const dirToKey = { authors: 'authors', coaches: 'coaches', founders: 'founders', realestate: 'realestate', podcasters: 'podcasters', consultants: 'consultants' };

for (const dir of verticals) {
  const key = dirToKey[dir];
  const d = data[key];
  const filePath = path.join(__dirname, dir, 'index.html');
  let html = fs.readFileSync(filePath, 'utf8');

  // Build the correct pricecomp HTML
  const priceRows = d.price_anchor.rows.map(row => {
    const cls = row.highlight ? ' pricecomp__row--highlight' : '';
    return `          <div class="pricecomp__row${cls}">
            <span class="pricecomp__label">${row.label}</span>
            <span class="pricecomp__value">${row.value}</span>
          </div>`;
  }).join('\n');

  const correctPriceHTML = `  <!-- PRICE COMPARISON -->
  <section class="pricecomp reveal">
    <div class="container">
      <p class="section__eyebrow">${d.price_anchor.title}</p>
      <h2 class="section__title">Compare the <span class="gold">investment.</span></h2>
      <div class="pricecomp__table">
${priceRows}
      </div>
    </div>
  </section>`;

  // Find and replace the broken pricecomp section
  // Match from <!-- PRICE COMPARISON --> to the closing </section> of pricecomp
  const priceStart = html.indexOf('<!-- PRICE COMPARISON -->');
  if (priceStart === -1) {
    console.log(`⏭  ${dir} — no price comparison found`);
    continue;
  }

  // Find the next section after pricecomp (could be section--alt for What You Get, or faq, etc.)
  // The pricecomp section should end with </section> then whitespace then the next section
  // Since the HTML is corrupted, we need to find the pattern more carefully
  
  // Find all content from PRICE COMPARISON until we hit the "WHAT YOU GET" or "One appearance" section
  // Actually, let's just find from <!-- PRICE COMPARISON --> to the next <!-- that isn't part of pricecomp
  
  // Simpler approach: find the section--alt that comes after the pricecomp
  const afterPrice = html.indexOf('<section class="section section--alt">', priceStart);
  
  if (afterPrice === -1) {
    console.log(`⚠  ${dir} — couldn't find section after pricecomp`);
    continue;
  }

  // Replace everything from PRICE COMPARISON to just before section--alt
  const before = html.substring(0, priceStart);
  const after = html.substring(afterPrice);
  
  html = before + correctPriceHTML + '\n\n  ' + after;

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✓ ${dir}/index.html — pricecomp fixed`);
}
