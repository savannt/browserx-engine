const url = "ws://35.193.47.127:45231/devtools/browser/804680de-5d47-45c5-8b27-03b9d59f0d95";

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