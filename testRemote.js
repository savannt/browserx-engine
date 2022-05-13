for(let i = 0; i < 5; i++) {
    (async () =>  {
        const jwt = require("jsonwebtoken");
        const token = jwt.sign({
            time: Date.now()
        }, "ca982417-654e-48cc-bc96-6c17da20e457");
        
        const pptr = require("puppeteer");
    
        let startTime = Date.now();
        const browser = await pptr.connect({
            browserWSEndpoint: `ws://35.208.194.25:8060?token=${token}`
        });
        // console.log("Start time: " + (Date.now() - startTime) + "ms");
        
        const page = await browser.newPage();
        await page.goto("https://google.com");
        // screenshot
        await page.screenshot({ path: "google.png" });
        console.log("SCREENSHOT PAGE!");
    
    })();
}
