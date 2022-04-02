console.log("Started!");
const { uuid } = require("uuidv4");

// create WS server for other nodes to connect to
const ws = require("ws");
const server = new ws.Server({ port: 8060 });


let nodeMap = new Map();
let clientMap = new Map();
let clientConnections = 0;

const EventEmitter = require("events");
const events = new EventEmitter();

setInterval(() => {
    console.log("Connections: " + nodeMap.size);
}, 1000);

server.on("connection", client => {
    console.log("Connected to websocket");
    client.on("message", data => {
        const message = JSON.parse(data);
        if(message.type) {
            if(message.type === "auth" && message.uuid) {
                nodeMap.set(message.uuid, {
                    client,
                    uuid: message.uuid,
                    connections: 0
                });
                console.log("Added new node: " + message.uuid);
            } else if(message.type === "authclient") {
                clientConnections++;
            } else if(message.type === "relay" && message.target) {
                const target = nodeMap.get(message.target);
                if(target) {
                    console.log("-> Relayed message to " + message.target);
                    target.client.send(data);
                }
            } else if(message.type === "create") {
                clientMap.set(message.uuid, client);
                console.log("Creating browser: " + message.uuid);
                createBrowser(message.uuid, message.emulation);
            } else if(message.type === "created") {
                clientMap.get(message.uuid).send(JSON.stringify({
                    type: "created",
                    uuid: message.uuid,
                    endpoint: message.endpoint
                }));
            }
        }
    });
});

const createBrowser = async (uuid, emulation) => {
    const search = () => {
        for(let [key, value] of nodeMap.entries()) {
            if(value.connections < 5) {
                console.log("Found server to use!");
                // we have found a node that has no connections
                value.client.send(JSON.stringify({
                    type: "create",
                    uuid,
                    emulation
                }));
                value.connections++;
                nodeMap.set(key, value);
                return true;
            }
        }
        return false;
    }
    
    const wait = () => {
        return new Promise(resolve => {
            let interval = setInterval(() => {
                if(search()) {
                    clearInterval(interval);
                    return resolve();
                }
                console.log(" ... ");
            }, 500);
        });
    }

    if(nodeMap.size === 0) {
        await wait();
    } else {
        if(!(search())) {
            await wait();
        }
    }
    // TODO: Create a node we have none here
    // TODO: -> Wait for node to spin up
}