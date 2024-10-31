const puppeteer = require('puppeteer');
const prettier = require('prettier');
//const useProxy = require('puppeteer-page-proxy');
const fs = require('fs');//.promises;
//import fsPromises from "node:fs/promises";
var request = require('request');
const { spawn } = require("child_process");
const process = require("process");
//const inquirer = require('inquirer');
var urlobj = require('url');

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


var packetfilename = 'packet';
var die_cook = 'null';
var die_heads = [];
var die_body = 'null';
var die_met = 'GET';
var die_pat = '/';
var die_host = '';
var die_http = '';

var die_cook2 = '';
var die_heads2 = [];
var die_body2 = '';
var die_met2 = 'GET';
var die_pat2 = '/';
var die_host2 = '';
var die_http2 = '';

var outputfile = 'packet_clean';



(async function main() {

    const readline = require('node:readline');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    //const it = rl[Symbol.asyncIterator]();
    //const line1 = await it.next();
    packetfilename = await new Promise(resolve => {
        rl.question("packet file name, default packet:\n", resolve)
    })
    console.log(packetfilename)


    //rl.question(`packet file name, default "packet":\n`, async name => {
    //  if (isnullval(name) == true) { packetfilename = 'packet'; } else {
    //    packetfilename = name;
    //}
    //console.log(`packet file set to ${packetfilename}!`);
    //rl.close();
    //console.log('\n\n');

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


    var cloud_path_ar = die_pat.split("?");
    var cloud_request_ar = cloud_path_ar[1].split("&");

    var cokstr = "";
    var hedstr = "";

    cloud_request_ar.forEach((element) => {
        var part = element.split("=");
        var val = decodeURIComponent(part[1]);
        if (val.trim() == "null") { val = ""; }
        switch (part[0]) {
            case "dieuri":
                var parsed = urlobj.parse(val);
                die_host2 = parsed.host;
                die_pat2 = parsed.path;
                break;
            case "diehed":
                if (isnullval(val) == false) {
                    var hedar = val.split('nndd');
                    hedar.forEach((element) => {
                        var hedparam = element.split('nnpp');
                        die_heads2[die_heads2.length] = { name: hedparam[0], value: hedparam[1] };
                        hedstr += hedparam[0] + ": " + hedparam[1] + "\r\n";
                    });
                }
                break;
            case "diecok":
                if (isnullval(val) == false) {
                    var cokar = val.split(';');
                    cokar.forEach((element) => {
                        var cokparam = element.split('=');
                        die_cook2[die_cook2.length] = { name: cokparam[0], value: cokparam[1] };
                        cokstr += cokparam[0] + "=" + cokparam[1] + "; ";
                    });
                }
                break;
            case "diebod":
                if ((isnullval(val) == false)) {
                    die_body2 = val;
                }
            case "diemet":
                if ((isnullval(val) == false)) {
                    die_met2 = val;
                }
                break;
        }
    });


    var outpacket = await readFile('clean_reverse_packet_them.txt');
    outpacket = outpacket.replaceAll("{{verb}}", die_met2);
    outpacket = outpacket.replaceAll("{{path}}", die_pat2);
    outpacket = outpacket.replaceAll("{{host}}", die_host2);
    outpacket = outpacket.replaceAll("{{body}}", die_body2);

    /*
        var cookstr = die_cook2.reduce(function (a, b) {
            return a.name + "=" + a.value + ";"
        }
        )
       
        var hedstr = die_heads2.reduce(function (a, b) {
            return a.name + ": " + a.value + "\r\n"
        }
        )
        */

    hedstr = hedstr.replace(new RegExp("\r\n" + '$'), 'finish');

    outpacket = outpacket.replaceAll("{{cookie}}", cokstr);
    outpacket = outpacket.replaceAll("{{headers}}", hedstr);

    var tt = new Date().valueOf().toString();
    await writeToFile("original_packet_" + tt, outpacket);
    console.log("original_packet_" + tt);

    process.exit(1);

})();


