const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const castHtml = fs.readFileSync('cast_section.html', 'utf8');
html = html.replace('<!-- About Movie Section -->', castHtml + '\n    <!-- About Movie Section -->');
fs.writeFileSync('index.html', html);
console.log('Injection successful');
