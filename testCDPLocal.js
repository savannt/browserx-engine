const BrowserX = require("./browserx.js");

(async () => {
    const browser = await BrowserX.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://www.google.com");
    await page.cdp.Page.navigate("https://youtube.com");

    
    // save screenshot to file
    await page.screenshot({ path: "testCDP.png" });
    console.log("Screenshotted");  
})();