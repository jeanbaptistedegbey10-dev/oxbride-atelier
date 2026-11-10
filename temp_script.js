const fs = require('fs');
const content = fs.readFileSync('d:\\PROJETS\\oxbride-atelier\\src\\components\\hero\\HeroCarousel.tsx', 'utf8');
const regex = /className="[^"]*absolute[^"]*"/g;
let match;
while ((match = regex.exec(content)) !== null) {
  console.log('=== ABSOLUTE ===');
  console.log(match[0]);
  console.log('---');
}