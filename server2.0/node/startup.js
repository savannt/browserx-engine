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

const port = config.port;
const host = config.host;
const isLocal = config.isLocal;
const browsers = config.browsers;
const sinceLastRestart = Date.now() - config.lastRestart;

if(sinceLastRestart > 1000 * 10 || sinceLastRestart < 0) {
    console.log("[Startup] Not enough time since last restart, restarting...");
    
    config.lastRestart = Date.now();
    fs.writeFileSync("./config.json", JSON.stringify(config, null, 4));

    gitpull(__dirname, (err, out) => {
        process.exit(0);
    });
} else {
    console.log("[Startup] Started node on version " + require("./about.json").version);
    require("./index.js")(port, host, isLocal);
}