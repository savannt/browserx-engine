const gitpull = require("git-pull");

gitpull(__dirname, (err, out) => {
    require("./host.js");
});