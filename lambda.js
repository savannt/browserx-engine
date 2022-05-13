
const res = require("express/lib/response");
const browserx = require("./browserx2.js");

browserx.define("screenshotGoogle", async (page, options) => {
    await page.goto("https://google.com");
    return await page.screenshot({ encoding: "base64" });
});

setInterval(() => {
    browserx.invoke("screenshotGoogle").then((result) => {
        console.log("Screenshot image!");
    });
}, 1000);