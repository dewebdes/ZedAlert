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

    extract_parts();
    console.log('\n\n===========================\n\n');
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


async function test_payloads0() {


    var headstr2 = '';
    var die_pat2 = die_pat.split('?')[0] + '?';
    var die_cook2 = '';

    for (var i = 0; i <= all_parts.length - 1; i++) {
        if (i == part_i) { continue; }
        if (all_parts[i].force == true) {
            var tpart = all_parts[i];
            switch (tpart.part) {
                case 'path':
                    die_pat2 += tpart.name + '=' + tpart.val + '&';
                    break;
                case 'header':
                    headstr2 += tpart.name + 'nnpp' + tpart.val + 'nndd';
                    break;
                case 'cookie':
                    die_cook2 += tpart.name + '=' + tpart.val + ';  ';
                    break;
            }
        }
    }


    var adr = encodeURIComponent('https://' + die_host + die_pat2);

    baseurl = worker + '?dieuri=' + adr + '&diemet=' + die_met + '&diecok=' + encodeURIComponent(die_cook2) + '&diehed=' + encodeURIComponent(headstr2) + '&diebod=' + encodeURIComponent(die_body);


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
        //console.log('resp: ' + responseBody.length);
        //var rspj = JSON.parse(responseBody);

        if ((statuscode != basestatus) || (responseBody != baseresponse)) {
            all_parts[part_i].force = true;
        } else {
            all_parts[part_i].force = false;
            console.log(part_i + ' is not force: ' + all_parts[part_i].part + ' , ' + all_parts[part_i].name + ' , ' + all_parts[part_i].val);
        }

        await delay(100);


        part_i++;


        if (part_i > (all_parts.length - 1)) {
            //console.log('finished... ');
            //process.exit(1);
            await make_clean_packet();
            return;
        }
        await test_payloads();

    } catch (ex) {
        console.log('server error...\n' + ex.message);
        await delay(10000);
        await test_payloads();
    }


}

async function test_payloads() {

    var headstr = '';
    for (var k = 0; k <= die_heads.length - 1; k++) {
        headstr += (die_heads[k].name + 'nnpp' + die_heads[k].val + 'nndd');
    }

    var headstr2 = headstr;
    var die_pat2 = die_pat;
    var die_cook2 = die_cook;

    for (var i = 0; i <= all_parts.length - 1; i++) {
        if ((i == part_i) || (all_parts[i].force == false)) {
            var tpart = all_parts[i];
            switch (tpart.part) {
                case 'path':
                    var tstr = tpart.name + '=' + tpart.val;
                    die_pat2 = die_pat2.replaceAll(tstr + '&', '');
                    die_pat2 = die_pat2.replaceAll(tstr, '');
                    break;
                case 'header':
                    var tstr = tpart.name + 'nnpp' + tpart.val;
                    headstr2 = headstr2.replaceAll(tstr + 'nndd', '');
                    headstr2 = headstr2.replaceAll(tstr, '');
                    break;
                case 'cookie':
                    var tstr = tpart.name + '=' + tpart.val;
                    die_cook2 = die_cook2.replaceAll(tstr + ';', '');
                    die_cook2 = die_cook2.replaceAll(tstr, '');
                    break;
            }
        }
    }

    if (isnullval(die_cook2.trim()) == true) { die_cook2 = 'null'; }
    if (isnullval(headstr2.trim()) == true) { headstr2 = 'null'; }

    var adr = encodeURIComponent('https://' + die_host + die_pat2);

    baseurl = worker + '?dieuri=' + adr + '&diemet=' + die_met + '&diecok=' + encodeURIComponent(die_cook2) + '&diehed=' + encodeURIComponent(headstr2) + '&diebod=' + encodeURIComponent(die_body);


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
        //console.log('resp: ' + responseBody.length);
        //var rspj = JSON.parse(responseBody);

        if ((statuscode != basestatus) || (responseBody != baseresponse)) {
            all_parts[part_i].force = true;
        } else {
            all_parts[part_i].force = false;
            console.log(part_i + ' is not force: ' + all_parts[part_i].part + ' , ' + all_parts[part_i].name + ' , ' + all_parts[part_i].val);
        }


        part_i++;

        await delay(100);





        if (part_i > (all_parts.length - 1)) {
            //console.log('finished... ');
            //process.exit(1);
            await final_payload();
            await make_clean_packet();
            return;
        }
        await test_payloads();

    } catch (ex) {
        console.log('server error...\n' + ex.message);
        await delay(10000);
        await test_payloads();
    }


}


