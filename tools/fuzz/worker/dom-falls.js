const puppeteer = require('puppeteer');
const prettier = require('prettier');
//const useProxy = require('puppeteer-page-proxy');
const fs = require('fs');//.promises;
//import fsPromises from "node:fs/promises";
var request = require('request');
const { spawn } = require("child_process");
const process = require("process");
//const inquirer = require('inquirer');


var baseurl = '';

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

    var dt = await readFile(inputfile);
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

var basereflect = '';
var reflectstor = [];
var ascii = 0;

function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (
        (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
    );
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0) costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}


async function test_payloads() {

    var payl = payloads[cupage].trim();
    console.log(cupage + '/' + pages);


    // metho = 'get';
    //await page.setExtraHTTPHeaders({
    //	"Sec-Ch-Ua": "\"(Not(A:Brand\";v=\"8\", \"Chromium\";v=\"101\"","Accept": "application/json, text/plain, */*",'Authorization': 'Bearer ' + token,		"Sec-Ch-Ua-Mobile": "?0", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Safari/537.36", "Sec-Ch-Ua-Platform": "\"Windows\"", "Origin": "https://", "Sec-Fetch-Site": "same-site", "Sec-Fetch-Mode": "cors", "Sec-Fetch-Dest": "empty", "Referer": "https:///", "Accept-Encoding": "gzip, deflate", "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8", "Connection": "close"
    //});

    //var headstr = '';
    //for (var k = 0; k <= die_heads.length - 1; k++) {
    //  headstr += (die_heads[k].name + 'nnpp' + die_heads[k].val + 'nndd');
    //}

    var headstr = die_heads.map(function (elem) {
        return elem.name + 'nnpp' + elem.val;
    }).join("nndd");


    if (isnullval(die_cook) == true) { die_cook = 'null'; }
    if (isnullval(headstr) == true) { headstr = 'null'; }


    var adr = encodeURIComponent('https://' + die_host + die_pat + '?' + payl + '=scobar');

    baseurl = worker + '?dieuri=' + adr + '&diemet=' + die_met + '&diecok=' + encodeURIComponent(die_cook) + '&diehed=' + encodeURIComponent(headstr) + '&diebod=' + encodeURIComponent(die_body);


    //var q = 'http://localhost/dom.html';
    var q = baseurl;



    //var q = baseurl + '?' + payl + '=scobar';
    //console.log(q);
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
                var found = "";

                var isArray = function (test) {
                    return Object.prototype.toString.call(test) === '[object Array]';
                }

                while (stack.length) {
                    try {
                        var fromStack = stack.pop();
                        var obj = fromStack[0];
                        var address = fromStack[1];

                        if (typeof obj == typeof value && obj.indexOf(value) > -1) {
                            found += address + "nnpp";
                            //break;
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

        if (havexss != 'n') {
            var unq = '';
            havexss = havexss.toString().replace(new RegExp("[0-9]", "g"), "");
            havexss = havexss.toString().replaceAll('.', "");

            var havethis = false;
            var refar = havexss.split("nnpp");

            var refi = 0;
            for (let element2 of reflectstor) {

                //

                var refar2 = element2.split("nnpp");
                if (refar2.length == refar.length) {
                    var ln = refar.length;
                    var mid = parseInt(ln / 2);
                    var perc1 = similarity(refar[0], refar2[0]);
                    var perc2 = similarity(refar[ln - 1], refar2[ln - 1]);
                    var perc3 = similarity(refar[mid - 1], refar2[mid - 1]);
                    var cent = ((perc1 + perc2 + perc3) / 3);
                    unq = cent;
                    console.log(++refi + "/" + reflectstor.length + " = " + cent);
                    //console.log("cent = " + cent);
                    if (cent >= 0.7) {
                        havethis = true;
                        break;
                    }
                }
            }

            if (havethis == false) {
                reflectstor[reflectstor.length] = havexss;
                appendToFile(outputfile, payl + '\n');
                console.log("ok = " + payl);
            }


            /*
            
                        for (let element of refar) {
                            if (isnullval(element) == false) {
                                for (let element2 of reflectstor) {
                                    var perc = similarity(element, element2);
                                    console.log(perc);
                                    if (perc >= 0.7) {
                                        havethis = true;
                                        unq = element;
                                        break;
                                    }
                                }
                                if (havethis == true) {
                                    break;
                                }
                            }
                        }
                        if (havethis == false) {
                            appendToFile(outputfile, payl + ' ===> ' + unq + '\n');
                        }
                        for (let element of refar) {
                            if (reflectstor.indexOf(element) == -1) {
                                reflectstor[reflectstor.length] = element;
                            }
                        }
            */

        }

        console.log('\n\n');

        await delay(100);

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

function add2reflectstor(ar) {
    var refar = ar.split("nnpp");
    refar.forEach((element) => {
        if (isnullval(element) == false) {
            if (reflectstor.indexOf(element) == -1) {
                reflectstor[reflectstor.length] = element;
            }
        }
    });
}

async function test_unit() {

    //console.log('\n\n********** test unit ***********/n/n');

    //metho = 'get';

    //console.log('url = ' + die_met + ' https://' + die_host + die_pat);
    //console.log('body: ' + die_body);
    //console.log('\ncookies:\n' + die_cook);
    //console.log('\nheads:\n');

    /*var headstr = '';
    for (var k = 0; k <= die_heads.length - 1; k++) {
        headstr += (die_heads[k].name + 'nnpp' + die_heads[k].val + 'nndd');
    }*/

    var headstr = die_heads.map(function (elem) {
        return elem.name + 'nnpp' + elem.val;
    }).join("nndd");


    if (isnullval(die_cook) == true) { die_cook = 'null'; }
    if (isnullval(headstr) == true) { headstr = 'null'; }

    var adr = encodeURIComponent('https://' + die_host + die_pat + '?scobar=scobar');

    baseurl = worker + '?dieuri=' + adr + '&diemet=' + die_met + '&diecok=' + encodeURIComponent(die_cook) + '&diehed=' + encodeURIComponent(headstr) + '&diebod=' + encodeURIComponent(die_body);


    //var q = 'http://localhost/dom.html';
    var q = baseurl;/// + '?scobar=scobar';

    //console.log(q);
    /*
        page.on("request", interceptedRequest => {
            const url = interceptedRequest.url();
            interceptedRequest.body
            if (url == q) {
              interceptedRequest.respond({
                body: 'test'
              });
            } else {
              interceptedRequest.continue();
            }
          });
          */
    const response = await page.goto(q, { timeout: 0 });


    try {

        var statuscode = response.status();
        //console.log(statuscode);

        //if (statuscode == 200) {
        const responseBody = await response.text();
        //var rspj = JSON.parse(responseBody);

        //console.log(responseBody.length);
        //console.log(responseBody);


        var havexss = await page.evaluate(() => {
            function globalSearch(startObject, value) {
                var stack = [[startObject, '']];
                var searched = [];
                var found = "";

                var isArray = function (test) {
                    return Object.prototype.toString.call(test) === '[object Array]';
                }

                while (stack.length) {
                    try {
                        var fromStack = stack.pop();
                        var obj = fromStack[0];
                        var address = fromStack[1];

                        if (typeof obj == typeof value && obj.indexOf(value) > -1) {
                            found += address + "nnpp";
                            //break;
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

        if (havexss != 'n') {
            basereflect = havexss;
            basereflect = basereflect.replace(new RegExp("[0-9]", "g"), "X");
            basereflect = basereflect.toString().replaceAll('.', "");
            //add2reflectstor(basereflect);
            reflectstor[reflectstor.length] = basereflect;
        }
        //console.log(havexss);

        //console.log('base reflect: ' + basereflect + '\n\n');




    } catch (ex) {
        console.log('server error...\n' + ex.message);
    }


}


var packetfilename = '';
var worker = 'https://throbbing-haze-271c.eynikave.workers.dev/';
var die_cook = 'null';
var die_heads = [];
var die_body = 'null';
var die_met = 'GET';
var die_pat = '/';
var die_host = '';

var inputfile = 'full-params.txt';
var outputfile = 'dom-params.txt';



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

        //console.log("\n\nmethod:\n" + (interceptedRequest.method()) + "\n\n");
        if ((interceptedRequest.url().indexOf(worker) > -1) && (interceptedRequest.url().indexOf('dieurl') == -1)) {
            var data = {};
            var newurl = '';
            var pat = interceptedRequest.url().split(worker)[1];
            var headstr = '';
            for (var k = 0; k <= die_heads.length - 1; k++) {
                headstr += (die_heads[k].name + 'nnpp' + die_heads[k].val + 'nndd');
            }
            var adr = encodeURIComponent('https://' + die_host + '/' + pat);

            var newurl = worker + '?dieuri=' + adr + '&diemet=' + interceptedRequest.method() + '&diecok=' + encodeURIComponent(die_cook) + '&diehed=' + encodeURIComponent(headstr) + '&diebod=' + 'null';
            data.url = newurl;
            data.method = "GET";
            interceptedRequest.continue(data);

        } else {
            if (interceptedRequest.url().indexOf('dieuri') == -1) {
                var data = {};
                var newurl = '';
                var headstr = '';
                for (var k = 0; k <= die_heads.length - 1; k++) {
                    headstr += (die_heads[k].name + 'nnpp' + die_heads[k].val + 'nndd');
                }
                var adr = encodeURIComponent(interceptedRequest.url());

                var newurl = worker + '?dieuri=' + adr + '&diemet=' + interceptedRequest.method() + '&diecok=' + encodeURIComponent(die_cook) + '&diehed=' + encodeURIComponent(headstr) + '&diebod=' + 'null';
                data.url = newurl;
                data.method = "GET";
                interceptedRequest.continue(data);

            } else {
                interceptedRequest.continue();
            }
        }

    });



    const readline = require('node:readline');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question(`packet file name, default "packet":\n`, async name => {
        if (isnullval(name) == true) { packetfilename = 'packet'; } else {
            packetfilename = name;
        }
        console.log(`packet file set to ${packetfilename}!`);
        rl.close();
        console.log('\n\n');



        const r2 = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        r2.question(`worker address, default "${worker}":\n`, async name => {
            if (isnullval(name) == true) { } else {
                worker = name;
            }
            console.log(`worker set to ${worker}!`);
            r2.close();
            console.log('\n\n');

            const r3 = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            r3.question(`parameters file, default "${inputfile}":\n`, async name => {
                if (isnullval(name) == true) { } else {
                    inputfile = name;
                }
                console.log(`parameters file set to ${inputfile}!`);
                r3.close();
                console.log('\n\n');


                const r4 = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                });
                r4.question(`output file, default "${outputfile}":\n`, async name => {
                    if (isnullval(name) == true) { } else {
                        outputfile = name;
                    }
                    console.log(`output file set to ${outputfile}!`);
                    r4.close();
                    console.log('\n\n');

                    await writeToFile('index.txt', '0');
                    await writeToFile(outputfile, '');


                    var packet = await readFile(packetfilename);
                    console.log(packet);

                    var packar = packet.split('\n');

                    var startindex = 2;
                    var endindex = packar.length - 1;



                    for (var i = 0; i <= packar.length - 1; i++) {
                        console.log('\n\n' + i + ':' + packar[i]);
                        console.log('\n\n' + i + ':' + packar[i].trim().charCodeAt(packar[i].trim().length - 1));
                        if (isnullval(packar[i].trim()) == true) {
                            endindex = i;
                        }
                    }

                    die_body = 'null';
                    if (isnullval(packar[packar.length - 1]) == false) {
                        die_body = packar[packar.length - 1].trim();
                    }

                    die_met = 'GET';
                    var tempar = packar[0].split(' ');
                    if (isnullval(tempar[0]) == false) {
                        die_met = tempar[0].trim();
                    }

                    die_pat = '/';
                    var tempar = packar[0].split(' ');
                    if (isnullval(tempar[1]) == false) {
                        die_pat = tempar[1].trim();
                    }

                    die_host = '';
                    var tempar = packar[1].split(' ');
                    if (isnullval(tempar[1]) == false) {
                        die_host = tempar[1].trim();
                    }

                    die_cook = 'null';
                    die_heads = [];

                    for (var j = startindex; j <= endindex - 1; j++) {
                        var el = packar[j];
                        var jar = el.split(':');
                        try {
                            var dname = jar[0].trim();
                            var dval = jar[1].trim();
                            if (dname.toLowerCase() == 'cookie') {
                                die_cook = dval;
                            } else {
                                die_heads[die_heads.length] = { name: dname, val: dval };
                            }
                        } catch (ex) {
                            console.log("eoor:\n" + el);
                        }

                    }

                    console.log("\n\n**********************************\n\n");

                    console.log('url = ' + die_met + ' https://' + die_host + die_pat);
                    console.log('body: ' + die_body);
                    console.log('\ncookies:\n' + die_cook);
                    console.log('\nheads:\n');
                    for (var k = 0; k <= die_heads.length - 1; k++) {
                        console.log(die_heads[k].name + ' : ' + die_heads[k].val);
                    }

                    await test_unit();
                    //console.log('base reflect = ' + basereflect);
                    await forever();


                });
            });
        });

    });
    //await test_unit();
    //console.log('base reflect = ' + basereflect);
    //await forever();

})();


