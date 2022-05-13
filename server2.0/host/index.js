require("../pm2Link.js")("hostServer");

const url = require("url");
const jwt = require("jsonwebtoken");
const WebSocket = require("ws");

const CLIENT_TOKEN = "ca982417-654e-48cc-bc96-6c17da20e457";
const NODE_TOKEN = "e6147f42-deef-4078-99c5-9a5cfedd419a";

module.exports = (port) => {
    // create WebSocket server
    
    const clientArray = [];
    const nodeArray = [];

    const proxyArray = [];

    setInterval(() => {
        console.log("Total browsers: " + (nodeArray.length * 10));
        console.log("Fresh browsers: " + proxyArray.length);
        console.log("Used browsers: " + ((nodeArray.length * 10) - proxyArray.length));
        console.log("Clients: " + clientArray.length);
        console.log("===============================");
    }, 1000);

    const wss = new WebSocket.Server({ port });
    // on connection
    wss.on("connection", async (ws, req) => {
        const token = url.parse(req.url, true).query.token;

        if(!token) {
            console.log("[WS] No token provided");
            ws.close();
            return;
        }

        // figure out if token is jwt encoded with NODE_TOKEN or CLIENT_TOKEN
        let decoded;
        let isClient = false;
        try {
            decoded = jwt.verify(token, NODE_TOKEN);
        } catch(e) {
            try {
                isClient = true;
                decoded = jwt.verify(token, CLIENT_TOKEN);
            } catch(e) {
                console.log("[WS] Invalid token attempted");
                ws.close();
                return;
            }
        }
        if(!decoded) {
            console.log("[WS] Invalid token attempted #2");
            ws.close();
            return;
        }

        if(isClient) {
            clientArray.push(ws);
            console.log("[WS] +1 Client successfully connected");
        } else {
            nodeArray.push(ws);
            console.log("[WS] +1 Node successfully connected");
        }
        


        if(isClient) {
            // queue any incoming messages until proxy connection is made
            let queue = [];
            const addQueue = data => {
                queue.push(data);
            }
            ws.on("message", addQueue);

            

            const proxyConnection = () => {
                if(proxyArray.length === 0) return false;

                const proxy = proxyArray.pop();

                // on proxyWS message
                proxy.on("message", data => {
                    ws.send(data);
                });

                // unlink first ws.on listener, if queue is not empty push those messages to proxy
                ws.removeListener("message", addQueue);
                if(queue.length > 0) {
                    queue.forEach(data => {
                        proxy.send(data.toString());
                    });
                }


                ws.on("message", async data => {
                    proxy.send(data);
                });

                // on close
                proxy.on("close", () => {
                    console.log("[WS] Proxy terminated");
                    ws.close();
                });

                // on ws close
                ws.on("close", () => {
                    console.log("[WS] Client terminated");
                    proxy.close();
                });

                return true;
            }

            // if proxy connection available
            if(proxyArray.length !== 0) {
                proxyConnection();
            } else {
                let interval = setInterval(() => {
                    if(proxyConnection()) {
                        console.log("FOUND CONNECTION");
                        clearInterval(interval);
                    } else {
                        console.log("... wait");
                    }
                }, 500);
            }

        } else {

            // HANDLE NODE MESSAGES
            ws.on("message", async data => {
                const json = JSON.parse(data);
                if(!json || !json.type) {
                    console.log("[WS] Invalid message received: ");
                    console.log(data);
                    return;
                }

                if(json.type === "browser_ready") {
                    const ws = new WebSocket(json.ws);
                    proxyArray.push(ws);
                    console.log("[WS] Browser spawned " + json.ws);
                }
            });
        }
    });
}