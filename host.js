console.log("Started!");

const express = require("express");
const app = express();

const { uuid } = require("uuidv4");

// create WS server for other nodes to connect to
const ws = require("ws");
const server = new ws.Server({ port: 8060 });


let nodeMap = new Map();

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
                
                const _uuid = uuid();

                // we have found a node that has no connections
                value.client.send(JSON.stringify({
                    type: "create",
                    uuid: _uuid,
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

app.get("/delete", (req, res) => {

});

app.get("/create", (req, res) => {
    const uuid = uuid();
    createBrowser.then(data => {
        res.send(JSON.stringify(data));
    });
});

app.listen(process.env.port || 8070);