const browserx = require("./browserx");
browserx.authorizeCloud("ca982417-654e-48cc-bc96-6c17da20e457");

browserx.define("screenshotGoogle", async (page, options) => {
    await page.goto("https://google.com");
    return await page.screenshot({ encoding: "base64" });
});

setInterval(() => {
    browserx.invoke("screenshotGoogle").then((result) => {
        console.log("Screenshot image!");
    });
}, 1000);