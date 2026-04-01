const fs = require('fs');
const path = require('path');

const verticals = [
  { dir: 'authors', label: 'Authors & Speakers', icon: 'fa-solid fa-book-open' },
  { dir: 'coaches', label: 'Coaches & Mentors', icon: 'fa-solid fa-hand-holding-heart' },
  { dir: 'founders', label: 'Founders', icon: 'fa-solid fa-rocket' },
  { dir: 'realestate', label: 'Real Estate', icon: 'fa-solid fa-building' },
  { dir: 'podcasters', label: 'Podcasters', icon: 'fa-solid fa-podcast' },
  { dir: 'consultants', label: 'Consultants', icon: 'fa-solid fa-briefcase' },
];

for (const current of verticals) {
  const filePath = path.join(__dirname, current.dir, 'index.html');
  let html = fs.readFileSync(filePath, 'utf8');

  // Build links for all OTHER verticals
  const links = verticals
    .filter(v => v.dir !== current.dir)
    .map(v => `        <a href="/${v.dir}/" class="crosslinks__link"><i class="${v.icon}"></i> ${v.label}</a>`)
    .join('\n');

  const crosslinkBlock = `
  <section class="crosslinks reveal">
    <div class="container">
      <p class="crosslinks__eyebrow">GUEST ENGINE IS ALSO FOR</p>
      <div class="crosslinks__grid">
${links}
      </div>
    </div>
  </section>

  <footer`;

  // Insert before the footer
  html = html.replace(/\n  <footer/, crosslinkBlock);

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✓ ${current.dir}/index.html — cross-links added`);
}
