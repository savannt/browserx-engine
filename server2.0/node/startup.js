const gitpull = require("git-pull");
const fs = require("fs");

// if first start
if (!fs.existsSync("./config.json")) {
    // git pull
    gitpull(__dirname, (err, out) => {
        console.log("[Startup] Pulled latest code, restarting...");
        // create config.json
        fs.writeFileSync("./config.json", JSON.stringify({
            port: 8080,
            host: "localhost",
            isLocal: true,
            browsers: 2,
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
    const browsers = config.browsers;
    const sinceLastRestart = Date.now() - config.lastRestart;

    if(sinceLastRestart > 1000 * 10 || sinceLastRestart < 0) {
        console.log("[Startup] Not enough time since last restart, restarting...");

        fs.writeFileSync("./config.json", JSON.stringify({
            port,
            host,
            isLocal,
            browsers,
            lastRestart: Date.now()
        }));

        process.exit(0);
    }


    console.log("[Startup] Started node on version " + require("./about.json").version);
    require("./index.js")(port, host, isLocal);
}
