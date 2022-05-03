

// What I want to be able to do:


const colors = require("colors");


class Server {
    constructor() {
        this.clients = new Map();
    }


    _safeRetrieveClient(id) {
        if(this.clients.has(id) && !this.clients.get(id).isBusy) return this.clients.get(id);
        return new Promise(resolve => {
            let i = setInterval(() => {
                if(this.clients.has(id)) {
                    if(!this.clients.get(id).isBusy) {
                        clearInterval(i);
                        resolve(this.clients.get(id));
                    }
                }
            }, 100);
        });
    }

    sendWaitResponse (event, id) {
        return new Promise(async resolve => {
            if(id) {
                const client = await this._safeRetrieveClient(id);
                resolve(await client.sendWaitResponse(event));                
            } else {
                let i = setInterval(async () => {
                    // loop entries
                    for(let [id, client] of this.clients) {
                        if(!client.isBusy && client.isReady) {
                            clearInterval(i);

                            const client = await this._safeRetrieveClient(id);

                            resolve(await client.sendWaitResponse(event));         
                        } else {
                            // console.log("BUSY : " + client.isBusy);
                            // console.log("READY:" + client.isReady);
                        }
                    }
                }, 100);
            }
        });
    }


    // call to define the puppeteer script
    ready (callback) {
        this.callback = callback;
    

    async deploy (opt) {
        const instances = opt.instances;
        if(opt && opt.remote) {


            // find amount of servers needed for instances
            // launch amount of servers && send stringified script
            // connect to host websocket
            



        } else {
            for(let i = 0; i < instances; i++) {

                let client = new Client();
                this.clients.set(client.id, client);

                console.log("Launching instance " + (i + 1) + " of " + instances + " -> " + client.id.toString().red);
                this.callback(client);
                await client._waitForReady();
                console.log("Instance " + (i + 1) + " of " + instances + " -> " + client.id.toString().green + " is ready");
                if(opt.start) {
                    console.log("Starting script " + (i + 1) + " of " + instances + " -> " + client.id.toString().cyan);
                    await client.sendWaitResponse(opt.start);
                }
            }
        }
    }
}

class Client {

    constructor () {
        this.id = Math.floor(Math.random() * 1000000);
        const EventEmitter = require("events");
        this.events = new EventEmitter();
        this.isReady = false;
        this.isBusy = false;
    }

    async sendWaitResponse (event) {
        if(!this.isReady) {
            await this._waitForReady();
        }
        const promise = new Promise(resolve => {
            this.isBusy = true;
            const fakeResolve = (data) => {
                this.isBusy = false;
                console.log("Response received " + (data ? JSON.stringify(Object.keys(data)).toString().gray : "undefined".red) + " -> " + event.toString().green + " to " + this.id.toString().cyan);
                resolve(data);
            }
            console.log("Sending " + event.toString().green + " to " + this.id.toString().cyan);
            this.events.emit(event, fakeResolve);
        });
        return promise;
    }

    _waitForReady () {
        return new Promise(r => {
            let i = setInterval(() => {
                if(this.isReady) {
                    clearInterval(i);
                    r();
                }
            }, 100);
        });
    }

    ready (browser, page) {
        this.isReady = true;
        this.events.once("cleanup", () => {
            try {
                page.close();
            } catch (err) {}
            try {
                browser.close();
            } catch (err) {}
        })
    }

    on (event, callback) {
        this.events.on(event, callback);
    }


}




const server = new Server();
server.ready(async (client) => {
    // create puppeteer browser, run script, close browser

    const puppeteer = require("puppeteer");
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();

    await page.goto("https://google.com");
    
    // auto handles cleanup
    client.ready(browser, page);

    client.on("start", resolve => {
        // console.log("Script initialized.".green);
        resolve();
    });

    // commands are executed
    client.on("BodegaNBA", async resolve => {
        // navigate
        // scrap
        // return data

        const base64 = await page.screenshot({
            encoding: "base64"
        });

        resolve({
            base64
        });
    });
});


server.deploy({
    remote: false,
    instances: 1,
    start: "start"
});
















