const gitpull = require("git-pull");
const fs = require("fs");

// if first start
if (!fs.existsSync("./config.json")) {
    // git pull
    gitpull(__dirname, (err, out) => {
        console.log("[Startup] Pulled latest code, restarting...");
        // create config.json
        fs.writeFileSync("./config.json", JSON.stringify({
            port: 8060,
            host: "127.0.0.1",
            isLocal: false,
            lastRestart: Date.now()
        }));
        // stop process, pm2 will auto start again
        process.exit(0);
    });
} else {
    const config = require("./config.json");
    const port = config.port;
    const host = config.host;
    const isLocal = config.isLocal;
    console.log(Date.now());
    console.log(config.lastRestart);
    const sinceLastRestart = Date.now() - config.lastRestart;

    console.log("[Startup] Time since last restart: " + sinceLastRestart + "ms");
    if(sinceLastRestart > 1000 * 10 || sinceLastRestart < 0) {
        console.log("[Startup] Not enough time since last restart, restarting...");

        fs.writeFileSync("./config.json", JSON.stringify({
            port,
            host,
            isLocal,
            lastRestart: Date.now()
        }));

        process.exit(0);
    }


    console.log("[Startup] Started host on version " + require("./about.json").version);
    require("./index.js")(port, host, isLocal);
}
