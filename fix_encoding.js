const fs = require('fs');
const content = fs.readFileSync('d:\\PROJETS\\oxbride-atelier\\src\\components\\hero\\HeroCarousel.tsx', 'utf8');

// Define replacements: mojibake -> correct UTF-8
const replacements = [
  ['â€™', '\u2019'],     // right single quotation mark '
  ['Ã‰', '\u00C9'],      // É
  ['Ã©', '\u00E9'],      // é
  ['Ã¨', '\u00E8'],      // è
  ['Ãª', '\u00EA'],      // ê
  ['Ã ', '\u00E0'],      // à
  ['Ã®', '\u00EE'],      // î
  ['Ã§', '\u00E7'],      // ç
  ['Ã´', '\u00F4'],      // ô
  ['Ã¢', '\u00E2'],      // â
  ['Â·', '\u00B7'],      // middle dot ·
  ['Â°', '\u00B0'],      // degree °
];

let fixed = content;
for (const [from, to] of replacements) {
  const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  const matches = fixed.match(regex);
  const count = matches ? matches.length : 0;
  fixed = fixed.split(from).join(to);
  console.log('Replaced ' + count + ' occurrences of: ' + JSON.stringify(from) + ' -> ' + JSON.stringify(to));
}

// Check for any remaining mojibake patterns
const remaining = fixed.match(/[ÃÂÂ€Â£Â¥Â¦Â§Â¨Â©ÂªÂ«Â¬Â­Â®Â¯Â°Â±Â²Â³Â´ÂµÂ¶Â·Â¸Â¹ÂºÂ¼Â½Â¾Â¿]/g);
if (remaining) {
  console.log('WARNING: Remaining mojibake lead chars:', remaining);
} else {
  console.log('All mojibake patterns fixed!');
}

// Verify key strings
console.log('Mariée:', fixed.includes('Mariée'));
console.log('traîne:', fixed.includes('traîne'));
console.log('cathédrale:', fixed.includes('cathédrale'));
console.log('façonnées:', fixed.includes('façonnées'));
console.log('DÉCOUVRIR:', fixed.includes('DÉCOUVRIR'));
console.log("l'aiguille:", fixed.includes("l'aiguille"));

fs.writeFileSync('d:\\PROJETS\\oxbride-atelier\\src\\components\\hero\\HeroCarousel.tsx', fixed, 'utf8');
console.log('File written successfully');
