const puppeteer = require('puppeteer');
const prettier = require('prettier');
//const useProxy = require('puppeteer-page-proxy');
const fs = require('fs');//.promises;
//import fsPromises from "node:fs/promises";
var request = require('request');
const { spawn } = require("child_process");
const process = require("process");

var page = null;
var browser = null;
var metho = '';
var body = '';
var pages = 0;
var cupage = 0;
var payloads = [];
var okindex = 1;

function cmd(...command) {
    let p = spawn(command[0], command.slice(1));
    return new Promise((resolveFunc) => {
        p.stdout.on("data", (x) => {
            process.stdout.write(x.toString());
            cmdout = x.toString();
        });
        p.stderr.on("data", (x) => {
            process.stderr.write(x.toString());
        });
        p.on("exit", (code) => {
            resolveFunc(code);
        });
    });
}

function isnullval(tval) {
    var retval = false;
    try {
        if ((tval == "") || (tval == undefined) || (tval == null) || (tval == NaN) || (jQuery.trim(tval) == "")) { retval = true; }
    } catch (ex) {
        retval = false;
    }
    return retval;
}

async function forever() {

    var dt = await readFile('sub.txt');
    cupage = parseInt(await readFile('index.txt'));
    payloads = dt.split('\n');
    pages = payloads.length;
    await test_payloads();

}

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
        //console.log('Data appended successfully!');
    } catch (error) {
        console.error('Error appending data:', error);
    }
}

async function writeToFile(filePath, dataToWrite) {
    try {
        await fs.promises.writeFile(filePath, dataToWrite, 'utf8');
        //console.log('Data written successfully!');
    } catch (error) {
        console.error('Error writing data:', error);
    }
}

function doRequest(dcmd, dval) {
    return new Promise(function (resolve, reject) {
        request({ url: queryapi, qs: { cmd: dcmd, val: dval } }, function (error, res, body) {
            if (!error && res.statusCode === 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });

    });
}

async function delay(ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}

async function test_payloads() {

    var payl = payloads[cupage];
    console.log(cupage + '/' + pages);


    metho = 'get';
    //await page.setExtraHTTPHeaders({
    //	"Sec-Ch-Ua": "\"(Not(A:Brand\";v=\"8\", \"Chromium\";v=\"101\"","Accept": "application/json, text/plain, */*",'Authorization': 'Bearer ' + token,		"Sec-Ch-Ua-Mobile": "?0", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Safari/537.36", "Sec-Ch-Ua-Platform": "\"Windows\"", "Origin": "https://", "Sec-Fetch-Site": "same-site", "Sec-Fetch-Mode": "cors", "Sec-Fetch-Dest": "empty", "Referer": "https:///", "Accept-Encoding": "gzip, deflate", "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8", "Connection": "close"
    //});

    var q = 'http://' + payl;

    var cando = true;
    const response = await page.goto(q).catch(function (e) {
        cando = false;
        console.error('\n*************connection error: ' + e + '\n');
    });

    if (cando == true) {
        try {

            var statuscode = response.status();
            //console.log(statuscode);

            //if (statuscode == 200) {
            const responseBody = await response.text();
            //var rspj = JSON.parse(responseBody);

            /*var havexss = await page.evaluate(() => {
                try {
                    if (ismamadseen == 1) { return 'y'; } else { return 'n'; }
                } catch (error) {
                    return 'n';
                }
            });
    
            if (havexss == 'y') {
                console.log(payl);
                appendToFile('okpayloads.txt', payl + '\n');
            }*/


            await page.screenshot({
                path: 'shots/' + okindex + '.jpg'
            });

            appendToFile('oksub.txt', 'http://' + payl + ' - ' + responseBody.length + '\n');
            okindex++;
            console.log('\nok: ' + payl + '\n');

            /*} else {
                console.log('server error ' + statuscode);
                process.exit(1);
            }*/


            await delay(12000);


            cupage++;
            await writeToFile('index.txt', cupage.toString());


            if (cupage > (pages - 1)) {
                console.log('finished... ');
                process.exit(1);
            }
            await test_payloads();

        } catch (ex) {
            console.log('server error...\n' + ex.message);
            await delay(10000);
            await test_payloads();
        }
    } else {
        cupage++;
        await writeToFile('index.txt', cupage.toString());
        if (cupage > (pages - 1)) {
            console.log('finished... ');
            process.exit(1);
        }
        await delay(12000);
        await test_payloads();
    }

}

(async function main() {

    browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        devtools: true,
        args: ['--window-size=1920,1170', '--window-position=0,0', '--no-sandbox']
    });

    page = await browser.newPage();
    await page.setRequestInterception(true);

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

    page.on('error', err => {
        console.log('1 error happen at the page: ', err);
    });

    page.on('pageerror', pageerr => {
        console.log('2 pageerror occurred: ', pageerr);
    });

    await forever();

})();


