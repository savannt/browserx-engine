module.exports.wsURL = "ws://127.0.0.1:8060";
module.exports = require("puppeteer");

let isConnected = false;

const ws = require("ws");
const id = require("uuid").v4();
const client = new ws(module.exports.wsURL);

// events
const EventEmitter = require("events");
const events = new EventEmitter();

client.on("open", () => {
    console.log("BrowserX library connected to host");

    // send auth_client
    client.send(JSON.stringify({
        type: "auth_client", id
    }));

    // on message
    client.on("message", data => {
        const message = JSON.parse(data);
        console.log("\n\n\n\n\n");
        console.log(message);

        if(message.type === "authenticate") {
            const success = message.success;
            if(success) {
                
                const socket = message.socket;
                console.log("Found socket: " + socket);
                events.emit("socket", socket);
            } else {
                console.error("BrowserX: Failed to authenticate. " + message.error);
            }
        }
    });
    isConnected = true;
    if(module.exports.onConnect) module.exports.onConnect();
});

module.exports.activate = (key) => {
    return new Promise(r => {
        const _r = () => {
            console.log("Key: " + key);
            client.send(JSON.stringify({
                type: "authenticate", key
            }));
            events.once("socket", async socket => {
                // pptr.connect
                const browser = await module.exports.connect({
                    browserWSEndpoint: socket
                });
                r(browser);
            });
        }

        if(!isConnected) {
            module.exports.onConnect = () => {
                _r();
            };
        } else {
            _r();
        }
    });
}