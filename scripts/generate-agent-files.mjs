#!/usr/bin/env node
// =============================================================================
// generate-agent-files.mjs
// Build .md and .json companions + standalone transcript pages for every guest.
// Reads from app.conversationos.live/api/guest-marketplace and writes static
// files into /profile/<slug>.md, /profile/<slug>.json, /profile/<slug>/transcript/index.html
// Run: node scripts/generate-agent-files.mjs [slug1 slug2 ...]
// (no args = process all guests in the directory)
// =============================================================================

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const API = 'https://app.conversationos.live/api/guest-marketplace';
const SITE = 'https://guestengine.live';

async function fetchJson(url) {
  const r = await fetch(url);
  if (!r.ok) return null;
  return r.json();
}

function esc(s) { return String(s ?? '').replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

function paragraphs(text) {
  if (!text) return [];
  if (/\n\s*\n/.test(text)) return text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const sents = text.match(/[^.!?]+[.!?]+/g) || [text];
  const out = [];
  for (let i = 0; i < sents.length; i += 4) out.push(sents.slice(i, i + 4).join(' ').trim());
  return out;
}

function renderMd(profile, authority, visuals) {
  const name = profile.guestName || profile.authorityFullName || '';
  const headline = profile.headline || authority?.job_title || '';
  const bio = authority?.authority_bio || profile.publicBio || profile.bio || '';
  const insights = authority?.key_insights || [];
  const faqs = authority?.faqs || [];
  const knowsAbout = authority?.knows_about || [];
  const fullTranscript = authority?.full_transcript || '';
  const appearances = (() => { try { return JSON.parse(profile.pastAppearances || '[]'); } catch { return []; }})();
  const sameAs = (() => { try { return JSON.parse(profile.authoritySameAs || '[]'); } catch { return []; }})();

  let md = '';
  md += `# ${name}\n\n`;
  if (headline) md += `**${headline}**\n\n`;
  md += `> Authority Page on Guest Engine — produced by ConversationOS for the MITL Live Network.\n`;
  md += `> Source: ${SITE}/profile/${profile.slug}\n`;
  md += `> Markdown companion: ${SITE}/profile/${profile.slug}.md  ·  JSON: ${SITE}/profile/${profile.slug}.json\n\n`;

  if (bio) {
    md += `## Bio\n\n${bio}\n\n`;
  }

  if (insights.length) {
    md += `## Conversation Highlights\n\n`;
    insights.forEach(ins => {
      if (ins.topic) md += `### ${ins.topic}\n\n`;
      if (ins.quote) md += `> "${ins.quote}"\n\n`;
      if (ins.context) md += `${ins.context}\n\n`;
    });
  }

  if (faqs.length) {
    md += `## Frequently Asked\n\n`;
    faqs.forEach(f => {
      md += `### ${f.question}\n\n${f.answer}\n\n`;
    });
  }

  if (knowsAbout.length) {
    md += `## Areas of Expertise\n\n`;
    knowsAbout.forEach(k => { md += `- ${k}\n`; });
    md += '\n';
  }

  if (appearances.length) {
    md += `## Appearances\n\n`;
    appearances.forEach(a => {
      md += `- **${a.showName || 'MiTL Live Network'}** — ${a.segment || 'Guest Appearance'}`;
      if (a.date) md += ` (${a.date})`;
      if (a.link) md += ` — [Watch](${a.link})`;
      md += '\n';
    });
    md += '\n';
  }

  if (sameAs.length) {
    md += `## Verified Links\n\n`;
    sameAs.forEach(u => { md += `- ${u}\n`; });
    md += '\n';
  }

  if (fullTranscript) {
    md += `## Full Conversation Transcript\n\n_Edited for readability. Recorded live on Mornings in the Lab._\n\n`;
    paragraphs(fullTranscript).forEach(p => { md += `${p}\n\n`; });
  }

  md += `---\n\n`;
  md += `_This page is part of Guest Engine, the AI-discoverable podcast guest platform. To book ${name.split(' ')[0]} or any guest, see ${SITE}/join/_\n`;

  return md;
}

function renderJson(profile, authority, visuals) {
  const fullTranscript = authority?.full_transcript || '';
  let appearances = []; try { appearances = JSON.parse(profile.pastAppearances || '[]'); } catch {}
  let sameAs = []; try { sameAs = JSON.parse(profile.authoritySameAs || '[]'); } catch {}
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.guestName || profile.authorityFullName,
    jobTitle: authority?.job_title || profile.headline,
    description: authority?.authority_bio || profile.publicBio || profile.bio,
    url: `${SITE}/profile/${profile.slug}`,
    image: profile.headshotUrl || null,
    sameAs,
    knowsAbout: authority?.knows_about || [],
    guestEngine: {
      slug: profile.slug,
      tier: profile.tier,
      tierLabel: profile.tierLabel,
      episode: {
        number: profile.authorityEpisodeNumber || authority?.episode_number,
        title: profile.authorityEpisodeTitle || authority?.episode_title,
        segment: profile.authoritySegment || authority?.segment,
        videoId: profile.centerStageVideoId,
        videoUrl: profile.centerStageVideoId ? `https://www.youtube.com/watch?v=${profile.centerStageVideoId}` : null,
      },
      appearances,
      keyInsights: authority?.key_insights || [],
      faqs: authority?.faqs || [],
      conversationTopics: authority?.conversation_topics || [],
      pullQuotes: authority?.pull_quotes || [],
      fullTranscript,
      signalScore: {
        social: profile.signalSocial,
        reach: profile.signalReach,
        discourse: profile.signalDiscourse,
        authority: profile.signalAuthorityScore,
      },
    },
    booking: {
      contactUrl: `${SITE}/join/`,
      apiBookingEndpoint: `${API}/booking-intent`,
      pricing: { single: 497, member: 97, reachPro: 197, vip: 297 },
    },
  };
}

