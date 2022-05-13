const gitpull = require("git-pull");
const fs = require("fs");

const configExists = fs.existsSync("./config.json");
let config;
if(configExists) config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

if(!configExists) {
    config = {
        port: 8060,
        host: "127.0.0.1",
        isLocal: false,
        browsers: 2,
        lastRestart: 0
    };
    fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));
}


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

const internalIP = getInternalIPv4("10.128.0");
let port = config.port;
let host = config.host;
const isLocal = config.isLocal;
const browsers = config.browsers;
const sinceLastRestart = Date.now() - config.lastRestart;

host = "10.128.0.2";
port = 8060;

if(sinceLastRestart > 1000 * 10 || sinceLastRestart < 0) {
    console.log("[Startup] Not enough time since last restart, restarting...");

    config.lastRestart = Date.now();
    fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));

    gitpull(__dirname, (err, out) => {
        process.exit(0);
    });
} else {
    console.log("[Startup] Started node on version " + require("./about.json").version);
    require("./index.js")(host, port, internalIP, isLocal, 15);
}