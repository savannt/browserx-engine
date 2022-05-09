module.exports = (isLocal) => {
    
    const ws = require("ws");

    const publicIPv4 = () => {
        return new Promise(r => {
            const https = require("https");
            https.get("https://api.ipify.org?format=json", (resp) => {
                let data = "";
                resp.on("data", chunk => {
                    data += chunk;
                });
    
                resp.on("end", () => {
                    data = JSON.parse(data);
                    if(data.ip) r(data.ip);
                    else r(false);
                });
            }).on("error", () => r(false));
        });
    };
    

    const getInternalIPv4 = (includes) => {
        const { networkInterfaces } = require('os');
        const nets = networkInterfaces();
        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                if(net.family === "IPv4" || net.family === 4) {
                    if(net.address.includes(includes)) {
                        return net.address;
                    }
                }
            }
        }
        console.log("[ERROR] Failed finding internal IP");
        return "127.0.0.1";
    }

    const createPublicWSProxy = (internalIP, internalWS, publicPort, externalIP, callback) => {
        const proxyWS = new ws.Server({ port: publicPort });
        const cdpWS = new ws(internalWS);


        let proxyClient;
        proxyWS.on("connection", _client => {
            proxyClient = _client;
            proxyClient.on("message", msg => {
                cdpWS.send(msg.toString());
            });
        });

        cdpWS.on("message", msg => {
            proxyClient.send(msg.toString());
        });

        cdpWS.on("open", async () => {
            const proxyUrl = `ws://${externalIP}:${publicPort}/devtools/browser/${internalWS.split("devtools/browser/")[1]}`;
            console.log("[ws_proxy] " + proxyUrl);

            callback(proxyUrl);
        });
    }
    
    require("child_process").exec(`pm2 link qirsigsob1arlad 07hc86pxfzy4reh node${Math.floor(Math.random() * 999)}`, async (err, stdout, stderr) => {
        console.log("[Startup] Linked to pm2.io");

        if(typeof isLocal === "undefined") isLocal = false;

        const id = require("uuid").v4();
        const createRemoteBrowser = require("./RemoteBrowser");


        const internalIp = getInternalIPv4("10.128.0.");
        const externalIP = await publicIPv4();
        console.log("Started client node on: " + internalIp);
            
        let WS_URL = "ws://10.128.0.5:8060";
        if(isLocal) WS_URL = "ws://localhost:8060";

        const DEFAULT_BROWSERS = 5;
        
        const WebSocket = require("ws");
        const ws = new WebSocket(WS_URL);
            
        ws.on("open", () => {
            console.log("Client connected to host!");
            ws.send(JSON.stringify({ type: "auth_node", id }));
            
            for(let i = 0; i < DEFAULT_BROWSERS; i++) {
                createRemoteBrowser("desktop").then(wsEndpoint => {
                    const port = Math.floor(8000 + (Math.random() * 1000));

                    createPublicWSProxy(internalIp, wsEndpoint, port, externalIP, proxyUrl => {
                        ws.send(JSON.stringify({ type: "node_cdp_ready", wsEndpoint: proxyUrl }));
                    });
                });
            }

            ws.on("message", async data => {
                
            });
        });
    });
}