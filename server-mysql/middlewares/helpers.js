const fs = require('fs');
const path = require('path');



module.exports = {
  getFontsPath: () => {
    const fontDirectory = '../public/fonts';
    return fs.readdirSync(fontDirectory).reduce((accumulator, fileName) => {
      accumulator[fileName.replace('.ttf', '')] = path.join(fontDirectory, fileName);
      return accumulator;
    }, {});
  }
};