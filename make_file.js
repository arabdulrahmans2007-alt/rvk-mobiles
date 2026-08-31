const fs = require('fs');
const path = require('path');
const [,, targetFile, ...rest] = process.argv;
const content = rest.join(' ');
fs.mkdirSync(path.dirname(targetFile), { recursive: true });
fs.writeFileSync(targetFile, content, 'utf8');
console.log('Saved:', targetFile);