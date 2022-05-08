const BrowserX = require("./browserx.js");

BrowserX.ready = async () => {
    console.log("Connected to BrowserX servers...");

    // authenticate with API and request a new remote browser ("socket") to use
    const browser = await BrowserX.activate("defaultApiKey");
    console.log("== CONNECTED TO REMOTE BROWSER ==");

    const page = await browser.newPage();
    await page.goto("https://www.google.com");
    // save screenshot to file
    await page.screenshot({ path: "google.png" });
    console.log("Screenshotted");    
}
