const path = require('path');
const fs = require('fs');

function closeTag(callback) {
  let html = fs.readFileSync(path.join(global.builder.pathBuild, 'index.html'), 'utf-8');

  const tags = ['img', 'hr', 'br'];

  tags.forEach(tag => {
    const regex = new RegExp(`<${tag}([^>]*)>`, 'g');
    html = html.replace(regex, `<${tag}$1 />`);
  });

  fs.writeFileSync(path.join(global.builder.pathBuild, 'index.html'), html);

  console.log('Complete "Close tags"');

  if (callback) {
    callback();
  }
}

module.exports = closeTag;
