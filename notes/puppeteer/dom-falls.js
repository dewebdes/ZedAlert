const puppeteer = require('puppeteer');
const prettier = require('prettier');
const fs = require('fs');
const process = require("process");

var baseurl = '';
var page = null;
var browser = null;
var pages = 0;
var cupage = 0;
var payloads = [];

function isnullval(tval) {
    var retval = false;
    try {
        if ((tval == "") || (tval == undefined) || (tval == null) || (tval == NaN) || (jQuery.trim(tval) == "")) { retval = true; }
    } catch (ex) {
        retval = false;
    }
    return retval;
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

async function delay(ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}

var basereflect = '';
var reflectstor = [];

//============= SUMMERY ==============
// make payloads list from parameters text file
// read last index from "index.txt"
// call test_payloads to test parameters one by one
//====================================
async function forever() {

    var dt = await readFile(inputfile);
    cupage = parseInt(await readFile('index.txt'));
    payloads = dt.split('\n');
    pages = payloads.length;
    await test_payloads();

}

//============= SUMMERY ==============
// make payloads list from parameters text file
// read last index from "index.txt"
// call test_payloads to test parameters one by one
//====================================
async function test_payloads() {

    var payl = payloads[cupage];
    console.log(cupage + '/' + pages);

    var headstr = '';
    for (var k = 0; k <= die_heads.length - 1; k++) {
        headstr += (die_heads[k].name + 'nnpp' + die_heads[k].val + 'nndd');
    }

    //============= SUMMERY ==============
    // make final worker url
    // with "parameter[cupage]=scobar"
    //====================================
    var adr = encodeURIComponent('https://' + die_host + die_pat + '?' + payl + '=scobar');
    baseurl = worker + '?dieuri=' + adr + '&diemet=' + die_met + '&diecok=' + encodeURIComponent(die_cook) + '&diehed=' + encodeURIComponent(headstr) + '&diebod=' + encodeURIComponent(die_body);
    var q = baseurl;

    const response = await page.goto(q, { timeout: 0 });

    try {

        var statuscode = response.status();
        //console.log(statuscode);

        //if (statuscode == 200) {
        const responseBody = await response.text();

        var dompaths = await page.evaluate(() => {
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

        //============= SUMMERY ==============
        // make DOM path string cleaner
        // remove numbers and dots
        //====================================
        dompaths = dompaths.toString().replace(new RegExp("[0-9]", "g"), "");
        dompaths = dompaths.toString().replaceAll('.', "");

        var position = dompaths;

        console.log(dompaths + ' = ' + basereflect);


        //============= SUMMERY ==============
        // search for discoverd DOM path in previous finding paths
        //====================================
        var havethis = true;
        if (position.length > 30) {
            var fnd = false;
            var startpos = position.substring(0, 30);
            var endpos = position.substring(position.length - 30);
            for (var k = 0; k <= reflectstor.length - 1; k++) {
                var startpos2 = reflectstor[k].substring(0, 30);
                var endpos2 = reflectstor[k].substring(reflectstor[k].length - 30);
                if ((startpos == startpos2) && (endpos == endpos2)) {
                    fnd = true;
                    break;
                }
            }
            if (fnd == true) {
                havethis = true;
            } else {
                havethis = false;
            }
        } else {
            havethis = false;
        }

        if (reflectstor.indexOf(dompaths) > -1) {
            havethis = true;
        }

        if ((dompaths == basereflect) || (dompaths == 'n') || (havethis == true)) {
            dompaths = 'n';
        } else {
            reflectstor[reflectstor.length] = dompaths.toString();
            dompaths = 'y';
        }

        console.log(payl);
        console.log(payl + ' = ' + dompaths);
        console.log(reflectstor.length);

        //============= SUMMERY ==============
        // if can not find duplicate string in previous paths
        // then append this param to output file
        //====================================
        if (dompaths != 'n') {
            console.log(payl);
            appendToFile(outputfile, payl + ' ===> ' + position + '\n');
        }



        console.log('\n\n');

        //============= SUMMERY ==============
        // make a short delay to fire next request
        // to clear OS RAM from previous browser request
        //====================================
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

//============= SUMMERY ==============
// test unit function
// send a none-exist parameter
// check its path in DOM
// to decide for others parameters 
//====================================
async function test_unit() {

    //============= SUMMERY ==============
    // make headers string
    // each name/value join together with 'nnpp' seprator
    // each coockie items join together with 'nndd' seprator
    //====================================
    var headstr = '';
    for (var k = 0; k <= die_heads.length - 1; k++) {
        headstr += (die_heads[k].name + 'nnpp' + die_heads[k].val + 'nndd');
    }

    //============= SUMMERY ==============
    // make final worker URL string
    // with a fake parameter: scobar=scobar
    //====================================
    var adr = encodeURIComponent('https://' + die_host + die_pat + '?scobar=scobar');
    baseurl = worker + '?dieuri=' + adr + '&diemet=' + die_met + '&diecok=' + encodeURIComponent(die_cook) + '&diehed=' + encodeURIComponent(headstr) + '&diebod=' + encodeURIComponent(die_body);
    var q = baseurl;

    const response = await page.goto(q, { timeout: 0 });

    try {

        var statuscode = response.status();
        console.log(statuscode);

        //if (statuscode == 200) {
        const responseBody = await response.text();

        //============= SUMMERY ==============
        // search for "scobar" word in all DOM objects
        // make a string with concat all finding paths to gether
        // this string is like a DOM signature for target parameter
        //====================================
        var dompaths = await page.evaluate(() => {
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

        //============= SUMMERY ==============
        // set "basereflect" var and append path string to "reflectstor" array 
        // these variables can help us to detect uniqe DOM reflections 
        //====================================
        if (dompaths != 'n') {
            basereflect = dompaths;
            basereflect = basereflect.replace(new RegExp("[0-9]", "g"), "X");
            basereflect = basereflect.toString().replaceAll('.', "");
        }
        console.log(dompaths);
        console.log('base reflect: ' + basereflect + '\n\n');
        reflectstor[reflectstor.length] = basereflect.toString();

        await forever();

    } catch (ex) {
        console.log('server error...\n' + ex.message);
    }
}

//============= SUMMERY ==============
// default entry values
//====================================
var packetfilename = '';
var worker = 'https://lucky-cell-ca4e.eynikave.workers.dev/';
var die_cook = 'null';
var die_heads = [];
var die_body = 'null';
var die_met = 'GET';
var die_pat = '/';
var die_host = '';
var inputfile = 'full-params.txt';
var outputfile = 'dom-params.txt';

//============= SUMMERY ==============
// read burp suite request packet file
// detect parts of packet
// fill entry variables: cookies, heads.... 
//====================================
async function packetreader() {
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

}

(async function main() {

    browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        devtools: true,
        args: ['--window-size=1920,1170', '--window-position=0,0', '--no-sandbox', '--ignore-certificate-errors']
    });
    //'--proxy-server=127.0.0.1:8080'

    page = await browser.newPage();
    await page.setRequestInterception(true);

    //============= SUMMERY ==============
    // Intercept other requests that will send after page loading
    // Fix these request urls and packets to match with worker
    //====================================
    page.on('request', interceptedRequest => {

        if ((interceptedRequest.url().indexOf(worker) > -1) && (interceptedRequest.url().indexOf('dieuri') == -1)) {
            var data = {};
            var newurl = '';
            var pat = interceptedRequest.url().split(worker)[1];
            var headstr = '';
            for (var k = 0; k <= die_heads.length - 1; k++) {
                headstr += (die_heads[k].name + 'nnpp' + die_heads[k].val + 'nndd');
            }
            var adr = encodeURIComponent('https://' + die_host + '/' + pat);

            var newurl = worker + '?dieuri=' + adr + '&diemet=' + 'GET' + '&diecok=' + encodeURIComponent(die_cook) + '&diehed=' + encodeURIComponent(headstr) + '&diebod=' + 'null';
            data.url = newurl;
            interceptedRequest.continue(data);

        } else {
            interceptedRequest.continue();
        }

    });


    //============= SUMMERY ==============
    // get input options from user
    //====================================

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


                    await packetreader();


                    console.log("\n\n**********************************\n\n");

                    console.log('url = ' + die_met + ' https://' + die_host + die_pat);
                    console.log('body: ' + die_body);
                    console.log('\ncookies:\n' + die_cook);
                    console.log('\nheads:\n');
                    for (var k = 0; k <= die_heads.length - 1; k++) {
                        console.log(die_heads[k].name + ' : ' + die_heads[k].val);
                    }

                    await test_unit();

                });
            });
        });

    });


})();


