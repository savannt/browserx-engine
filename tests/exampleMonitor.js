const browserx = require("browserx");

browserx.define("fetchProduct", async (page, options) => {
    // ANY CODE HERE RUNS ON REMOTE BROWSER

    await page.goto(options.url);
    // fetch info
    return {
        product: "",
        price: "",
    }
});

let monitorTheseProducts = [ {}, {}, {}, {} ];
browser.schedule(30, () => {
    monitorTheseProducts.forEach(product => {
        browser.emit("fetchProduct", product).then((data) => {
            // ADD data to database
        });
    });
});