const fs = require('fs');
const path = require('path');

const verticals = ['authors', 'coaches', 'founders', 'realestate', 'podcasters', 'consultants'];

for (const dir of verticals) {
  const filePath = path.join(__dirname, dir, 'index.html');
  let html = fs.readFileSync(filePath, 'utf8');
  const before = html.length;

  // Strategy: Find the GOOD pricecomp section (ends with </section>)
  // Then remove everything between that </section> and the next real section
  // The orphan content sits between the end of the good pricecomp and <section class="section section--alt">
  
  // Find the good pricecomp closing
  const goodPriceEnd = html.indexOf('</section>', html.indexOf('pricecomp__row--highlight'));
  if (goodPriceEnd === -1) continue;
  
  const afterGoodPrice = goodPriceEnd + '</section>'.length;
  
  // Find the next legitimate section (section--alt for "What You Get")
  const nextSection = html.indexOf('<section class="section section--alt">', afterGoodPrice);
  if (nextSection === -1) continue;
  
  // Check if there's orphan content between them
  const between = html.substring(afterGoodPrice, nextSection);
  
  // If the between content has pricecomp rows or orphan closing tags, it's garbage
  if (between.includes('pricecomp__row') || between.includes('</section>') || between.match(/\$\d+/)) {
    html = html.substring(0, afterGoodPrice) + '\n\n  ' + html.substring(nextSection);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✓ ${dir}/index.html — removed ${before - html.length} bytes of duplicate content`);
  } else {
    console.log(`✓ ${dir}/index.html — clean`);
  }
}
