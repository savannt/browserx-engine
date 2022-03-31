// connect to WS server

const WS_URL = "ws://34.67.99.253:8060";

const uuid = require("uuidv4").uuid();

const WebSocket = require("ws");
const ws = new WebSocket(WS_URL);

ws.on("open", () => {
    console.log("Test client connected.");

    ws.send(JSON.stringify({
        type: "authclient",
    }));

    ws.send(JSON.stringify({
        type: "create",
        uuid,
        emulation: "none"
    }));

    ws.on("message", data => {
        const message = JSON.parse(data);

        if(message && message.type) {
            if(message.type === "created") {
                const endpoint = message.endpoint;
                console.log("Browser created on endpoint: " + endpoint);
            }
        }
        console.log(JSON.stringify(message));
    });
});