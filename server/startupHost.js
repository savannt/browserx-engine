const gitpull = require("git-pull");

console.log("[Startup] Starting host");

require("child_process").exec(`pm2 link qirsigsob1arlad 07hc86pxfzy4reh host${Math.floor(Math.random() * 999)}`, (err, stdout, stderr) => {
    console.log("[Startup] Linked to pm2.io");
    
    gitpull(__dirname, (err, out) => {
        console.log("[Startup] Host pulled latest code");
        require("./host.js");
    });
});


// const exec = require("child_process").exec;
// exec("npm i", (err, stdout, stderr) => {
//     console.log("[Startup] Host installed dependencies");
    
//     exec("pm2 link qirsigsob1arlad 07hc86pxfzy4reh", (err, stdout, stderr) => {
//         console.log("[Startup] Linked to pm2.io");

//         gitpull(__dirname, (err, out) => {
//             console.log("[Startup] Host pulled latest code");
//             require("./host.js");
//         });
//     });
// });