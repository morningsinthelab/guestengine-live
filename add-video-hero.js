const fs = require('fs');
const path = require('path');

const verticals = ['authors', 'coaches', 'founders', 'realestate', 'podcasters', 'consultants'];

const oldBg = `    <div class="hero__bg">
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
    </div>`;

const newBg = `    <div class="hero__bg">
      <!-- HERO VIDEO: Replace src with your produced hero-video.mp4 -->
      <video class="hero__video" autoplay muted loop playsinline poster="/assets/hero-poster.jpg">
        <source src="/assets/hero-video.mp4" type="video/mp4">
      </video>
      <!-- Fallback: shown while video loads or if video fails -->
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
    </div>`;

for (const dir of verticals) {
  const filePath = path.join(__dirname, dir, 'index.html');
  let html = fs.readFileSync(filePath, 'utf8');
  
  if (html.includes('hero__video')) {
    console.log(`⏭  ${dir} — already has video`);
    continue;
  }
  
  if (html.includes(oldBg)) {
    html = html.replace(oldBg, newBg);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✓ ${dir}/index.html — video placeholder added`);
  } else {
    console.log(`⚠  ${dir} — placeholder pattern not found, skipping`);
  }
}
