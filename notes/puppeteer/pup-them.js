const puppeteer = require('puppeteer');
const prettier = require('prettier');
const fs = require('fs');
var request = require('request');
const { spawn } = require("child_process");
const process = require("process");

//============= SUMMERY ==============
// to make an async wait in a function or seprate thread
//====================================
async function delay(ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}

//============= SUMMERY ==============
// async working with files for input/output 
//====================================
async function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', function (err, data) {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}
async function appendToFile(filePath, dataToAppend) {
    try {
        await fs.promises.appendFile(filePath, dataToAppend, 'utf8');
    } catch (error) {
        console.error('Error appending data:', error);
    }
}
async function writeToFile(filePath, dataToWrite) {
    try {
        await fs.promises.writeFile(filePath, dataToWrite, 'utf8');
    } catch (error) {
        console.error('Error writing data:', error);
    }
}

//============= SUMMERY ==============
// sample function to send request with puppeteer
//====================================
async function target_check_1() {

    var q = 'https://time.ir';

    var cando = true;
    const response = await page.goto(q).catch(function (e) {
        cando = false;
        console.error('\n*************connection error: ' + e + '\n');
    });

    if (cando == true) {
        try {

            var statuscode = response.status();
            const responseBody = await response.text();

            //============= SUMMERY ==============
            // execute script after page loading
            // and return its result as variable 
            //====================================
            /*var havexss = await page.evaluate(() => {
                try {
                    if (ismamadseen == 1) { return 'y'; } else { return 'n'; }
                } catch (error) {
                    return 'n';
                }
            });
    
            if (havexss == 'y') {
                console.log(payl);
                appendToFile('okpayloads.txt', q + '\n');
            }*/

                
            //============= SUMMERY ==============
            // take a screenshot from page after loading
            // and save it to app dir...
            //====================================
            /*await page.screenshot({
                path: 'shots/target/' + id + '.jpg'
            });*/


            //============= SUMMERY ==============
            // execute script after small Interval after page loading
            // and return its result as variable 
            //====================================
            /*const getData = async () => {
                return await page2.evaluate(async () => {
                    return await new Promise(resolve => {
                        setTimeout(() => {
                            var dt = JSON.parse(document.body.innerText);
                            resolve(dt);
                        }, (60000))
                    })
                })
            }
            var last_line = await getData();*/


            //============= SUMMERY ==============
            // make a small delay
            // and call function to check next url 
            //====================================
            /*await delay(12000);
            await target_check_1();*/

        } catch (ex) {
            console.log('server error...\n' + ex.message);
            await delay(10000);
            await target_check_1();
        }
    } else {
        await delay(12000);
        await target_check_1();
    }
}

(async function main() {

    browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        devtools: true,
        args: ['--window-size=1920,1170', '--window-position=0,0', '--no-sandbox', '--ignore-certificate-errors']
    });
    //============= SUMMERY ==============
    // to pass puppeteer traffic via proxy
    // use this entry in args:
    // '--proxy-server=127.0.0.1:8080' 
    //====================================

    page = await browser.newPage();
    await page.setRequestInterception(true);

    //============= SUMMERY ==============
    // to intercept and change puppeteer requests on the fly
    //====================================
    /*
    page.on('request', interceptedRequest => {
        var data = {};
        if (metho == 'post') {
            data = {
                'method': 'POST',
                'postData': body
            };
        }
        if (metho == 'get') {
            data = {
                'method': 'GET'
            };
        }
        interceptedRequest.continue(data);
    });
    */

    page.on('error', err => {
        //console.log('1 error happen at the page: ', err);
    });

    page.on('pageerror', pageerr => {
        //console.log('2 pageerror occurred: ', pageerr);
    });

    Promise.allSettled([target_check_1()]);

})();

