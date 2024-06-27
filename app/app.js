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

async function hackerone() {
    await cmd('./bbscope', 'h1', '-t', global.h1key, '-u', global.h1us, '-b', '-o', 'u');
    var lst = cmdout.split(/\r?\n/);
    var unique = lst.filter(global.snippet.onlyUnique);
    //console.log(lst.length + ' > ' + unique.length);
    //console.log(unique[0]);
    //console.log(unique[1]);
    for (var i = 0; i <= unique.length - 1; i++) {
        if (global.snippet.isnullval(unique[i].trim()) == false) {
            programAr[programAr.length] = { 'platform': 'hackerone', 'name': global.snippet.replaceallstr(unique[i], 'https://hackerone.com/', ''), 'page': unique[i] };
        }
    }
    addlog(unique.length + ' programs found from hackerone.');
    //await writeToFile('log.txt', JSON.stringify(programAr));
}
async function intigiriti() {
    await cmd('./bbscope', 'it', '-t', global.intikey, '-o', 'tu', '--oos');
    var lst = cmdout.split(/\r?\n/);
    var unique = lst.filter(global.snippet.onlyUnique);
    //console.log(lst.length + ' > ' + unique.length);
    //console.log(unique[0]);
    //console.log(unique[1]);

    for (var i = 0; i <= unique.length - 1; i++) {
        if (global.snippet.isnullval(unique[i].trim()) == false) {
            var name = unique[i].split('https://app.intigriti.com/researcher/programs/')[1].split('/')[0];
            var pagear = unique[i].split(' ');
            var page = pagear[pagear.length - 1];
            var cfnd = programAr.find(o => o.page == page);
            if (cfnd != undefined) {
                continue;
            }
            programAr[programAr.length] = { 'platform': 'Intigiriti', 'name': name, 'page': page };
        }
    }
    addlog(unique.length + ' programs found from intigiriti.');
    //await writeToFile('log2.txt', JSON.stringify(programAr));

}

var indx = 0;
async function save_programs() {
    if (indx >= programAr.length) { return false; }
    var sql = "SELECT * FROM program WHERE (page='" + programAr[indx].page + "')";
    body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
    console.log(indx + ':' + ':saveprogram-1' + ':::' + body2.length + '\n**endlog**\n');
    var fnd = false;
    try {
        var res = JSON.parse(body2.trim());
        if (res.length > 0) {
            fnd = true;
        }
    } catch (ex) { fnd = false; }
    if (fnd == false) {
        var sql = "insert into program (platform,name,page,flag) values('" + programAr[indx].platform + "','" + programAr[indx].name + "','" + programAr[indx].page + "','new')";
        body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
        console.log(indx + ':' + ':saveprogram-2' + + ':::' + body2.length + '\n**endlog**\n');
    }
    indx++;
    await save_programs();
}

var programAr = [];
async function update_programs() {
    programAr = [];
    await hackerone();
    await intigiriti();
    await save_programs();
}

async function run() {
    await update_programs();

}
run();