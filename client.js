// connect to WS server

const WS_URL = "ws://10.128.0.7:8060";

const uuid = require("uuidv4").uuid();

const WebSocket = require("ws");
const ws = new WebSocket(WS_URL);

ws.on("open", () => {
    ws.send(JSON.stringify({
        type: "auth",
        uuid,
    }));

    ws.on("message", data => {
        const message = JSON.parse(data);

        if(message && message.type) {
            if(message.type === "create") {
                let uuid = message.uuid;
                let url = message.url;
                let emulation = message.emulation;


            }
        }
    });
});