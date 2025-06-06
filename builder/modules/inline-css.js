const inlineCss = require('inline-css');
const path = require('path');
const fs = require('fs');

async function validHtml(callback) {
  const css = fs.readFileSync(path.join(global.builder.pathSourse, 'style.css'), 'utf-8');
  const html = fs.readFileSync(path.join(global.builder.pathSourse, 'index.html'), 'utf-8').replace('<!-- IMPORT style.css -->', `
    <style type="text/css">${css}</style>
    `);
  const options = {
    url: global.builder.pathBuild,
    preserveMediaQueries: true,
    applyWidthAttributes: true,
    applyTableAttributes: true,
    removeHtmlSelectors: true
  };
  const result = await inlineCss(html, options);

  if (!fs.existsSync(path.join(global.builder.pathBuild))) {
    fs.mkdirSync(path.join(global.builder.pathBuild));
  }

  fs.writeFileSync(path.join(global.builder.pathBuild, 'index.html'), result);

  console.log('Complete "Inline CSS"');

  if (callback) {
    callback();
  }

  global.builder.plugins.server.reload();
}

module.exports = validHtml;
