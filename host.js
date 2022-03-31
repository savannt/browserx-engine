console.log("Started!");
const { uuid } = require("uuidv4");

// create WS server for other nodes to connect to
const ws = require("ws");
const server = new ws.Server({ port: 8060 });


let nodeMap = new Map();
let clientConnections = 0;


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
                createBrowser(message.uuid, message.url, message.emulation);
            } else if(message.type === "created") {
                const node = nodeMap.get(message.uuid);
                node.client.send(JSON.stringify({
                    type: "created",
                    uuid: message.uuid,
                    endpoint: message.endpoint
                }));
            }
        }
        console.log(data);
    });
});

const createBrowser = async (uuid, url, emulation) => {
    if(nodeMap.size === 0) {
        


    } else {
        for(let [key, value] of nodeMap.entries()) {
            if(value.connections === 0) {
                
                // we have found a node that has no connections
                value.client.send(JSON.stringify({
                    type: "create",
                    uuid,
                    url,
                    emulation
                }));
                value.connections++;
                nodeMap.set(key, value);

                // TODO: Return IP address
                return { uuid: _uuid, ip: "" };
            }
        }
    }
    // TODO: Create a node we have none here
    // TODO: -> Wait for node to spin up
}