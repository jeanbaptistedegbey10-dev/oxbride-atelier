const fs = require('fs');
const content = fs.readFileSync('d:\\PROJETS\\oxbride-atelier\\src\\components\\hero\\HeroCarousel.tsx', 'utf8');
// Find 'aiguille' context
const idx = content.indexOf('aiguille');
console.log('Context around aiguille:', JSON.stringify(content.substring(idx-50, idx+10)));
// Check for remaining mojibake
const mojibake = content.match(/[ÃÂ][^\x00-\x7F]/g);
if (mojibake) {
  const counts = {};
  mojibake.forEach(m => { counts[m] = (counts[m] || 0) + 1; });
  console.log('Remaining mojibake:', JSON.stringify(counts));
} else {
  console.log('No mojibake patterns found!');
}