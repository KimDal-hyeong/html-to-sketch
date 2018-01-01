const puppeteer = require('puppeteer');
const fs = require('fs');

console.log();

(async function () {
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1400,
    height: 2000
  });

  await page.goto('http://www.airbnb.co.kr');

  // const jsString = new Buffer().toString('base64');

  // await page.addScriptTag({path: './build/page2layers.bundle.js'});
  await page.evaluate(fs.readFileSync('./build/page2layers.bundle.js', 'utf8'));
  const asketchPageJSON = await page.evaluate('page2layers.run()');
  // const asketchPageJSON = await page.evaluate('console.log(papapapa)');
  let asketchPageJSONString = JSON.stringify(await asketchPageJSON);

  // asketchPageJSONString = asketchPageJSONString.split('Dotum').join('Apple SD Gothic Neo');

// browser.close();
  return asketchPageJSONString;
}());


