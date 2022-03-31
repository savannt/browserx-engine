module.exports = async (emulation) => {
    emulation = emulation.toLowerCase();

    const stealth = require("puppeteer-extra-plugin-stealth")();
    // const UserAgentOverride = require('puppeteer-extra-plugin-stealth/evasions/user-agent-override')
    
    let userAgent;
    if(emulation === "iphone") {
        stealth.enabledEvasions.delete('chrome.app');
        stealth.enabledEvasions.delete('chrome.csi');
        stealth.enabledEvasions.delete('chrome.loadTimes');
        stealth.enabledEvasions.delete('chrome.runtime');
        stealth.enabledEvasions.delete('iframe.contentWindow');
        stealth.enabledEvasions.delete('media.codecs');
        stealth.enabledEvasions.delete('navigator.hardwareConcurrency');
        stealth.enabledEvasions.delete('navigator.languages');
        stealth.enabledEvasions.delete('navigator.plugins');
        stealth.enabledEvasions.delete('navigator.vendor');
        stealth.enabledEvasions.delete('user-agent-override');
        stealth.enabledEvasions.delete('webgl.vendor');
        userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.1 Mobile/15E148 Safari/604.1";
    } else if(emulation === "none") {
        userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36";
    }
    const pup = require("puppeteer-extra").use(stealth);
    const chromePaths = require("chrome-paths");

    const browser = await pup.launch({
        // executablePath: this.pup.executablePath().replace('app.asar', 'app.asar.unpacked'),
        executablePath: chromePaths.chrome,
        headless: true,
        devtools: false,
        args: [
            '--autoplay-policy=user-gesture-required',
            '--disable-background-networking',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-breakpad',
            '--disable-client-side-phishing-detection',
            '--disable-component-update',
            '--disable-default-apps',
            '--disable-dev-shm-usage',
            '--disable-domain-reliability',
            '--disable-extensions',
            '--disable-features=AudioServiceOutOfProcess',
            '--disable-hang-monitor',
            '--disable-ipc-flooding-protection',
            '--disable-notifications',
            '--disable-offer-store-unmasked-wallet-cards',
            '--disable-popup-blocking',
            '--disable-print-preview',
            '--disable-prompt-on-repost',
            '--disable-renderer-backgrounding',
            '--disable-setuid-sandbox',
            '--disable-speech-api',
            '--disable-sync',
            '--hide-scrollbars',
            '--ignore-gpu-blacklist',
            '--metrics-recording-only',
            '--mute-audio',
            '--no-default-browser-check',
            '--no-first-run',
            '--no-pings',
            '--no-sandbox',
            '--no-zygote',
            '--password-store=basic',
            '--use-gl=swiftshader',
            '--use-mock-keychain',
            `--user-agent=${this.userAgent}`,
            '--no-sandbox',
            '--disable-infobars'
        ]
    });
    return browser.wsEndpoint();
}