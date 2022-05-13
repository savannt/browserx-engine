(async () => {

    const WebSocket = require("ws");

    const browser = require("../server2.0/node/browser.js");

    const { url, cleanupFunction } = await browser();

    const browserWS = new WebSocket(url);
    const proxyWS = new WebSocket.Server({ port: 8061 });

    proxyWS.on("connection", client => {
        client.on("message", data => {
            browserWS.send(data.toString());
        });
    });

    browserWS.on("message", data => {
        proxyWS.clients.forEach(client => client.send(data.toString()));
    });

    console.log(url);
    console.log(`ws://127.0.0.1:8061/devtools/browser/${url.split("/devtools/browser/")[1]}`);

    const pptr = require("puppeteer");
    const b = await pptr.connect({
        browserWSEndpoint: `ws://127.0.0.1:8061`
        // browserWSEndpoint: url
    });
    const page = await b.newPage();
    await page.goto("https://google.com");
    // screenshot
    await page.screenshot({ path: "google.png" });
    console.log("SCREENSHOT PAGE!");
    
})();