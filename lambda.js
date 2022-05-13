// const browserx = require("./browserx");
// browserx.authorizeCloud("ca982417-654e-48cc-bc96-6c17da20e457");

// browserx.define("draftkingsMLB", async (page, options) => {
//     await page.goto("https://sportsbook.draftkings.com/featured");
//     await page.click(".sportsbook-navigation-item.sportsbook-navigation-item--league");
//     return await page.screenshot({ path: "draftkings.png" });
// });

// browserx.invoke("draftkingsMLB").then(result => {
//     console.log(result);
// });

// // setInterval(() => {
// //     browserx.invoke("screenshotGoogle").then((result) => {
// //         console.log("Screenshot image!");
// //     });
// // }, 1000);

const DRAFTKINGS_BASEBALL_CATEGORY = "#subcategory_Baseball";
const DRAFTKINGS_HOCKEY_CATEGORY = "#subcategory_Hockey";
const DRAFTKINGS_BASKETBALL_CATEGORY = "#subcategory_Basketball";
const DRAFTKINGS_FOOTBALL_CATEGORY = "#subcategory_Football";
const DRAFTKINGS_MMA_CATEGORY = "#subcategory_MMA";
const DRAFTKINGS_GOLF_CATEGORY = "#subcategory_Golf";
const DRAFTKINGS_SOCCER_CATEGORY = "#subcategory_Soccer";
const DRAFTKINGS_TENNIS_CATEGORY = "#subcategory_Tennis";
const DRAFTKINGS_MOTORSPORTS_CATEGORY = "#subcategory_Motorsports";
const DRAFTKINGS_BOXING_CATEGORY = "#subcategory_Boxing";
const DRAFTKINGS_CRICKET_CATEGORY = "#subcategory_Cricket";
const DRAFTKINGS_DARTS_CATEGORY = "#subcategory_Darts";


(async () => {
    const puppeteer = require("puppeteer");
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();

    
    const fetchPattern = (body) => {
        let template = {
            team1: {},
            team2: {},
        };

        let j = 0;
        let tr = $(body);
        tr.find("*").each((i, ee) => {
            const e = $(ee);
            if (e.children().length === 0) {
                const text = e.text();
                if(text.length > 0) {

                    if((text.includes("AM") || text.includes("PM") && text.includes(":"))) {
                        if(j !== 0) {
                            // END OF LINE
                            template.end = j;
                        }
                    }

                    j++;
                }
            }
        });
        return template;
    }


    // inject pattern library
    await page.evaluateOnNewDocument(() => {
        window._getPairs = (template, body) => {
            let pairs = [];
            let pair = {
                team1: {},
                team2: {},
            };

            let j = 0;
            let tr = $(body);
            tr.find("*").each((i, ee) => {
                const e = $(ee);
                if (e.children().length === 0) {
                    const text = e.text();
                    if(text.length > 0) {
                        if(j === template.time) {
                            pair.time = text;
                        }
    
                        if(j === template.team1.name) {
                            pair.team1.name = text;
                        }
    
                        if(j === template.team1.spread) {
                            pair.team1.spread = parseInt(text);
                        }
    
                        if(j === template.team1.total) {
                            pair.team1.total = parseInt(text);
                        }
    
                        if(j === template.team1.moneyline) {
                            pair.team1.moneyline = parseInt(text);
                        }
    
                        if(j === template.team2.name) {
                            pair.team2.name = text;
                        }
    
                        if(j === template.team2.spread) {
                            pair.team2.spread = parseInt(text);
                        }
    
                        if(j === template.team2.total) {
                            pair.team2.total = parseInt(text);
                        }
    
                        if(j === template.team2.moneyline) {
                            pair.team2.moneyline = parseInt(text);
                        }
    
                        if(j === template.end) {
                            j = 0;
                            pairs.push(pair);
                            pair = { team1: {}, team2: {} };
                            return;
                        }
                        j++;
                    }
                }
            });
            return pairs;
        };
    });

    await page.goto("https://sportsbook.draftkings.com/featured?category=game-lines");
    await page.click(DRAFTKINGS_HOCKEY_CATEGORY);

    await (await page.evaluate(() => {
        return new Promise(resolve => {
            const script = document.createElement("script");
            script.src = "//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js";
            script.id = "jquery";
            script.onload = () => {
                resolve();
            }
            document.body.appendChild(script);
        });
    }));

    const values = await page.evaluate(() => {
        let template = {
            "time": 0,
            "team1": {
                "name": 1,
                "spread": 4,
                "total": 8,
                "moneyline": 9,
            },
            "team2": {
                "name": 11,
                "spread": 14,
                "total": 18,
                "moneyline": 19,
            },
            "end": 19,
        }
        return window._getPairs(template, ".sportsbook-table__body tr");
    });
    console.log(values);
})();