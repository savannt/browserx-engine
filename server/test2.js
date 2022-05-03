const createRemoteBrowser = require("./RemoteBrowser");
createRemoteBrowser("none").then(v => {
    console.log(v);
});