async function final_payload() {

    var headstr = '';
    for (var k = 0; k <= die_heads.length - 1; k++) {
        headstr += (die_heads[k].name + 'nnpp' + die_heads[k].val + 'nndd');
    }

    var headstr2 = headstr;
    var die_pat2 = die_pat;
    var die_cook2 = die_cook;

    for (var i = 0; i <= all_parts.length - 1; i++) {
        if ((all_parts[i].force == false)) {
            var tpart = all_parts[i];
            switch (tpart.part) {
                case 'path':
                    var tstr = tpart.name + '=' + tpart.val;
                    die_pat2 = die_pat2.replaceAll(tstr + '&', '');
                    die_pat2 = die_pat2.replaceAll(tstr, '');
                    break;
                case 'header':
                    var tstr = tpart.name + 'nnpp' + tpart.val;
                    headstr2 = headstr2.replaceAll(tstr + 'nndd', '');
                    headstr2 = headstr2.replaceAll(tstr, '');
                    break;
                case 'cookie':
                    var tstr = tpart.name + '=' + tpart.val;
                    die_cook2 = die_cook2.replaceAll(tstr + ';', '');
                    die_cook2 = die_cook2.replaceAll(tstr, '');
                    break;
            }
        }
    }

    if (isnullval(die_cook2.trim()) == true) { die_cook2 = 'null'; }
    if (isnullval(headstr2.trim()) == true) { headstr2 = 'null'; }

    var adr = encodeURIComponent('https://' + die_host + die_pat2);

    baseurl = worker + '?dieuri=' + adr + '&diemet=' + die_met + '&diecok=' + encodeURIComponent(die_cook2) + '&diehed=' + encodeURIComponent(headstr2) + '&diebod=' + encodeURIComponent(die_body);


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
        //console.log('resp: ' + responseBody.length);
        //var rspj = JSON.parse(responseBody);

        if ((statuscode != basestatus) || (responseBody != baseresponse)) {
            console.log('******************* FALSE *********************');
            //all_parts[part_i].force = true;
        } else {
            console.log('******************* TRUE *********************');
            //all_parts[part_i].force = false;
            //console.log(part_i + ' is not force: ' + all_parts[part_i].part + ' , ' + all_parts[part_i].name + ' , ' + all_parts[part_i].val);
        }



    } catch (ex) {
        console.log('server error...\n' + ex.message);
    }


}



