const fs = require('fs');
const content = fs.readFileSync('d:\\PROJETS\\oxbride-atelier\\src\\components\\hero\\HeroCarousel.tsx', 'utf8');
console.log('Container class present:', content.includes('absolute bottom-6 sm:bottom-10 left-6 right-6 md:left-12 md:right-12 flex flex-col md:flex-row items-end justify-between gap-6 pointer-events-auto'));
console.log('Old left absolute gone:', !content.includes('absolute left-4 sm:left-16 bottom-4 sm:bottom-16 sm:left-16 overflow-hidden'));
console.log('Old right absolute gone:', !content.includes('absolute bottom-6 right-4 sm:bottom-16 sm:right-12'));
console.log('Right block style zIndex gone:', !content.includes('zIndex: 60'));
// Check encoding
console.log('Mariée:', content.includes('Mariée'));
console.log('traîne:', content.includes('traîne'));
console.log('cathédrale:', content.includes('cathédrale'));
console.log('façonnées:', content.includes('façonnées'));
console.log('DÉCOUVRIR:', content.includes('DÉCOUVRIR'));
// Count div open/close in the container area
const containerIdx = content.indexOf('pointer-events-auto');
if (containerIdx >= 0) {
  const after = content.substring(containerIdx);
  const openDivs = (after.match(/<div/g) || []).length;
  const closeDivs = (after.match(/<\/div>/g) || []).length;
  console.log('Div balance after container: open=' + openDivs + ', close=' + closeDivs);
}