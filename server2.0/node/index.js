require("../pm2Link.js")();

const jwt = require("jsonwebtoken");
const getPort = require("port.js");
const browser = require("./browser.js");
const WebSocket = require("ws");

const CLIENT_TOKEN = "ca982417-654e-48cc-bc96-6c17da20e457";
const NODE_TOKEN = "e6147f42-deef-4078-99c5-9a5cfedd419a";

const AUTO_TIMEOUT = 12 * 1000; // 12 seconds of no activity

module.exports = async (hostPort, hostHost, isLocal, browsers) => {

    const token = jwt.sign({
        time: Date.now()
    }, NODE_TOKEN);

    // connect to WS server
    const ws = new WebSocket(`ws://${hostHost}:${hostPort}?token=${token}`);
    ws.on("open", () => {
        ws.on("message", async data => {

        });
    });

    console.log("[WS Host] Host WebSocket opened");

    const launchBrowser = async () => {
        const { url, cleanupFunction } = await browser();

        const proxyPort = await getPort();

        // create WebSocket proxy of URL
        const browserWS = new WebSocket(url);
        const proxyWSS = new WebSocket.Server({ port: proxyPort });

        let lastTimeout = -1;

        browserWS.on("message", data => {
            proxyWSS.clients.forEach(client => {
                client.send(data.toString());
            });

            if(lastTimeout !== -1) {
                clearTimeout(lastTimeout);
            }
            lastTimeout = setTimeout(() => {
                console.log("[WSProxy] AutoTimed out");
                proxyWSS.close();
                browserWS.close();
            }, AUTO_TIMEOUT);
        });

        // on browserWS close
        browserWS.on("close", () => {
            console.log(`[${proxyPort}] Browser terminated`);
            cleanupFunction();
            launchBrowser();
            proxyWSS.close();
        });

        proxyWSS.on("connection", client => {
            client.on("message", data => {
                browserWS.send(data.toString());
            });

            client.on("close", () => {
                browserWS.close();
            });
        });

        ws.send(JSON.stringify({
            type: "browser_ready",
            ws: `ws://${hostHost}:${proxyPort}`,
        }));
    }

    for(let i = 0; i < browsers; i++) {
        console.log("[node] launching browser");
        launchBrowser();
    }
}