async function make_clean_packet() {

    var newpacket = '';

    var dieuri = "https://" + die_host + die_pat.split('?')[0] + '?';
    var diemet = die_met;
    var diecok = "";
    var diehed = "";
    var diebod = (die_body);


    var pathar = all_parts.filter(function (el) {
        return el.force == true &&
            el.part == "path";
    });
    var querys = pathar.map((el) => `${el.name}=${el.val}`);
    let queryparams = querys.join("&");
    dieuri += queryparams;

    var cookar = all_parts.filter(function (el) {
        return el.force == true &&
            el.part == "cookie";
    });
    var cooks = cookar.map((el) => `${el.name}=${el.val}`);
    diecok = cooks.join(";");

    var hedar = all_parts.filter(function (el) {
        return el.force == true &&
            el.part == "header";
    });
    var heds = hedar.map((el) => `${el.name}nnpp${el.val}`);
    diehed = heds.join("nndd");




    await writeToFile('packet_clean', '');

    var newpacket = '';
    newpacket += die_met + ' ' + die_pat.split('?')[0] + '?';
    for (var i = 0; i <= all_parts.length - 1; i++) {
        if ((all_parts[i].part == 'path') && (all_parts[i].force == true)) {
            if (dieuri.indexOf(all_parts[i].name) == -1) {
                dieuri += "&" + all_parts[i].name;
            }
            newpacket += all_parts[i].name + '=' + all_parts[i].val + '&';
        }
    }
    newpacket += ' ' + die_http + '\r\n';
    newpacket += 'Host: ' + die_host + '\r\n';
    newpacket += 'Cookie: ';
    for (var i = 0; i <= all_parts.length - 1; i++) {
        if ((all_parts[i].part == 'cookie') && (all_parts[i].force == true)) {
            if (diecok.indexOf(all_parts[i].name) == -1) {
                diecok += ";" + all_parts[i].name;
            }
            newpacket += all_parts[i].name + '=' + all_parts[i].val + '; ';
        }
    }
    newpacket += '\r\n';
    for (var i = 0; i <= all_parts.length - 1; i++) {
        if ((all_parts[i].part == 'header') && (all_parts[i].force == true)) {
            if (diehed.indexOf(all_parts[i].name) == -1) {
                diehed += "nndd" + all_parts[i].name;
            }
            newpacket += all_parts[i].name + ': ' + all_parts[i].val + '\r\n';
        }
    }
    newpacket += '\r\n';
    if (die_body != 'null') {
        newpacket += die_body;
    }

    if (isnullval(diecok) == true) { diecok = 'null'; }
    if (isnullval(diehed) == true) { diehed = 'null'; }


    var cleanpackstr = await readFile('cleanpacket');
    cleanpackstr = cleanpackstr.replaceAll("{{uri}}", encodeURIComponent(dieuri));
    cleanpackstr = cleanpackstr.replaceAll("{{method}}", encodeURIComponent(diemet));
    cleanpackstr = cleanpackstr.replaceAll("{{cook}}", encodeURIComponent(diecok));
    cleanpackstr = cleanpackstr.replaceAll("{{head}}", encodeURIComponent(diehed));
    cleanpackstr = cleanpackstr.replaceAll("{{body}}", encodeURIComponent(diebod));

    var tt = new Date().valueOf().toString();
    await writeToFile("clean_packet_" + tt, cleanpackstr);





    await writeToFile('packet_clean', newpacket);

    console.log('\n\nclean packet created...finish ' + tt);

    //console.log('\n\nclean packet created.\nuse last request packet in burp...👻');

    process.exit(1);



    var headstr2 = '';
    var die_pat2 = die_pat.split('?')[0] + '?';
    var die_cook2 = '';

    for (var i = 0; i <= all_parts.length - 1; i++) {
        if (i == part_i) { continue; }
        if (all_parts[i].force == true) {
            var tpart = all_parts[i];
            switch (tpart.part) {
                case 'path':
                    die_pat2 += tpart.name + '=' + tpart.val + '&';
                    break;
                case 'header':
                    headstr2 += tpart.name + 'nnpp' + tpart.val + 'nndd';
                    break;
                case 'cookie':
                    die_cook2 += tpart.name + '=' + tpart.val + ';  ';
                    break;
            }
        }
    }


    var adr = encodeURIComponent('https://' + die_host + die_pat2);

    baseurl = worker + '?dieuri=' + adr + '&diemet=' + die_met + '&diecok=' + encodeURIComponent(die_cook2) + '&diehed=' + encodeURIComponent(headstr2) + '&diebod=' + encodeURIComponent(die_body);

    console.log(baseurl);









    process.exit(1);
}

var baseresponse = '';
var basestatus = '';

var all_parts = [];
var part_i = 0;


function extract_parts() {
    var ar1 = die_pat.split('?')[1].split('&');
    for (var i = 0; i <= ar1.length - 1; i++) {
        var ar2 = ar1[i].split('=');
        all_parts[all_parts.length] = { part: 'path', name: ar2[0], val: ar2[1], force: true };
    }
    var ar1 = die_cook.split(';');
    for (var i = 0; i <= ar1.length - 1; i++) {
        var ar2 = ar1[i].split('=');
        var dval = ar1[i].replace(ar2[0].trim(), '');
        all_parts[all_parts.length] = { part: 'cookie', name: ar2[0].trim(), val: dval, force: true };
    }
    for (var i = 0; i <= die_heads.length - 1; i++) {
        all_parts[all_parts.length] = { part: 'header', name: die_heads[i].name, val: die_heads[i].val, force: true };
    }

    //======================
    for (var i = 0; i <= all_parts.length - 1; i++) {
        console.log(all_parts[i].part + ' : ' + all_parts[i].name + ' = ' + all_parts[i].val);
    }
}

