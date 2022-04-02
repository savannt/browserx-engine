const url = "ws://35.193.47.127:8060/devtools/browser/80ec3f5c-b9b0-47c8-8774-6c49dd846c67";

(async () => {
    const puppeteer = require("puppeteer-extra");
    const pluginStealth = require("puppeteer-extra-plugin-stealth");
    puppeteer.use(pluginStealth());

    const browser = await puppeteer.connect({
        browserWSEndpoint: url
    });
    console.log("Connected");

    const page = await browser.newPage();
    await page.goto("https://google.com");

    const screenshot = await page.screenshot({
        encoding: "base64"
    });
    console.log(screenshot);
})();