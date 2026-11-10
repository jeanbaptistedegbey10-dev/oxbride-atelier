const fs = require('fs');
const path = 'd:\\PROJETS\\oxbride-atelier\\src\\components\\hero\\HeroCarousel.tsx';
let content = fs.readFileSync(path, 'utf8');

// Use \r\n line endings to match the file
const CRLF = '\r\n';

// 2. Replace right block opening with inner div
const oldRightOpen = `        <div${CRLF}          className="absolute bottom-6 right-4 sm:bottom-16 sm:right-12"${CRLF}          style{{${CRLF}            zIndex: 60,${CRLF}          }}${CRLF}        >`;

const newRightOpen = `          <div>`;

if (content.includes(oldRightOpen)) {
  content = content.split(oldRightOpen).join(newRightOpen);
  console.log('✓ Right block opening replaced');
} else {
  console.log('✗ Right block opening NOT found');
  const idx = content.indexOf('absolute bottom-6 right-4');
  if (idx >= 0) {
    console.log('Found at:', idx);
    console.log(JSON.stringify(content.substring(idx - 100, idx + 200)));
  }
}

// 3. Close container div after right block closing
const oldRightClose = `        </div>${CRLF}      </div>`;

const newRightClose = `          </div>${CRLF}        </div>${CRLF}      </div>`;

if (content.includes(oldRightClose)) {
  content = content.split(oldRightClose).join(newRightClose);
  console.log('✓ Right block closing replaced');
} else {
  console.log('✗ Right block closing NOT found');
  const idx = content.indexOf('DÉCOUVRIR LA COLLECTION');
  if (idx >= 0) {
    const endIdx = content.indexOf('</div>', idx + 100);
    console.log('Found DÉCOUVRIR at:', idx);
    console.log(JSON.stringify(content.substring(endIdx - 50, endIdx + 50)));
  }
}

fs.writeFileSync(path, content, 'utf8');
console.log('File written successfully');

// Verify
const verify = fs.readFileSync(path, 'utf8');
console.log('Container class present:', verify.includes('absolute bottom-6 sm:bottom-10 left-6 right-6 md:left-12 md:right-12 flex flex-col md:flex-row items-end justify-between gap-6 pointer-events-auto'));
console.log('Old left absolute gone:', !verify.includes('absolute left-4 sm:left-16 bottom-4 sm:bottom-16 sm:left-16 overflow-hidden'));
console.log('Old right absolute gone:', !verify.includes('absolute bottom-6 right-4 sm:bottom-16 sm:right-12'));

// Check for JSX balance - count opening and closing divs in the affected area
const containerClass = 'absolute bottom-6 sm:bottom-10 left-6 right-6 md:left-12 md:right-12 flex flex-col md:flex-row items-end justify-between gap-6 pointer-events-auto';
const containerIdx = verify.indexOf(containerClass);
if (containerIdx >= 0) {
  const afterContainer = verify.substring(containerIdx);
  // Find matching closing - look for </div> that closes the container
  console.log('Container found at:', containerIdx);
}
