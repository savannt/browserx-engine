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

const hookCDP = async (page) => {
    const _cdp = await page.target().createCDPSession();
    page._cdp = _cdp;

    page.cdp = {
        Browser: {
            close: async () => {
                await page.close();
            },
            getVersion: async () => {
                return await _cdp.send("Browser.getVersion");
            }
        },
        Debugger: {
            continueToLocation: async (location, targetCallFrames) => {
                return await _cdp.send("Debugger.continueToLocation", { location, targetCallFrames });
            },
            disable: async () => {
                return await _cdp.send("Debugger.disable");
            },
            enable: async (maxScriptsCacheSize) => {
                return await _cdp.send("Debugger.enable", { maxScriptsCacheSize });
            },
            evaluateOnCallFrame: async (options) => {
                return await _cdp.send("Debugger.evaluateOnCallFrame", options);
            },
            getPossibleBreakpoints: async (start, end, restrictToFunction) => {
                return await _cdp.send("Debugger.getPossibleBreakpoints", { start, end, restrictToFunction });
            },
            getScriptSource: async (scriptId) => {
                return await _cdp.send("Debugger.getScriptSource", { scriptId });
            },
            pause: async () => {
                return await _cdp.send("Debugger.pause");
            },
            removeBreakpoint: async (breakpointId) => {
                return await _cdp.send("Debugger.removeBreakpoint", { breakpointId });
            },
            resume: async (terminateOnResume) => {
                return await _cdp.send("Debugger.resume", { terminateOnResume });
            },
            searchInContent: async (scriptId, query, caseSensitive, isRegex) => {
                return await _cdp.send("Debugger.searchInContent", { scriptId, query, caseSensitive, isRegex });
            },
            setAsyncCallStackDepth: async (maxDepth) => {
                return await _cdp.send("Debugger.setAsyncCallStackDepth", { maxDepth });
            },
            setBreakpoint: async (location, condition) => {
                return await _cdp.send("Debugger.setBreakpoint", { location, condition });
            },
            setBreakpointByUrl: async (options) => {
                return await _cdp.send("Debugger.setBreakpointByUrl", options);
            },
            setBreakpointsActive: async (active) => {
                return await _cdp.send("Debugger.setBreakpointsActive", { active });
            },
            setInstrumentationBreakpoint: async (instrumentation) => {
                return await _cdp.send("Debugger.setInstrumentationBreakpoint", { instrumentation });
            },
            setPauseOnExceptions: async (state) => {
                return await _cdp.send("Debugger.setPauseOnExceptions", { state });
            },
            setScriptSource: async (scriptId, scriptSource, dryRun) => {
                return await _cdp.send("Debugger.setScriptSource", { scriptId, scriptSource, dryRun });
            },
            setSkipAllPauses: async (skip) => {
                return await _cdp.send("Debugger.setSkipAllPauses", { skip });
            },
            setVariableValue: async (scopeNumber, variableName, newValue, callFrameId) => {
                return await _cdp.send("Debugger.setVariableValue", { scopeNumber, variableName, newValue, callFrameId });
            },
            stepInto: async (breakOnAsyncCall, skipList) => {
                return await _cdp.send("Debugger.stepInto", { breakOnAsyncCall, skipList });
            },
            stepOut: async () => {
                return await _cdp.send("Debugger.stepOut");
            },
            stepOver: async (skipList) => {
                return await _cdp.send("Debugger.stepOver", { skipList });
            }
        },
        DOM: {

        },
        DOMDebugger: {

        },
        Emulation: {
            canEmulate: async () => {
                return await _cdp.send("Emulation.canEmulate");
            },
            clearDeviceMetricsOverride: async () => {
                return await _cdp.send("Emulation.clearDeviceMetricsOverride");
            },
            clearGeolocationOverride: async () => {
                return await _cdp.send("Emulation.clearGeolocationOverride");
            },
            setDefaultBackgroundColorOverride: async (color) => {
                return await _cdp.send("Emulation.setDefaultBackgroundColorOverride", { color });
            },
            setDeviceMetricsOverride: async (options) => {
                return await _cdp.send("Emulation.setDeviceMetricsOverride", options);
            },
            setEmulatedMedia: async (media, features) => {
                return await _cdp.send("Emulation.setEmulatedMedia", { media, features });
            },
            setGeolocationOverride: async (latitude, longitude, accuracy) => {
                return await _cdp.send("Emulation.setGeolocationOverride", { latitude, longitude, accuracy });
            },
            setScriptExecutionDisabled: async (value) => {
                return await _cdp.send("Emulation.setScriptExecutionDisabled", { value });
            },
            setTouchEmulationEnabled: async (enabled, maxTouchPoints) => {
                return await _cdp.send("Emulation.setTouchEmulationEnabled", { enabled, maxTouchPoints });
            },
            setUserAgentOverride: async (userAgent, acceptLanguage, platform, userAgentMetadata) => {
                return await _cdp.send("Emulation.setUserAgentOverride", { userAgent, acceptLanguage, platform, userAgentMetadata });
            },

        },
        Fetch: {
            continueRequest: async (requestId, options) => {
                return await _cdp.send("Fetch.continueRequest", { requestId, ...options });
            },
            continueWithAuth: async (requestId, authChallengeResponse) => {
                return await _cdp.send("Fetch.continueWithAuth", { requestId, authChallengeResponse });
            },
            disable: async () => {
                return await _cdp.send("Fetch.disable");
            },
            enable: async (patterns, handleAuthRequests) => {
                return await _cdp.send("Fetch.enable", { patterns, handleAuthRequests });
            },
            failRequest: async (requestId, errorReason) => {
                return await _cdp.send("Fetch.failRequest", { requestId, errorReason });
            },
            fulfillRequest: async (requestId, responseCode, options) => {
                return await _cdp.send("Fetch.fulfillRequest", { requestId, responseCode, ...options });
            },
            getResponseBody: async (requestId) => {
                return await _cdp.send("Fetch.getResponseBody", { requestId });
            },
            takeResponseBodyAsStream: async (requestId) => {
                return await _cdp.send("Fetch.takeResponseBodyAsStream", { requestId });
            },
        },
        Input: {
            dispatchKeyEvent: async (type, options) => {
                return await _cdp.send("Input.dispatchKeyEvent", { type, ...options });
            },
            dispatchMouseEvent: async (type, x, y, options) => {
                return await _cdp.send("Input.dispatchMouseEvent", { type, x, y, ...options });
            },
            dispatchTouchEvent: async (type, touchPoints, options) => {
                return await _cdp.send("Input.dispatchTouchEvent", { type, touchPoints, ...options });
            },
            setIgnoreInputEvents: async (ignore) => {
                return await _cdp.send("Input.setIgnoreInputEvents", { ignore });
            },

        },
        IO: {
            close: async (handle) => {
                return await _cdp.send("IO.close", { handle });
            },
            read: async (handle, offset, size) => {
                return await _cdp.send("IO.read", { handle, offset, size });
            },
            resolveBlob: async (objectId) => {
                return await _cdp.send("IO.resolveBlob", { objectId });
            },
            
        },
        Log: {
            
        },
        Network: {
            
        },
        Performance: {

        },
        Profiler: {

        },
        Runtime: {

        },
        Security: {

        },
        Target: {

        }
        Page: {
            addScriptToEvaluateOnNewDocument: async (source, worldName, includeCommandLineAPI) => {
                return await _cdp.send("Page.addScriptToEvaluateOnNewDocument", {
                    source, worldName, includeCommandLineAPI
                });
            },
            bringToFront: async () => {
                return await _cdp.send("Page.bringToFront");
            },
            captureScreenshot: async (format, quality, clip, fromSurface, captureBeyondViewport) => {
                return await _cdp.send("Page.captureScreenshot", {
                    format, quality, clip, fromSurface, captureBeyondViewport
                });
            },
            createIsolatedWorld: async (frameId, worldName, grantUniversalAccess) => {
                return await _cdp.send("Page.createIsolatedWorld", {
                    frameId, worldName, grantUniversalAccess
                });
            },
            disable: async () => {
                return await _cdp.send("Page.disable");
            },
            enable: async () => {
                return await _cdp.send("Page.enable");
            },
            getAppManifest: async () => {
                return await _cdp.send("Page.getAppManifest");
            },
            getFrameTree: async () => {
                return await _cdp.send("Page.getFrameTree");
            },
            getLayoutMetrics: async () => {
                return await _cdp.send("Page.getLayoutMetrics");
            },
            getNavigationHistory: async () => {
                return await _cdp.send("Page.getNavigationHistory");
            },
            handleJavaScriptDialog: async (accept, promptText) => {
                return await _cdp.send("Page.handleJavaScriptDialog", {
                    accept, promptText
                });
            },
            navigate: async (url, referrer, transitionType, frameId, referrerPolicy) => {
                return await page._cdp.send("Page.navigate", {
                    url, referrer, transitionType, frameId, referrerPolicy
                });
            },
            navigateToHistoryEntry: async (entryId) => {
                return await _cdp.send("Page.navigateToHistoryEntry", {
                    entryId
                });
            },
            printToPDF: async (options) => {
                return await _cdp.send("Page.printToPDF", options);
            },
            reload: async (ignoreCache, scriptToEvaluateOnLoad) => {
                return await _cdp.send("Page.reload", {
                    ignoreCache, scriptToEvaluateOnLoad
                });
            },
            removeScriptToEvaluateOnNewDocument: async (identifier) => {
                return await _cdp.send("Page.removeScriptToEvaluateOnNewDocument", {
                    identifier
                });
            },
            resetNavigationHistory: async () => {
                return await _cdp.send("Page.resetNavigationHistory");
            },
            setDocumentContent: async (frameId, html) => {
                return await _cdp.send("Page.setDocumentContent", {
                    frameId, html
                });
            },
            stopLoading: async () => {
                return await _cdp.send("Page.stopLoading");
            },
            clearGeolocationOverride: async () => {
                return await _cdp.send("Page.clearGeolocationOverride");
            },
            setGeolocationOverride: async (latitude, longitude, accuracy) => {
                return await _cdp.send("Page.setGeolocationOverride", {
                    latitude, longitude, accuracy
                });
            },
            addCompilationCache: async (url, data) => {
                return await _cdp.send("Page.addCompilationCache", {
                    url, data
                });
            },
            captureSnapshot: async (format) => {
                return await _cdp.send("Page.captureSnapshot", {
                    format
                });
            },
            clearCompilationCache: async () => {
                return await _cdp.send("Page.clearCompilationCache");
            },
            close: async () => {
                return await _cdp.send("Page.close");
            },
            crash: async () => {
                return await _cdp.send("Page.crash");
            },
            generateTestReport: async (message, group) => {
                return await _cdp.send("Page.generateTestReport", {
                    message, group
                });
            },
            getAppId: async () => {
                return await _cdp.send("Page.getAppId");
            },
            getInstallabilityErrors: async () => {
                return await _cdp.send("Page.getInstallabilityErrors");
            },
            getManifestIcons: async () => {
                return await _cdp.send("Page.getManifestIcons");
            },
            getOriginTrials: async () => {
                return await _cdp.send("Page.getOriginTrials");
            },
            getPermissionsPolicyState: async (frameId) => {
                return await _cdp.send("Page.getPermissionsPolicyState", {
                    frameId
                });
            },
            getResourceContent: async (frameId, url) => {
                return await _cdp.send("Page.getResourceContent", {
                    frameId, url
                });
            },
            getResourceTree: async () => {
                return await _cdp.send("Page.getResourceTree");
            },
            produceCompilationCache: async (scripts) => {
                return await _cdp.send("Page.produceCompilationCache", {
                    scripts
                });
            },
            screencastFrameAck: async (sessionId) => {
                return await _cdp.send("Page.screencastFrameAck", {
                    sessionId
                });
            },
            searchInResource: async (frameId, url, query, caseSensitive, isRegex) => {
                return await _cdp.send("Page.searchInResource", {
                    frameId, url, query, caseSensitive, isRegex
                });
            },
            setAdBlockingEnabled: async (enabled) => {
                return await _cdp.send("Page.setAdBlockingEnabled", {
                    enabled
                });
            },
            setBypassCSP: async (enabled) => {
                return await _cdp.send("Page.setBypassCSP", {
                    enabled
                });
            },
            setFontFamilies: async (fontFamilies, forScripts) => {
                return await _cdp.send("Page.setFontFamilies", {
                    fontFamilies, forScripts
                });
            },
            setFontSizes: async (fontSizes) => {
                return await _cdp.send("Page.setFontSizes", {
                    fontSizes
                });
            },
            setInterceptFileChooserDialog: async (enabled) => {
                return await _cdp.send("Page.setInterceptFileChooserDialog", {
                    enabled
                });
            },
            setLifecycleEventsEnabled: async (enabled) => {
                return await _cdp.send("Page.setLifecycleEventsEnabled", {
                    enabled
                });
            },
            setSPCTransactionMode: async (mode) => {
                return await _cdp.send("Page.setSPCTransactionMode", {
                    mode
                });
            },
            setWebLifecycleState: async (state) => {
                return await _cdp.send("Page.setWebLifecycleState", {
                    state
                });
            },
            startScreencast: async (format, quality, maxWidth, maxHeight, everyNthFrame) => {
                return await _cdp.send("Page.startScreencast", {
                    format, quality, maxWidth, maxHeight, everyNthFrame
                });
            },
            stopScreencast: async () => {
                return await _cdp.send("Page.stopScreencast");
            },
            waitForDebugger: async () => {
                return await _cdp.send("Page.waitForDebugger");
            },
            addScriptToEvaluateOnNewDocument: async (scriptSource) => {
                return await _cdp.send("Page.addScriptToEvaluateOnNewDocument", {
                    scriptSource
                });
            },
            clearDeviceMetricsOverride: async () => {
                return await _cdp.send("Page.clearDeviceMetricsOverride");
            },
            clearDeviceOrientationOverride: async () => {
                return await _cdp.send("Page.clearDeviceOrientationOverride");
            },
            deleteCookie: async (cookieName, url) => {
                return await _cdp.send("Page.deleteCookie", {
                    cookieName, url
                });
            },
            getCookies: async () => {
                return await _cdp.send("Page.getCookies");
            },
            removeScriptToEvaluateOnLoad: async (identifier) => {
                return await _cdp.send("Page.removeScriptToEvaluateOnLoad", {
                    identifier
                });
            },
            setDeviceMetricsOverride: async (options) => {
                return await _cdp.send("Page.setDeviceMetricsOverride", options);
            },
            setDeviceOrientationOverride: async (alpha, beta, gamma) => {
                return await _cdp.send("Page.setDeviceOrientationOverride", {
                    alpha, beta, gamma
                });
            },
            setDownloadBehavior: async (behavior, downloadPath) => {
                return await _cdp.send("Page.setDownloadBehavior", {
                    behavior, downloadPath
                });
            },
            setTouchEmulationEnabled: async (enabled, configuration) => {
                return await _cdp.send("Page.setTouchEmulationEnabled", {
                    enabled, configuration
                });
            },
        }
    }
    return page;
}

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
    } else {
        const browser = await module.exports._launch(options);

        browser._newPage = browser.newPage;
        browser.newPage = async () => {
            let page = await browser._newPage();
            page = await hookCDP(page);
            return page;
        }

        return browser;
    }
};
