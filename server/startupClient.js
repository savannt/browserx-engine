const gitpull = require("git-pull");

console.log("[Startup] Starting client");
const exec = require("child_process").exec;
exec("npm i", (err, stdout, stderr) => {
    console.log("[Startup] Client installed dependencies");

    gitpull(__dirname, (err, out) => {
        console.log("[Startup] Client pulled latest code");
        require("./client.js")(false);
    });
});