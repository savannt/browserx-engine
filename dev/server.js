const WS_URL = "ws://10.128.0.7:8060";
const WebSocket = require("ws");
const ws = new WebSocket(WS_URL);


ws.on("open", () => {
    ws.send(JSON.stringify({
        type: "auth",
        uuid,
    }));

    ws.on("message", async data => {
        const message = JSON.parse(data);

        
        const uuid = message.uuid;
        if(uuid) {

        } else {
            console.log("Got message with no uuid, no where to route?");
            console.log(JSON.stringify(message));
        }
    });
});