(async () =>  {
    const pptr = require("puppeteer");
    const browser = await pptr.connect({
        browserWSEndpoint: `ws://localhost:59140`
    });
    
    const page = await browser.newPage();
    await page.goto("https://google.com");
    // screenshot
    await page.screenshot({ path: "google.png" });
    console.log("SCREENSHOT PAGE!");
})();