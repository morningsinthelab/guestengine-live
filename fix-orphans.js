const fs = require('fs');
const path = require('path');

const verticals = ['authors', 'coaches', 'founders', 'realestate', 'podcasters', 'consultants'];

for (const dir of verticals) {
  const filePath = path.join(__dirname, dir, 'index.html');
  let html = fs.readFileSync(filePath, 'utf8');
  const originalLength = html.length;

  // Remove orphaned broken section tags that contain partial price data
  // These look like: <section class="section section--alt">8,000</span>
  // or: <section class="section section--alt">,500–$3,000/mo</span>
  // Pattern: <section class="section section--alt"> followed by text that is NOT valid section content
  // Valid section--alt starts with whitespace then <div class="container">
  
  // Remove lines that have section--alt followed by price fragments or partial content
  const lines = html.split('\n');
  const cleanLines = [];
  let skipUntilValidSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect broken section--alt lines (contain price fragments, closing spans, etc.)
    if (line.match(/<section class="section section--alt">[^<\s]/) || 
        line.match(/<section class="section section--alt">,/) ||
        line.match(/<section class="section section--alt">\d/)) {
      // This is a broken orphan line — skip it
      console.log(`  Removing orphan line ${i + 1}: ${line.trim().substring(0, 80)}`);
      continue;
    }
    
    // Also remove orphaned </div> and </span> that follow broken sections
    // These are lines with just closing tags that don't match any opener
    if (skipUntilValidSection && line.trim().match(/^<\/div>$|^<\/span>$/)) {
      console.log(`  Removing orphan closer line ${i + 1}: ${line.trim()}`);
      continue;
    }
    
    skipUntilValidSection = false;
    cleanLines.push(line);
  }
  
  html = cleanLines.join('\n');
  
  // Also clean up any orphaned closing tags that got left behind
  // Remove empty </span></div> combos that are floating between sections
  html = html.replace(/\n\s*<\/span>\s*\n\s*<\/div>\s*\n(?=\s*<section)/g, '\n');
  
  // Remove double blank lines
  html = html.replace(/\n{4,}/g, '\n\n');
  
  if (html.length !== originalLength) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✓ ${dir}/index.html — cleaned ${originalLength - html.length} bytes of orphan HTML`);
  } else {
    console.log(`⏭  ${dir} — no orphans found`);
  }
}
