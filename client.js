// connect to WS server

const WS_URL = "ws://10.128.0.7:8060";

const uuid = require("uuidv4").uuid();
const createRemoteBrowser = require("./RemoteBrowser");

const WebSocket = require("ws");
const ws = new WebSocket(WS_URL);

let browsers = 0;


const createWSProxy = (port, host) => {
    return new Promise(resolve => {
        const ws = require("ws");

        const proxy = new ws.Server({ port });
        const cdp = new ws(host);

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
        
            const proxyUrl = `ws://127.0.0.1:${port}/devtools/browser/${host.split("devtools/browser/")[1]}`;
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


console.log("Client started!");

ws.on("open", () => {
    ws.send(JSON.stringify({
        type: "auth",
        uuid,
    }));

    ws.on("message", async data => {
        const message = JSON.parse(data);

        if(message && message.type) {
            if(message.type === "create") {
                let uuid = message.uuid;
                let emulation = message.emulation;


                

                console.log(`Creating browser with uuid: ${uuid}, emulation: ${emulation}`);

                const wsURL = await createRemoteBrowser(emulation);
                let wsProxy = (await createWSProxy(8060 + (browsers * 10), wsURL)).url;
                wsProxy = wsProxy.replace("127.0.0.1", "34.121.52.171");


                console.log(`Browser created`);
                console.log(`-> Proxy: ${wsProxy}`);
                console.log(`-> Host : ${wsURL}`);
                ws.send(JSON.stringify({
                    type: "created",
                    uuid,
                    endpoint: wsProxy
                }));
                browsers++;
            }
        }
    });
});