module.exports = (isLocal) => {
    if(typeof isLocal === "undefined") isLocal = false;

    const id = require("uuid").v4();
    const createRemoteBrowser = require("./RemoteBrowser");



    require("local-ipv4-address")().then(internalIp => {
        console.log("Started host node on: " + internalIp);
        
        let WS_URL = "ws://10.128.0.7:8060";
        if(isLocal) WS_URL = "ws://localhost:8060";

        const DEFAULT_BROWSERS = 2;
        
        const WebSocket = require("ws");
        const ws = new WebSocket(WS_URL);
            
        ws.on("open", () => {
            ws.send(JSON.stringify({ type: "auth_node", id }));
        
            ws.on("message", async data => {
                
            });
        });
        
        for(let i = 0; i < DEFAULT_BROWSERS; i++) {
            createRemoteBrowser("desktop").then(wsEndpoint => {
                // replace 127.0.0.1 for internal IP
                if(!isLocal) wsEndpoint = wsEndpoint.replace("127.0.0.1", internalIp);
                const port = Math.floor(8000 + (Math.random() * 1000));
                
                ws.send(JSON.stringify({ type: "node_cdp_ready", wsEndpoint, port }));
            });
        }
    });
}