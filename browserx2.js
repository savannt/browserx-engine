const jwt = require("jsonwebtoken");

const definitions = new Map();

module.exports = require("puppeteer");

module.exports.generateToken = () => {
    return jwt.sign({
        time: Date.now()
    }, "ca982417-654e-48cc-bc96-6c17da20e457");
}

module.exports.define = (name, fn) => {
    if(!name) throw new Error("[browserx] No name provided for browserx.define");
    
    definitions.set(name, fn);
};
module.exports.invoke = async (name, options) => {
    if(!name) throw new Error("[browserx] No name provided for browserx.invoke");

    const fn = definitions.get(name);
    if(!fn) throw new Error("[browserx] No definition found for " + name);

    const browser = await module.exports.connect({
        browserWSEndpoint: `ws://35.208.194.25:8060?token=${module.exports.generateToken()}`
    });
    const page = await browser.newPage();
    let result = await fn(page, options);

    page.close();
    browser.close();
    
    return result;
}