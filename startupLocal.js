const jwt = require("jsonwebtoken");

const host = require("./server2.0/host/index.js");
const node = require("./server2.0/node/index.js");

const hostname = "127.0.0.1";
const port = 8060;

host(port, hostname, true);
node(port, hostname, true, 2);

(async () => {
    console.log(".. starting browserx client lib");
    const pptr = require("puppeteer");

    const token = jwt.sign({
        time: Date.now()
    }, "ca982417-654e-48cc-bc96-6c17da20e457");


    console.log("[BrowserX Lib] Connecting to host...");
    const browser = await pptr.connect({
        browserWSEndpoint: `ws://127.0.0.1:8060?token=${token}`
    });
    
    const page = await browser.newPage();
    await page.goto("https://google.com");
    // screenshot
    await page.screenshot({ path: "google.png" });
    console.log("SCREENSHOT PAGE!");
    page.close();
    browser.close();
})();