function renderTranscriptHtml(profile, authority) {
  const name = profile.guestName || profile.authorityFullName || '';
  const headline = profile.headline || authority?.job_title || '';
  const fullTranscript = authority?.full_transcript || '';
  const paras = paragraphs(fullTranscript);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(name)} — Full Conversation Transcript | Guest Engine</title>
<meta name="description" content="The full edited transcript of ${esc(name)}'s appearance on Mornings in the Lab — ${esc(headline)}.">
<link rel="canonical" href="${SITE}/profile/${profile.slug}/transcript/">
<link rel="alternate" type="text/markdown" href="${SITE}/profile/${profile.slug}.md" title="Markdown version for AI agents">
<link rel="alternate" type="application/json" href="${SITE}/profile/${profile.slug}.json" title="JSON version for AI agents">
<meta property="og:title" content="${esc(name)} — Full Conversation Transcript">
<meta property="og:description" content="${esc(headline)}">
<meta property="og:url" content="${SITE}/profile/${profile.slug}/transcript/">
<meta property="og:type" content="article">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@700;900&family=Inter:wght@400;500;600&display=swap">
<style>
:root { --bg:#020617; --card:rgba(255,255,255,0.03); --border:rgba(255,255,255,0.08); --text:#f1f5f9; --text-secondary:#cbd5e1; --text-muted:#94a3b8; --gold:#fbbf24; --font-display:'Cabinet Grotesk',sans-serif; }
* { box-sizing:border-box; }
body { margin:0; background:var(--bg); color:var(--text); font-family:'Inter',sans-serif; line-height:1.7; }
.t-container { max-width:760px; margin:0 auto; padding:80px 24px 96px; }
.t-back { font-family:var(--font-display); font-size:0.6rem; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:var(--text-muted); text-decoration:none; }
.t-back:hover { color:var(--gold); }
.t-eyebrow { margin-top:48px; font-family:var(--font-display); font-size:0.625rem; font-weight:700; letter-spacing:0.22em; text-transform:uppercase; color:var(--gold); }
.t-name { font-family:var(--font-display); font-weight:900; font-size:clamp(2rem,5vw,3.25rem); line-height:1; letter-spacing:-1px; text-transform:uppercase; margin:12px 0 16px; }
.t-headline { color:var(--text-secondary); font-size:1.0625rem; margin:0 0 8px; }
.t-meta { color:var(--text-muted); font-size:0.8125rem; }
.t-meta a { color:var(--text-secondary); text-decoration:none; border-bottom:1px solid var(--border); }
.t-meta a:hover { color:var(--gold); border-color:var(--gold); }
.t-body { margin-top:48px; padding-top:32px; border-top:1px solid var(--border); }
.t-body p { color:var(--text-secondary); font-size:1.0625rem; line-height:1.8; margin:0 0 1.25rem; }
.t-body p:first-child::first-letter { font-family:var(--font-display); font-weight:900; font-size:3.5rem; line-height:1; float:left; padding:8px 12px 0 0; color:var(--gold); }
.t-foot { margin-top:64px; padding-top:24px; border-top:1px solid var(--border); color:var(--text-muted); font-size:0.875rem; }
.t-foot a { color:var(--gold); text-decoration:none; }
.t-foot a:hover { text-decoration:underline; }
.t-cta { margin-top:32px; padding:24px; background:linear-gradient(135deg,rgba(255,255,255,0.02),rgba(251,191,36,0.05)); border:1px solid rgba(251,191,36,0.15); border-radius:12px; text-align:center; }
.t-cta__btn { display:inline-block; margin-top:8px; padding:10px 22px; background:var(--gold); color:var(--bg); font-family:var(--font-display); font-weight:700; font-size:0.625rem; letter-spacing:0.15em; text-transform:uppercase; border-radius:8px; text-decoration:none; }
.t-cta__btn:hover { background:#f59e0b; }
</style>
<script type="application/ld+json">
${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: `${name} — Full Conversation Transcript`,
  author: { '@type': 'Person', name: name },
  publisher: { '@type': 'Organization', name: 'Guest Engine', url: SITE },
  url: `${SITE}/profile/${profile.slug}/transcript/`,
  mainEntityOfPage: `${SITE}/profile/${profile.slug}/transcript/`,
  description: headline,
})}
</script>
</head>
<body>
<div class="t-container">
  <a class="t-back" href="/profile/${profile.slug}">&larr; Back to ${esc(name)}'s Authority Page</a>
  <div class="t-eyebrow">Mornings in the Lab · ${esc(profile.authoritySegment || authority?.segment || 'Center Stage')}</div>
  <h1 class="t-name">${esc(name)}</h1>
  <p class="t-headline">${esc(headline)}</p>
  <p class="t-meta">Full conversation transcript · <a href="/profile/${profile.slug}.md" rel="alternate">Markdown version</a> · <a href="/profile/${profile.slug}.json" rel="alternate">JSON version</a></p>
  <div class="t-body">
    ${paras.map(p => `<p>${esc(p)}</p>`).join('\n    ')}
  </div>
  <div class="t-cta">
    <p style="margin:0 0 8px;color:var(--text-secondary);font-size:0.9375rem;">Want a conversation like this on your Authority Page?</p>
    <a class="t-cta__btn" href="/join/">Get Featured &rarr;</a>
  </div>
  <div class="t-foot">
    Recorded live on Mornings in the Lab. Transcript edited for readability. <a href="${SITE}/profile/${profile.slug}">Return to the Authority Page</a>.
  </div>
