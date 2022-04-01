// connect to WS server

const WS_URL = "ws://10.128.0.7:8060";

const uuid = require("uuidv4").uuid();
const createRemoteBrowser = require("./RemoteBrowser");

const WebSocket = require("ws");
const ws = new WebSocket(WS_URL);

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
                let cdpClient;

                console.log(`Creating browser with uuid: ${uuid}, emulation: ${emulation}`);

                const cdp = new WebSocket(wsURL);
                cdp.on("open", () => {
                    const server = new WebSocket.Server({ port: 8060 });
                    server.on("connection", client => {
                        cdpClient = client;
                        client.on("message", (data) => {
                            cdp.send(data);
                        });
                    });

                    cdp.on("message", (data) => {
                        cdpClient.send(data);
                    });
                });


                let wsURL = await createRemoteBrowser(emulation);
                wsURL = wsURL.replace("127.0.0.1", "35.193.47.127");
                console.log(`Browser created on endpoint: ${wsURL}`);
                console.log(`-> Browser created`);
                console.log(`-> ${wsURL}`);
                ws.send(JSON.stringify({
                    type: "created",
                    uuid,
                    endpoint: `https://35.193.47.127:8060`
                }));
            }
        }
    });
});