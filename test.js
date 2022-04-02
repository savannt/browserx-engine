// // connect to WS server

// const uuid = require("uuidv4").uuid();

// const WS_URL = "ws://34.121.23.61:8060";
// const WebSocket = require("ws");
// const ws = new WebSocket(WS_URL);

// ws.on("open", () => {
//     ws.on("message", data => {
//         console.log(data);
//         const message = JSON.parse(data);
    
//         if(message && message.type) {
//             if(message.type === "created") {
//                 const endpoint = message.endpoint;
//                 console.log("Browser created on endpoint: " + endpoint);
//             }
//         }
//     });

//     console.log("Test client connected.");

//     ws.send(JSON.stringify({
//         type: "authclient",
//     }));

//     console.log("Creating browser...");
//     ws.send(JSON.stringify({
//         type: "create",
//         uuid,
//         emulation: "none"
//     }));
// });


class CloudWS {
    constructor() {
        const ws = require("ws");
        this.ws = new ws("ws://34.121.23.61:8060");
        const EventEmitter = require("events");
        this.events = new EventEmitter();
        this.init = false;
    }

    async createRemote (uuid, emulation) {
        if(!this.init) await this.listen();
        return await new Promise(r => {
            console.log("Creating browser...");
            this.ws.send(JSON.stringify({
                type: "create",
                uuid,
                emulation,
            }));
            this.ws.once(`created:${uuid}`, d => r(d));
        });
    }

    listen () {
        this.init = true;
        return new Promise(r => {
            this.ws.on("open", () => {

                console.log("[BROWSER-MANAGER] Connected to CloudWS".bgBlue);

                this.ws.on("message", data => {

                    console.log("Received: ");
                    console.log(data);
                    const message = JSON.parse(data);
                

                    if(message && message.type) {

                        if(message.type === "created") {

                            const uuid = message.uuid;
                            const endpoint = message.endpoint;

                            this.events.send(`created:${uuid}`, endpoint);
                            console.log("Browser created on endpoint: " + endpoint);

                        }
                    }
                });

                this.ws.send(JSON.stringify({
                    type: "authclient",
                }));

                r();
            });
        });
    }
}

(async () => {
    const cloud = new CloudWS();
    console.log("starting");
    await cloud.listen();
    console.log(await cloud.createRemote("test", "none"));
})();