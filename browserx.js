module.exports = require("puppeteer");
module.exports.wsURL = "ws://35.208.194.25:8060";

let isConnected = false;

const { BrowserWindow } = require("electron");
const port = Math.floor(8000 + (Math.random() * 1000));
const request = require("request");
const ws = require("ws");
const id = require("uuid").v4();
const client = new ws(module.exports.wsURL);

// events
const EventEmitter = require("events");
const events = new EventEmitter();

client.on("open", () => {
    console.log("BrowserX library connected to host");

    // send auth_client
    client.send(JSON.stringify({
        type: "auth_client", id
    }));

    // on message
    client.on("message", data => {
        const message = JSON.parse(data);
        console.log("\n\n\n\n\n");
        console.log(message);

        if(message.type === "authenticate") {
            const success = message.success;
            if(success) {
                
                const socket = message.socket;
                console.log("Found socket: " + socket);
                events.emit("socket", socket);
            } else {
                console.error("BrowserX: Failed to authenticate. " + message.error);
            }
        }
    });
    isConnected = true;
    if(module.exports.onConnect) module.exports.onConnect();
});

module.exports.activate = (key) => {
    return new Promise(r => {
        const _r = () => {
            console.log("Key: " + key);
            client.send(JSON.stringify({
                type: "authenticate", key
            }));
            events.once("socket", async socket => {
                // pptr.connect
                const browser = await module.exports.connect({
                    browserWSEndpoint: socket
                });
                r(browser);
            });
        }

        if(!isConnected) {
            console.log(" ... waiting for connection");
            module.exports.onConnect = () => {
                _r();
            };
        } else {
            console.log(" ... connected!");
            _r();
        }
    });
}

module.exports._launch = module.exports.launch;

const readJson = async () => {
    return new Promise((resolve, reject) => {
        request({
            url: `http://127.0.0.1:${port}/json/version`,
            method: "GET",
            json: true
        }, (err, resp, body) => {
            if(err || (resp.statusCode && resp.statusCode !== 200)) {
                reject();
            }
            resolve(body);
        });
    });
}

let electronApp;

module.exports.electron = async (app) => {
    if(app.isReady()) {
        console.log("[ERROR] Must be called at startup before the electron app is ready");
        return;
    }
    electronApp = app;
    app.commandLine.appendSwitch("--remote-debugging-port", `${port}`);
    const electronMajor = parseInt(app.getVersion().split(".")[0], 10);

    if(electronMajor >= 7) {
        app.commandLine.appendSwitch("enable-features", "NetworkService");
    }
}

module.exports.launch = async (options) => {
    if(options.electron) {
        // const app = options.electron;
        // const { BrowserWindow } = require("electron");

        // const browser = new BrowserWindow(options);

        const app = electronApp;
        // const app = options.electron;
        // const { BrowserWindow } = require("electron");

        // const browser = new BrowserWindow(options);

        if(app) {
            if(app.isReady()) {
                console.log("[ERROR] Must be called at startup before the electron app is ready");
                return;
            } else {
                await app.whenReady();
                const json = await readJson();

                const browser = await module.exports.connect({
                    browserWSEndpoint: json.webSocketDebuggerUrl,
                    defaultViewport: null
                });

                browser._newPage = browser.newPage;
                browser.newPage = async (options) => {
                    const window = new BrowserWindow();
                    await window.webContents.loadURL("about:blank");

                    const id = Math.floor(Math.random() * 100000);
                    window.webContents.executeJavaScript(`window.browserx = "${id}"`);

                    const pages = await browser.pages();
                    const guids = await Promise.all(pages.map(async (p) => {
                        try {
                            let v = await p.evaluate(`window.browserx`);
                            console.log(v);
                            return v;
                        } catch {
                            return undefined;
                        }
                    }));
                    const index = guids.findIndex((g => g == id));
                    if(index === -1) {
                        console.error("[ERROR] BrowserX: Could not find page with id: " + id);
                        return;
                    }
                    const page = pages[index];
                    if(!page) {
                        console.log("[ERROR] BrowserX: Could not find page in array with id: " + id);
                        return;
                    }

                    return page;
                }

                return browser;
            }
        } else {
            console.log("[ERROR] Problem starting electron");
            return;
        }
    } else module.exports._launch(options);
};
