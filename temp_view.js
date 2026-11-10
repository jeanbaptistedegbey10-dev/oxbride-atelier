const fs = require('fs');
const content = fs.readFileSync('d:\\PROJETS\\oxbride-atelier\\src\\components\\hero\\HeroCarousel.tsx', 'utf8');
// Find left block start
const leftStart = 'absolute left-4 sm:left-16 bottom-4 sm:bottom-16 sm:left-16 overflow-hidden';
const leftIdx = content.indexOf(leftStart);
console.log('=== LEFT BLOCK ===');
console.log(content.substring(leftIdx - 50, leftIdx + 3000));
console.log('=== END LEFT BLOCK ===');
// Find right block start  
const rightStart = 'absolute bottom-6 right-4 sm:bottom-16 sm:right-12';
const rightIdx = content.indexOf(rightStart);
console.log('=== RIGHT BLOCK ===');
console.log(content.substring(rightIdx - 50, rightIdx + 1500));
console.log('=== END RIGHT BLOCK ===');