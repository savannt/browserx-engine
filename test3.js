const url = "ws://34.134.157.93:46109/devtools/browser/688ff035-2f18-43d0-bc81-81a7250d2605";

(async () => {
    const puppeteer = require("puppeteer-extra");
    const pluginStealth = require("puppeteer-extra-plugin-stealth");
    puppeteer.use(pluginStealth());

    const browser = await puppeteer.connect({
        browserWSEndpoint: url
    });

    const page = await browser.newPage();
    await page.goto("https://google.com");

    const screenshot = await page.screenshot({
        encoding: "base64"
    });
    console.log(screenshot);
})();