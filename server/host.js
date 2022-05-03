// THIS SCRIPT RUNS ON THE ROUTING SERVER, ONLY ONE INSTANCE OF THIS RUNNING.
//  - ALL CLIENT INTERACTIONS ARE ROUTED THROUGH THIS SERVER FIRST


console.log("Started!");
const { uuid } = require("uuidv4");

// create WS server for other nodes to connect to
const ws = require("ws");
const server = new ws.Server({ port: 8060 });

const EventEmitter = require("events");
const events = new EventEmitter();


const clientsConnected = 0;
const clientMap = new Map();

const nodesConnected = 0;
const nodeMap = new Map();

// console log active connections every 1s
setInterval(() => {
    console.log("Clients connected: " + clientMap.size);
    console.log("Nodes connected: " + nodeMap.size);
}, 1000);



server.on("connection", client => {
    console.log("Connected to websocket");

    // on message
    client.on("message", data => {
        const message = JSON.parse(data);

        if(message.type) {

            if(message.type === "auth_node") {
                client.id = message.id;
                nodeMap.set(message.id, { client, sockets: [] });
                nodesConnected++;
                console.log("New node connected: " + message.id);
            }
            
            if(message.type === "auth_client") {
                client.id = message.id;
                clientMap.set(message.id, client);
                clientsConnected++;
                console.log("New client connected: " + message.id);
            }

            if(message.type === "node_cdp_ready") {
                const wsEndpoint = message.wsEndpoint;
                let port = message.port;

                // create websocket server wrapper and relay all messages to wsEndpoint
                const wsClient = new ws(wsEndpoint);
                const wsServer = new ws.Server({ port });

                wsClient.on("message", data => {
                    wsServer.clients.forEach(client => {
                        client.send(data);
                    });
                });

                wsServer.on("connection", wsClient => {
                    wsClient.on("message", data => {
                        wsClient.send(data);
                    });
                });

                // push wsServer public URL to nodeMap.sockets
                const wsURL = wsServer.address().address + ":" + wsServer.address().port;
                nodeMap.get(client.id).sockets.push(wsURL);
            }
        }
    });

    // on disconnect, cleanup maps
    client.on("close", () => {
        if(client.id) {
            if(clientMap.has(client.id)) {
                clientMap.delete(client.id);
                clientsConnected--;
                console.log("Client disconnected: " + client.id);
            } else if(nodeMap.has(client.id)) {
                nodeMap.delete(client.id);
                nodesConnected--;
                console.log("Node disconnected: " + client.id);
            }
        }
    });
});