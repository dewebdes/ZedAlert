const puppeteer = require('puppeteer');
const prettier = require('prettier');
//const useProxy = require('puppeteer-page-proxy'); 
const fs = require('fs');//.promises;
//import fsPromises from "node:fs/promises";
var request = require('request');
const { spawn } = require("child_process");
const process = require("process");
var XLSX = require('xlsx');
const { query } = require('express');

global.config = require('config');
global.h1key = global.config.get('programs.hackerone-key');
global.h1us = global.config.get('programs.hackerone-user');
global.intikey = global.config.get('programs.intigriti-key');
global.spiderUrl = global.config.get('recon.spider-url');
global.outgoing = require('outgoing');
global.queryapi = global.config.get('db.conn');
global.snippet = require('snippet');
global.request = require('request');

var cmdout = '';

function cmd(...command) {
    cmdout = '';
    let p = spawn(command[0], command.slice(1));
    return new Promise((resolveFunc) => {
        p.stdout.on("data", (x) => {
            process.stdout.write(x.toString());
            cmdout += x.toString();
        });
        p.stderr.on("data", (x) => {
            process.stderr.write(x.toString());
        });
        p.on("exit", (code) => {
            resolveFunc(code);
        });
    });
}

const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const { execSync } = require('child_process');
const { url } = require('inspector');

function runcshell(cmd) {
    const data = execSync(
        cmd,
        { encoding: 'utf8', maxBuffer: 500 * 1024 * 1024 }
    ).toString();
    return data;
}


async function delay(ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
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

async function addlog(lg) {
    console.log('Log: ' + lg);
}

async function addnoti(lg) {
    console.log('Notify: ' + lg);
}

var indx = 0;

async function watch_check_1() {

    addlog('targetcheck1');
    var sql = "SELECT * FROM watch WHERE (status='ready') ORDER by udate asc limit 1";
    var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
    console.log(':targetcheck-01' + ':::' + body2 + '\n**endlog**\n');
    var fnd = false;
    var res = [];
    try {
        res = JSON.parse(body2.trim());
        if (res.length > 0) {
            fnd = true;
        }
    } catch (ex) { fnd = false; }

    if (fnd == true) {


        var payl = res[0].url;
        var id = res[0].id;
        console.log(payl);


        metho = 'get';
        //await page.setExtraHTTPHeaders({
        //	"Sec-Ch-Ua": "\"(Not(A:Brand\";v=\"8\", \"Chromium\";v=\"101\"","Accept": "application/json, text/plain, */*",'Authorization': 'Bearer ' + token,		"Sec-Ch-Ua-Mobile": "?0", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Safari/537.36", "Sec-Ch-Ua-Platform": "\"Windows\"", "Origin": "https://", "Sec-Fetch-Site": "same-site", "Sec-Fetch-Mode": "cors", "Sec-Fetch-Dest": "empty", "Referer": "https:///", "Accept-Encoding": "gzip, deflate", "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8", "Connection": "close"
        //});

        var q = payl;

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

                var resp64 = Buffer.from(responseBody).toString('base64');

                var haveupdate = false;
                if (fs.existsSync('hash/' + id + '.txt')) {
                    var cuc = await readFile('hash/' + id + '.txt');
                    if (cuc != resp64) {
                        var sql = "update watch set status='change',udate=now() WHERE (id=" + id + ")";
                        var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
                        console.log(':targetcheck-02' + ':::' + body2 + '\n**endlog**\n');
                        haveupdate = true;
                    }
                } else {
                    //
                }

                await writeToFile('hash/' + id + '.txt', resp64);

                if (haveupdate == true) {
                    console.log('found change in watch ' + id + ' : ' + url);
                    return;
                }

                var sql = "update watch set udate=now() WHERE (id=" + id + ")";
                var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
                console.log(':targetcheck-03' + ':::' + body2 + '\n**endlog**\n');

                await delay(12000);


                //  cupage++;
                //await writeToFile('index.txt', cupage.toString());


                await watch_check_1();

            } catch (ex) {


                console.log('Error in watch ' + id + ' : ' + url);
                return;
            }
        } else {
            console.log('Error in watch ' + id + ' : ' + url);
            return;
        }

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
        //console.log('1 error happen at the page: ', err);
    });

    page.on('pageerror', pageerr => {
        //console.log('2 pageerror occurred: ', pageerr);
    });

    //Promise.allSettled([run(), spider(), target_check_1()]);
    Promise.allSettled([watch_check_1()]);

})();
