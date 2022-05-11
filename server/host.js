// THIS SCRIPT RUNS ON THE ROUTING SERVER, ONLY ONE INSTANCE OF THIS RUNNING.
//  - ALL CLIENT INTERACTIONS ARE ROUTED THROUGH THIS SERVER FIRST


console.log("Started Host server!");
const { uuid } = require("uuidv4");

// create WS server for other nodes to connect to
const ws = require("ws");
const server = new ws.Server({ port: 8060 });

const EventEmitter = require("events");
const events = new EventEmitter();


let clientsConnected = 0;
let clientMap = new Map();

let nodesConnected = 0;
let nodeMap = new Map();

// console log active connections every 1s
setInterval(() => {
    console.log("Clients connected: " + clientMap.size);
    console.log("Nodes connected: " + nodeMap.size);
    console.log("---------------------------------------");
}, 5000);

const API_KEYS = ["defaultApiKey"];

server.on("connection", client => {
    console.log("Connected to websocket");

    // on message
    client.on("message", data => {
        const message = JSON.parse(data);

        if(message.type) {

            if(message.type === "auth_node") {
                client.id = message.id;
                nodeMap.set(message.id, { client, availableSockets: [], sockets: [] });
                nodesConnected++;
                console.log("New node connected: " + message.id);
            }
            
            if(message.type === "auth_client") {
                client.id = message.id;
                clientMap.set(message.id, client);
                clientsConnected++;
                console.log("New client connected: " + message.id);
            }

            if(message.type === "node_cdp_cleanup") {
                const wsEndpoint = message.wsEndpoint;
                console.log("[node_cdp_cleanup] Removing node: " + wsEndpoint);
                // remove wsEndpoint from nodeMap(client.id).sockets and availableSockets
                const node = nodeMap.get(client.id);
                if(node) {
                    const sockets = node.sockets;
                    const availableSockets = node.availableSockets;
                    const index = sockets.indexOf(wsEndpoint);
                    if(index !== -1) {
                        sockets.splice(index, 1);
                    }
                    const index2 = availableSockets.indexOf(wsEndpoint);
                    if(index2 !== -1) {
                        availableSockets.splice(index2, 1);
                    }
                    nodeMap.set(client.id, { client, availableSockets, sockets });
                }
            }

            if(message.type === "node_cdp_ready") {
                const wsEndpoint = message.wsEndpoint;
                // let port = message.port;
                
                console.log(`[${message.type}] received wsProxyEndpoint: ${wsEndpoint}`);

                nodeMap.get(client.id).sockets.push(wsEndpoint);
                nodeMap.get(client.id).availableSockets.push(wsEndpoint);

                // const proxyWS = new ws.Server({ port });
                // const cdpWS = new ws(wsEndpoint);


                // let proxyClient;
                // proxyWS.on("connection", _client => {
                //     proxyClient = _client;
                //     proxyClient.on("message", msg => {
                //         cdpWS.send(msg.toString());
                //     });
                // });

                // cdpWS.on("message", msg => {
                //     proxyClient.send(msg.toString());
                // });

                // cdpWS.on("open", async () => {
                //     const proxyUrl = `ws://127.0.0.1:${port}/devtools/browser/${wsEndpoint.split("devtools/browser/")[1]}`;
                //     nodeMap.get(client.id).sockets.push(proxyUrl);
                //     nodeMap.get(client.id).availableSockets.push(proxyUrl);
                //     console.log("[node_cdp_proxy] " + proxyUrl);
                // });
            }

            if(message.type === "authenticate") {
                const key = message.key;
                

                // if key exists
                if(API_KEYS.includes(key)) {

                    let interval = setInterval(() => {
                        // loop all nodes
                        for(const [nodeId, node] of nodeMap) {

                            if(node.availableSockets.length > 0) {
                                const socket = node.availableSockets.shift();
                                
                                client.send(JSON.stringify({
                                    type: "authenticate",
                                    success: true,
                                    socket
                                }));
                                clearInterval(interval);
                                return;
                            }
                        }
                        console.log(" ... waiting for nodes to connect, waiting to finish authenticating");
                    }, 150);
                } else {
                    client.send(JSON.stringify({
                        type: "authenticate",
                        success: false,
                        error: "Invalid API key"
                    }));
                }
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