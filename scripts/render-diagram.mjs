import fs from 'node:fs';
const esc = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
const text = (x, y, value, size = 19, color = '#263e50', weight = 400) =>
 `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}">${esc(value)}</text>`;
function box(x, y, w, title, lines, status, pending = false) {
 return `<g><rect x="${x}" y="${y}" width="${w}" height="146" rx="12" fill="white" stroke="#adc2cb"/>` +
  text(x + 18, y + 32, title, 22, '#143a50', 700) +
  lines.map((s, i) => text(x + 18, y + 63 + i * 25, s, w < 300 ? 17 : 19)).join('') +
  text(x + 18, y + 124, status, 17, pending ? '#864414' : '#17604b', 700) + '</g>';
}
const arrow = (d, both = false) => `<path d="${d}" stroke="#48677c" stroke-width="2.5" fill="none" marker-end="url(#arrow)"${both ? ' marker-start="url(#arrow)"' : ''}/>`;
let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1300 1080" role="img" aria-labelledby="title desc">
<title id="title">FirmLens: code, website, database and AI</title>
<desc id="desc">GitHub stores code and proposed changes. James reviews changes; automated checks verify the build; Vercel hosts the replacement website and server. A visitor's browser asks the server for saved records in Neon Postgres. The server fetches known official sources, checks the owner's identity through Neon Auth, and exchanges evidence and analysis with ChatGPT or Codex through authenticated tools. AI does not run when a visitor reads a card. The replacement is on firmlens-beta.vercel.app; firmlens.app still serves the original app. AI connections are approved but a new cloud update is untested, and the weekly task is paused.</desc>
<defs><marker id="arrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto-start-reverse"><path d="M1 1 L8 4.5 L1 8" fill="none" stroke="#48677c" stroke-width="1.5"/></marker></defs>
<rect width="1300" height="1080" fill="#f4f7f8"/><g font-family="Arial,sans-serif">`;
svg += text(40, 49, 'FirmLens · how the pieces fit together', 34, '#143a50', 700);
svg += text(40, 83, 'Verified 7 November 2026 · replacement: firmlens-beta.vercel.app', 21);
svg += text(40, 113, 'Public address firmlens.app still serves the original app; domain switch is pending.', 19, '#864414');
svg += text(40, 160, '1  HOW A CHANGE BECOMES A WEBSITE', 19, '#143a50', 700);
svg += box(40, 180, 275, 'GitHub', ['Code and its history', 'Your branch and pull request'], 'Public repository');
svg += box(355, 180, 275, 'James reviews', ['What changed and why?', 'Approve before merging'], 'Review required on main');
svg += box(670, 180, 275, 'Automated checks', ['Tests, types and build', 'Same verification command'], 'Checks pass on current main');
svg += box(985, 180, 275, 'Vercel', ['Builds the approved code', 'Hosts website and server'], 'Replacement deployed');
svg += arrow('M315 253H350') + arrow('M630 253H665') + arrow('M945 253H980');
svg += text(40, 380, '2  WHAT HAPPENS WHEN SOMEONE USES IT', 19, '#143a50', 700);
svg += box(40, 420, 350, 'Visitor’s browser', ['Search, filters and source links', 'Reads saved summaries/history'], 'Public · no login required');
svg += box(475, 420, 350, 'Next.js server on Vercel', ['API: requests and responses', 'Permission and evidence checks'], 'Public reads / owner refresh tested');
svg += box(910, 420, 350, 'Neon Postgres database', ['Announcements and source text', 'Summaries and checking history'], 'Original data restored and checked');
svg += arrow('M390 489H470', true) + arrow('M825 489H905', true);
svg += text(400, 413, 'reads', 16) + text(834, 413, 'stores', 16);
svg += text(40, 620, '3  HOW RECORDS ARE CHECKED AND UPDATED', 19, '#143a50', 700);
svg += box(40, 710, 350, 'Official source pages', ['Server fetches known firm URLs', 'Keeps a copy of retrieved text'], 'Some sources block fetching', true);
svg += box(475, 710, 350, 'ChatGPT / Codex account', ['Tools return evidence to the AI', 'AI sends a summary and quote'], 'Connected · cloud update untested', true);
svg += box(910, 710, 350, 'Neon Auth', ['Google owner sign-in and OAuth', 'Server allows only James to edit'], 'Browser owner sign-in tested');
svg += arrow('M215 705V670H515V571', true);
svg += arrow('M650 705V571', true);
svg += arrow('M1085 705V670H785V571');
svg += text(45, 650, 'Fetch source / return text', 17);
svg += text(666, 695, 'Evidence / analysis', 17);
svg += text(945, 698, 'Verify identity', 17);
svg += '<rect x="40" y="890" width="1220" height="72" rx="10" fill="#fff3df" stroke="#b68341"/>';
svg += text(58, 920, 'Weekly cloud task — PAUSED during migration', 21, '#75400f', 700);
svg += text(58, 948, 'Still needs to use the new connection and complete a real run. A saved schedule is not proof of a successful update.', 18, '#75400f');
svg += text(40, 1005, 'Reading a card does not call an LLM. The AI works through the owner’s account; the app has no model API key.', 19);
svg += text(40, 1042, 'A matching quotation proves the words occur in the source. It does not prove every claim in the summary.', 19);
svg += '</g></svg>';
const target = 'homework/images/architecture.svg';
if (process.argv.includes('--check')) {
 if (fs.readFileSync(target, 'utf8') !== svg) throw new Error('Architecture SVG is stale; run node scripts/render-diagram.mjs');
 console.log('Architecture SVG matches its source.');
} else fs.writeFileSync(target, svg);
