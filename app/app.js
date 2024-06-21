const puppeteer = require('puppeteer');
const prettier = require('prettier');
//const useProxy = require('puppeteer-page-proxy');
const fs = require('fs');//.promises;
//import fsPromises from "node:fs/promises";
var request = require('request');
const { spawn } = require("child_process");
const process = require("process");
var XLSX = require('xlsx');

global.config = require('config');
global.h1key = global.config.get('programs.hackerone-key');
global.h1us = global.config.get('programs.hackerone-user');
global.intikey = global.config.get('programs.intigriti-key');

var cmdout = '';

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
    console.log(lg);
}

async function hackerone() {
    await cmd('./bbscope', 'h1', '-t', global.h1key, '-u', global.h1us, '-b', '-o', 'u');
    addlog(cmdout);
}
async function intigiriti() {

}

async function update_programs() {
    await hackerone();
}

async function run() {
    await update_programs();

}
run();