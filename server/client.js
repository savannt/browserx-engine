module.exports = (isLocal) => {
    require("child_process").exec(`pm2 link qirsigsob1arlad 07hc86pxfzy4reh node${Math.floor(Math.random() * 999)}`, (err, stdout, stderr) => {
        console.log("[Startup] Linked to pm2.io");

        if(typeof isLocal === "undefined") isLocal = false;

        const id = require("uuid").v4();
        const createRemoteBrowser = require("./RemoteBrowser");


        const internalIp = "127.0.0.1";
        console.log("Started host node on: " + internalIp);
            
        let WS_URL = "ws://35.208.194.25:8060";
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