// HOST BACKEND SERVICE ON LOCAL HOST
const host = require("./server/host.js");
const client = require("./server/client.js")(true);




// CLIENT CODE
const BrowserX = require("./browserx.js");

(async () => {
    console.log("BrowserX Local Ready!");

    // authenticate with API and request a new remote browser ("socket") to use
    const browser = await BrowserX.activate("defaultApiKey");
    console.log("== CONNECTED TO REMOTE BROWSER ==");

    const page = await browser.newPage();
    await page.goto("https://www.google.com");
    // save screenshot to file
    await page.screenshot({ path: "google.png" });
    console.log("Screenshotted");    
})();