var request_que = [];

function request_list_maker() {


    var headstr = '';
    for (var k = 0; k <= die_heads.length - 1; k++) {
        headstr += (die_heads[k].name + 'nnpp' + die_heads[k].val + 'nndd');
    }
    var adr = encodeURIComponent('https://' + die_host + die_pat);
    baseurl = worker + '?dieuri=' + adr + '&diemet=' + die_met + '&diecok=' + encodeURIComponent(die_cook) + '&diehed=' + encodeURIComponent(headstr) + '&diebod=' + encodeURIComponent(die_body);
    request_que[request_que.length] = baseurl;

}


async function test_unit() {


    var headstr = '';
    for (var k = 0; k <= die_heads.length - 1; k++) {
        headstr += (die_heads[k].name + 'nnpp' + die_heads[k].val + 'nndd');
    }


    var adr = encodeURIComponent('https://' + die_host + die_pat);

    baseurl = worker + '?dieuri=' + adr + '&diemet=' + die_met + '&diecok=' + encodeURIComponent(die_cook) + '&diehed=' + encodeURIComponent(headstr) + '&diebod=' + encodeURIComponent(die_body);




    var q = baseurl;

    console.log(q);

    const response = await page.goto(q, { timeout: 0 });


    try {

        var statuscode = response.status();
        console.log(statuscode);

        //if (statuscode == 200) {
        const responseBody = await response.text();
        //var rspj = JSON.parse(responseBody);

        //console.log(responseBody.length);
        console.log(responseBody);

        basestatus = statuscode;
        baseresponse = responseBody;

        //========================================================




    } catch (ex) {
        console.log('server error...\n' + ex.message);
    }


}


var packetfilename = 'clean_packet';
var worker = 'https://throbbing-haze-271c.eynikave.workers.dev/';
var die_cook = 'null';
var die_heads = [];
var die_body = 'null';
var die_met = 'GET';
var die_pat = '/';
var die_host = '';
var die_http = '';

var outputfile = 'packet_clean';


let encode = str => {
    let buf = [];

    for (var i = str.length - 1; i >= 0; i--) {
        buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
    }

    return buf.join('');
}

let decode = str => {
    return str.replace(/&#(\d+);/g, function (match, dec) {
        return String.fromCharCode(dec);
    });
}

var crypto = require('crypto'),
    format = require('biguint-format');

function randomC(qty) {
    var x = crypto.randomBytes(qty);
    return format(x, 'dec');
}
function random(low, high) {
    return randomC(4) / Math.pow(2, 4 * 8 - 1) * (high - low) + low;
}


