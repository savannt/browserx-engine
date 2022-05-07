const getInternalIPv4 = (includes) => {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if(net.family === "IPv4" || net.family === 4) {
                if(net.address.includes(includes)) {
                    return net.address;
                }
            }
        }
    }
    return "127.0.0.1";
}
console.log(getInternalIPv4("10.128.0."));