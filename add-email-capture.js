const fs = require('fs');
const path = require('path');

const verticals = [
  { dir: 'authors', title: 'Not ready to book?', gold: 'Get the Author Playbook.', desc: 'A free guide for authors — how to leverage one live appearance into a full content engine for your book launch, speaking career, and newsletter.' },
  { dir: 'coaches', title: 'Not ready to book?', gold: 'Get the Coach Playbook.', desc: 'A free guide for coaches — how to turn one conversation into a month of content that attracts clients while you work with clients.' },
  { dir: 'founders', title: 'Not ready to book?', gold: 'Get the Founder Playbook.', desc: 'A free guide for founders — how to build press-grade content for your LinkedIn, pitch deck, and investor updates without a PR agency.' },
  { dir: 'realestate', title: 'Not ready to book?', gold: 'Get the Agent Playbook.', desc: 'A free guide for agents — how to build local authority, rank in your market, and turn one conversation into a month of listing content.' },
  { dir: 'podcasters', title: 'Not ready to book?', gold: 'Get the Host Playbook.', desc: 'A free guide for podcast hosts — how to grow your show through cross-promotion, guest swaps, and the MITL production stack.' },
  { dir: 'consultants', title: 'Not ready to book?', gold: 'Get the Consultant Playbook.', desc: 'A free guide for consultants — how to build authority content that attracts your next engagement without writing a single post.' },
];

for (const v of verticals) {
  const filePath = path.join(__dirname, v.dir, 'index.html');
  let html = fs.readFileSync(filePath, 'utf8');

  if (html.includes('capture reveal')) {
    console.log(`⏭  ${v.dir} — already has capture`);
    continue;
  }

  const captureBlock = `
  <!-- EMAIL CAPTURE -->
  <section class="capture reveal">
    <div class="container">
      <div class="capture__inner">
        <div class="capture__text">
          <h3 class="capture__title">${v.title} <span class="gold">${v.gold}</span></h3>
          <p class="capture__desc">${v.desc}</p>
        </div>
        <form class="capture__form" action="/join/" method="GET">
          <input type="email" class="capture__input" placeholder="Enter your email" required aria-label="Email address">
          <button type="submit" class="btn btn--primary">Get the Playbook <span class="btn__arrow">&rarr;</span></button>
        </form>
      </div>
    </div>
  </section>

  <section class="crosslinks`;

  // Insert before the crosslinks section
  html = html.replace(/\n  <section class="crosslinks/, captureBlock);

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✓ ${v.dir}/index.html — email capture added`);
}
