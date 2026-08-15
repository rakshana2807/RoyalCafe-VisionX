const fs = require('fs');

let raw = fs.readFileSync('spaces_dump.json', 'utf16le');
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
const data = JSON.parse(raw);

const req = [
  '#O01-1','#O02-1','#O03-1','#O04-1',
  '#Q01-1','#Q02-1','#Q03-1','#Q04-1','#Q05-1','#Q06-1','#Q07-1','#Q08-1',
  '#Q01-2','#Q02-2','#Q03-2','#Q04-2','#Q05-2','#Q06-2','#Q07-2','#Q08-2',
  '#O01-2','#O02-2','#O03-2','#O04-2','#O05-2','#O06-2','#O07-2','#O08-2',
  '#A1-8','#A2-8','#A3-8','#A4',
  '#OL01-15',
  '#Q01-6','#Q02-6','#Q03-6',
  '#S01-10','#S02-10','#S03-10','#S04-10','#S05-10',
  '#S01-4','#S02-4','#S03-4','#S04-4',
  '#S09-1','#S10-1','#S11-1','#S12-1','#S13-1','#S14-1','#S15-1','#S16-1',
  '#IL02-15',
  '#K01-2','#K02-2','#K03-2','#K04-2','#K05-2','#K06-2',
  '#E01-2','#E02-2','#E03-2','#E04-2','#E05-2','#E06-2'
];

let md = '# RoyalCafe Spaces Database Inspection\n\n';

const present = new Set();
const dups = new Set();

data.forEach(s => {
  const c = s.description;
  if (req.includes(c)) {
    if (present.has(c)) dups.add(c);
    present.add(c);
  }
});

const missing = req.filter(c => !present.has(c));

md += '## Summary\n';
md += '1. **Total existing spaces:** ' + data.length + '\n';
md += '2. **Which required space codes already exist:** ' + present.size + ' of the required codes were found in the database.\n';
md += '3. **Which required space codes are missing:** ' + missing.length + ' codes are missing.\n';
md += '4. **Any duplicate space codes:** ' + dups.size + ' duplicates found.\n';
md += '5. **Exact existing columns / schema:**\n';
if (data.length) md += '```\n' + Object.keys(data[0]).join(', ') + '\n```\n\n';

if (missing.length) md += '### Missing Codes\n' + missing.join(', ') + '\n\n';
if (dups.size) md += '### Duplicate Codes\n' + Array.from(dups).join(', ') + '\n\n';

md += '### Detailed List of Existing Spaces\n\n';
md += '| Database ID | Name (Zone/Location) | Description/Code | Type | Capacity | Price/hr | Status |\n';
md += '|---|---|---|---|---|---|---|\n';

data.forEach(s => {
  md += `| \`${s.id}\` | ${s.name} | ${s.description} | ${s.type} | ${s.capacity} | $${s.price_per_hour} | ${s.is_available ? 'Available' : 'Unavailable'} |\n`;
});

fs.writeFileSync('c:/Users/Admin/.gemini/antigravity-ide/brain/a35d48b1-aa22-48d5-85e8-6afcbce10473/implementation_plan.md', md);
