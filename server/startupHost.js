const gitpull = require("git-pull");

console.log("[Startup] Starting host");
const exec = require("child_process").exec;
exec("npm i", (err, stdout, stderr) => {
    console.log("[Startup] Host installed dependencies");
    gitpull(__dirname, (err, out) => {
        console.log("[Startup] Host pulled latest code");
        require("./host.js");
    });
});