(async function main() {

    const readline = require('node:readline');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    var defmet = await new Promise(resolve => {
        rl.question("default method, default GET:\n", resolve)
    })
    console.log(defmet);

    rl.question(`packet file name, default "packet":\n`, async name => {
        if (isnullval(name) == true) { packetfilename = 'packet'; } else {
            packetfilename = name;
        }
        console.log(`packet file set to ${packetfilename}!`);
        rl.close();
        console.log('\n\n');



        var packet = await readFile(packetfilename);
        console.log(packet);


        //======================================

        var packet_inject = packet;
        var ascii_count = packet.split("{{ascii").length;
        packet_inject = packet_inject.replaceAll("*", "");
        packet_inject = packet_inject.replaceAll("{{verb}}", defmet);
        for (var i = 0; i <= packet_inject.length - 1; i++) {
            packet_inject = packet_inject.replaceAll("{{ascii-" + i + "}}", "*");
        }
        var tt = new Date().valueOf().toString();
        await writeToFile("inject_" + tt, packet_inject);
        console.log("inject_" + tt + " created...");

        //======================================




        var packar = packet.split('\r\n');


        console.log("packet len: " + packar.length);

        var startindex = 2;
        var endindex = packar.length - 1;



        for (var i = 0; i <= packar.length - 1; i++) {
            //console.log('\n\n' + i + ':' + packar[i]);
            //console.log('\n\n' + i + ':' + packar[i].trim().charCodeAt(packar[i].trim().length - 1));
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
            die_http = tempar[2].trim();
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



        var baseurl = 'https://' + die_host + die_pat;

        //console.log("\n\n**********************************\n\n");

        //console.log(die_http);
        //console.log('url = ' + baseurl);

        //console.log("\n\n**********************************\n\n");


        //{{ascii}},{{verb}}

        var ascii_count = baseurl.split("{{ascii").length;

        var urls = [];

        var tampers = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'CONNECT', 'TRACE'];
        tampers.forEach((element) => {
            var newurl = baseurl.replaceAll("{{verb}}", element);
            urls[urls.length] = newurl;
        });




        var asciiar = [];
        for (var i = 0; i <= 130; i++) {
            asciiar[asciiar.length] = i;
        }
        for (var i = 0; i <= 130; i++) {
            var newascii = parseInt(random(131, 0x7FFFFFFF));
            try {
                var ascii2 = encodeURIComponent(String.fromCharCode(newascii));
                //asciiar[asciiar.length] = newascii;
            } catch (ex) {
                i--;
            }
        }

        for (var i = 0; i <= ascii_count - 1; i++) {

            asciiar.forEach((element) => {
                //console.log("ascii = " + element);
                var newurl = baseurl.replaceAll("{{ascii-" + i + "}}", encodeURIComponent(String.fromCharCode(element)));
                newurl = newurl.replaceAll("dieuri=", "ascii=" + element + "-ascii&dieuri=");
                urls[urls.length] = newurl;
                var newurl = baseurl.replaceAll("{{ascii-" + i + "}}", encodeURIComponent(encodeURIComponent(String.fromCharCode(element))));
                newurl = newurl.replaceAll("dieuri=", "ascii=" + element + "-encod&dieuri=");
                urls[urls.length] = newurl;
                var newurl = baseurl.replaceAll("{{ascii-" + i + "}}", encodeURIComponent(encodeURIComponent(encodeURIComponent(String.fromCharCode(element)))));
                newurl = newurl.replaceAll("dieuri=", "ascii=" + element + "-dupencod&dieuri=");
                urls[urls.length] = newurl;
                var newurl = baseurl.replaceAll("{{ascii-" + i + "}}", encodeURIComponent(encode(String.fromCharCode(element))));
                newurl = newurl.replaceAll("dieuri=", "ascii=" + element + "-html&dieuri=");
                urls[urls.length] = newurl;


            });
        }

        var urlstring = [];

        urls.forEach((element) => {
            var newurl = element.replaceAll("{{verb}}", defmet);
            for (var i = 0; i <= ascii_count - 1; i++) {
                newurl = newurl.replaceAll("{{ascii-" + i + "}}", "");
            }
            urlstring[urlstring.length] = newurl;
        });


        for (var i = 0; i <= 20; i++) {
            urlstring[urlstring.length] = urlstring[urlstring.length - 1];
        }

        var tt = new Date().valueOf().toString();
        await writeToFile("fuzz_" + tt, urlstring.join("\n"));

        console.log(urls.length + " urls write to fuzz_" + tt);
        console.log("./ffuf -mc all -x http://127.0.0.1:8080 -w fuzz_" + tt + " -u FUZZ -t 10");
        console.log('python3 /zalert/sqlmap/sqlmap.py -r /zalert/temp/param/dom/inject_' + tt + ' -a --answers="follow=Y" --batch --tamper=chardoubleencode.py --level=5 --risk=3 --proxy=http://127.0.0.1:8080');
        console.log('python3 /zalert/commix/commix.py -r /zalert/temp/param/dom/inject_' + tt + ' --tamper="doublequotes2" --level=3 --batch --proxy=http://127.0.0.1:8080');
        console.log("./mitmweb --set block_global=false --ssl-insecure -s multiproxy.py");
    });
})();


