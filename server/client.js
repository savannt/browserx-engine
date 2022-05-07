module.exports = (isLocal) => {
    
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
    
    require("child_process").exec(`pm2 link qirsigsob1arlad 07hc86pxfzy4reh node${Math.floor(Math.random() * 999)}`, (err, stdout, stderr) => {
        console.log("[Startup] Linked to pm2.io");

        if(typeof isLocal === "undefined") isLocal = false;

        const id = require("uuid").v4();
        const createRemoteBrowser = require("./RemoteBrowser");


        const internalIp = getInternalIPv4("10.128.0.");
        console.log("Started client node on: " + internalIp);
            
        let WS_URL = "ws://10.128.0.5:8060";
        if(isLocal) WS_URL = "ws://localhost:8060";

        const DE8FAULT_BROWSERS = 5;
        
        const WebSocket = require("ws");
        const ws = new WebSocket(WS_URL);
            
        ws.on("open", () => {
            console.log("Client connected to host!");
            ws.send(JSON.stringify({ type: "auth_node", id }));
            
            for(let i = 0; i < DEFAULT_BROWSERS; i++) {
                createRemoteBrowser("desktop").then(wsEndpoint => {
                    // replace 127.0.0.1 for internal IP
                    if(!isLocal) wsEndpoint = wsEndpoint.replace("127.0.0.1", internalIp);
                    const port = Math.floor(8000 + (Math.random() * 1000));
                    
                    ws.send(JSON.stringify({ type: "node_cdp_ready", wsEndpoint, port }));
                });
            }

            ws.on("message", async data => {
                
            });
        });
    });
}