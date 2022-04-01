// connect to WS server

const WS_URL = "ws://10.128.0.7:8060";

const uuid = require("uuidv4").uuid();

const WebSocket = require("ws");
const createRemoteBrowser = require("./RemoteBrowser");
const ws = new WebSocket(WS_URL);


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
                let wsURL = await createRemoteBrowser(emulation);
                wsURL = wsURL.replace("127.0.0.1", "35.193.47.127");

                console.log(` -> Browser created`);
                console.log(` -> ${wsURL}`);
                ws.send(JSON.stringify({
                    type: "created",
                    uuid,
                    endpoint: wsURL
                }));
            }
        }
    });
});