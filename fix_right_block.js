const fs = require('fs');
const path = 'd:\\PROJETS\\oxbride-atelier\\src\\components\\hero\\HeroCarousel.tsx';
let content = fs.readFileSync(path, 'utf8');

// Remove the style block from right block opening (the one right before <a> tag)
// Find the specific pattern: className="" followed by style with zIndex: 60 followed by > then <a
const oldStyle = '    className=""\r\n          style={{\r\n            zIndex: 60,\r\n          }}\r\n        >\r\n          <a';
const newStyle = '    className=""\r\n        >\r\n          <a';
if (content.includes(oldStyle)) {
  content = content.split(oldStyle).join(newStyle);
  console.log('✓ Right block style removed');
} else {
  console.log('✗ Right block style NOT found');
  const idx = content.indexOf('className=""');
  if (idx >= 0) {
    console.log('Found className="" at:', idx);
    console.log(JSON.stringify(content.substring(idx, idx + 100)));
  }
}

fs.writeFileSync(path, content, 'utf8');
console.log('Written successfully');