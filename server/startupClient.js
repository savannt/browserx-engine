const gitpull = require("git-pull");

console.log("[Startup] Starting client");
const exec = require("child_process").exec;
exec("npm i", (err, stdout, stderr) => {
    console.log("[Startup] Client installed dependencies");

    exec("pm2 link qirsigsob1arlad 07hc86pxfzy4reh", (err, stdout, stderr) => {
        console.log("[Startup] Linked to pm2.io");
    
        gitpull(__dirname, (err, out) => {
            console.log("[Startup] Client pulled latest code");
            require("./client.js")(false);
        });
    });
});