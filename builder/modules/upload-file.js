const fs = require('fs');
const path = require('path');
let db = require(path.join(path.resolve(), 'builder', 'data', 'files.json'));

const apiKey = '6d207e02198a847aa98d0a2a901485a5';
const apiUrl = 'https://freeimage.host/api/1/upload';

async function uploadFile(callback) {
  const files = fs.readdirSync(path.join(global.builder.pathSourse, 'assets'));

  const promises = files.map(async file => {
    return new Promise(async (resolve, reject) => {
      const stats = fs.statSync(path.join(global.builder.pathSourse, 'assets', file));

      if (db.filter(f => f.name == file && f.size == stats.size).length) {
        return resolve();
      } else if (db.filter(f => f.name == file && f.size != stats.size).length) {
        db = db.filter(f => f.name != file);
      }

      const fBase64 = fs.readFileSync(path.join(global.builder.pathSourse, 'assets', file), {
        encoding: 'base64',
      });

      const formData = new FormData();
      formData.append('key', apiKey);
      formData.append('action', 'upload');
      formData.append('source', fBase64);
      formData.append('format', 'json');

      const res = await (
        await fetch(apiUrl, {
          method: 'POST',
          body: formData,
        })
      ).json();

      db.push({
        name: file,
        url: res.image.image.url,
        size: stats.size,
      });
      resolve(file);
    });
  });

  await Promise.all(promises);

  fs.writeFileSync(path.join(path.resolve(), 'builder', 'data', 'files.json'), JSON.stringify(db));

  console.log('Complete "Upload files"');

  if (callback) {
    callback();
  }
}

module.exports = uploadFile;
