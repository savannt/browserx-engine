const { resolve } = require("path");

(async () => {

    const ws = require("ws");


    const createWSProxy = (port, host) => {
        return new Promise(resolve => {
            const ws = require("ws");

            const proxy = new ws.Server({ port });
            const cdp = new ws(url);

            proxy.on("connection", _client => {
                client = _client;
                client.on("message", msg => {
                    // console.log(" -> FWD");
                    // console.log(msg.toString());
                    cdp.send(msg.toString());
                });
            });
            cdp.on("message", msg => {
                // console.log(" <- BWD");
                client.send(msg.toString());
            });
            cdp.on("open", async () => {
                // console.log("Connected to CDP!");
            
                const proxyUrl = `ws://127.0.0.1:8060/devtools/browser/${url.split("devtools/browser/")[1]}`;
                resolve({
                    url: proxyUrl,
                    destroy: () => {
                        proxy.close();
                        cdp.close();
                    }
                });
            });

            let client;
            proxy.on("connection", _client => {
                client = _client;
            });
        });
    }


    const pup = require("puppeteer");
    const browser = await pup.launch({
        headless: true,
    });
    const url = browser.wsEndpoint();
    await browser.disconnect();

    // console.log("Connecting proxy to: " + url);
    // const wss = new ws(url);

    // // wss.on("open", () => {
    // //     console.log("open!");
    // // });
    // // wss.on("message", msg => {
    // //     console.log(" <- BWD");
    // //     client.send(msg);
    // // });

    // const server = new ws.Server({ port: 8060 });

    // let client;

    // server.on("connection", _client => {
    //     console.log("got connection");
    //     client = _client;
    //     client.on("message", msg => {
    //         // console.log(" -> FWD");
    //         console.log(msg.toString());
    //         wss.send(msg.toString());
    //     });
    // });
    // wss.on("message", msg => {
    //     // console.log(" <- BWD");
    //     client.send(msg.toString());
    // });
    // wss.on("open", async () => {
    //     console.log("Connected to CDP!");
    
    //     console.log(`Proxy URL: ws://127.0.0.1:8060/devtools/browser/${url.split("devtools/browser/")[1]}`);
    //     const b2 = await pup.connect({
    //         // browserWSEndpoint: url
    //         browserWSEndpoint: `ws://127.0.0.1:8060/devtools/browser/${url.split("devtools/browser/")[1]}`
    //     });
    //     console.log(await (await (await b2.newPage()).goto("https://google.com")).url());
    // });

    const wsProxy = await createWSProxy(8060, url);
    const b2 = await pup.connect({
        // browserWSEndpoint: url
        browserWSEndpoint: wsProxy
    });
    console.log(await (await (await b2.newPage()).goto("https://google.com")).url());
})();