const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Forces Puppeteer to install and find Chrome inside your project folder
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};