</div>
</body>
</html>
`;
}

async function processSlug(slug) {
  console.log(`\n→ ${slug}`);
  const [profile, authority, visuals] = await Promise.all([
    fetchJson(`${API}/directory/${slug}`),
    fetchJson(`${API}/authority-data/${slug}`).catch(() => null),
    fetchJson(`${API}/authority-visuals/${slug}`).catch(() => null),
  ]);
  if (!profile || profile.error) {
    console.warn(`  ⚠ skip — no profile`);
    return false;
  }

  const md = renderMd(profile, authority, visuals);
  const json = renderJson(profile, authority, visuals);
  const html = renderTranscriptHtml(profile, authority);

  const mdPath = path.join(ROOT, 'profile', `${slug}.md`);
  const jsonPath = path.join(ROOT, 'profile', `${slug}.json`);
  const tDir = path.join(ROOT, 'profile', slug, 'transcript');

  await fs.writeFile(mdPath, md, 'utf8');
  await fs.writeFile(jsonPath, JSON.stringify(json, null, 2), 'utf8');
  await fs.mkdir(tDir, { recursive: true });
  await fs.writeFile(path.join(tDir, 'index.html'), html, 'utf8');

  console.log(`  ✓ ${slug}.md  ✓ ${slug}.json  ✓ ${slug}/transcript/`);
  return true;
}

async function main() {
  const slugs = process.argv.slice(2);
  if (slugs.length) {
    for (const s of slugs) await processSlug(s);
  } else {
    // Pull entire directory
    const all = [];
    for (let p = 1; p <= 10; p++) {
      const r = await fetchJson(`${API}/directory?page=${p}&limit=100`);
      if (!r || !r.guests || !r.guests.length) break;
      for (const g of r.guests) if (g.slug) all.push(g.slug);
      if (r.guests.length < 100) break;
    }
    console.log(`Processing ${all.length} guests...`);
    for (const s of all) await processSlug(s);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
