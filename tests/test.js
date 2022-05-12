const publicIPv4 = () => {
    return new Promise(r => {
        const https = require("https");
        https.get("https://api.ipify.org?format=json", (resp) => {
            let data = "";
            resp.on("data", chunk => {
                data += chunk;
            });

            resp.on("end", () => {
                data = JSON.parse(data);
                if(data.ip) r(data.ip);
                else r(false);
            });
        }).on("error", () => r(false));
    });
};

publicIPv4().then(ip => {
    console.log(ip);
});