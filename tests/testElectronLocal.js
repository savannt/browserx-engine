(async () => {
    const { app } = require("electron");

    const browserx = require("./browserx.js");
    await browserx.electron(app);
    

    const browser = await browserx.launch({
        electron: app,
    });
    console.log("connected");
    const page = await browser.newPage();
    await page.goto("https://google.com");
    // screenshot
    await page.screenshot({
        path: "./test.png",
        fullPage: true,
    });

})();