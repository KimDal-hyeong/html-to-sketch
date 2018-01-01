const puppeteer = require('puppeteer');
const fs = require('fs');

module.exports = async function inject (url) {

  try {
    const browser = await puppeteer.launch({
      headless: true
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 1400,
      height: 2000
    });

    await page.goto(url, {
      waitUntil: 'load'
    });

    await page.evaluate('window.scrollBy(0, document.body.offsetHeight)');
    await page.evaluate('window.scrollBy(0, 0)');
    await page.waitFor(500);

    await page.evaluate(fs.readFileSync('./build/page2layers.bundle.js', 'utf8'));
    const asketchPageJSON = await page.evaluate('page2layers.run()');
    let asketchPageJSONString = JSON.stringify(await asketchPageJSON);

    browser.close();
    return asketchPageJSONString;

  } catch (e) {
    await Promise.reject(e);
  }
};

