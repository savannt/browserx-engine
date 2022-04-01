// connect to WS server

const WS_URL = "ws://34.121.23.61:8060";

const uuid = require("uuidv4").uuid();

const WebSocket = require("ws");
const ws = new WebSocket(WS_URL);

ws.on("open", () => {
    ws.on("message", data => {
        console.log(data);
        const message = JSON.parse(data);
    
        if(message && message.type) {
            if(message.type === "created") {
                const endpoint = message.endpoint;
                console.log("Browser created on endpoint: " + endpoint);
            }
        }
    });

    console.log("Test client connected.");

    ws.send(JSON.stringify({
        type: "authclient",
    }));

    console.log("Creating browser...");
    ws.send(JSON.stringify({
        type: "create",
        uuid,
        emulation: "none"
    }));
});