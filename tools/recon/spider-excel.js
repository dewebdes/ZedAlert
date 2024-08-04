const puppeteer = require('puppeteer');
const prettier = require('prettier');
//const useProxy = require('puppeteer-page-proxy');
const fs = require('fs');//.promises;
//import fsPromises from "node:fs/promises";
var request = require('request');
const { spawn } = require("child_process");
const process = require("process");
var XLSX = require('xlsx');

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


console.log('start...');

var workbook = XLSX.readFile('ada.com-SpiderFoot.xlsx');
var sheet_name_list = workbook.SheetNames;

console.log('excel load with ' + console.log(sheet_name_list.length) + ' sheets');

async function run() {
    //await cmd('ls');
    //console.log(cmdout);
    for (var i = 0; i <= sheet_name_list.length - 1; i++) {
        switch (sheet_name_list[i]) {
            case 'EMAILADDR':

                break;
            case 'INTERNET_NAME':
                var namecol = [];
                var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[i]]);
                for (var j = 0; j <= xlData.length - 1; j++) {
                    var sub = xlData[j]['Data'];
                    if (namecol.indexOf(sub) == -1) {
                        namecol[namecol.length] = sub;
                        appendToFile('sub.txt', sub + '\n');
                    }
                }
                break;
            case 'IP_ADDRESS':
                var ipcol = [];
                var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[i]]);
                for (var j = 0; j <= xlData.length - 1; j++) {
                    var ip = xlData[j]['Data'];
                    if (ipcol.indexOf(ip) == -1) {
                        ipcol[ipcol.length] = ip;
                        await cmd('whois', ip);
                        cmdout = cmdout.toLowerCase();
                        if ((cmdout.indexOf('google') == -1) && (cmdout.indexOf('github') == -1) && (cmdout.indexOf('facebook') == -1) && (cmdout.indexOf('dropbox') == -1) && (cmdout.indexOf('airenetworks') == -1) && (cmdout.indexOf('twitter') == -1) && (cmdout.indexOf('cloudflare') == -1) && (cmdout.indexOf('fastly') == -1) && (cmdout.indexOf('amazon') == -1) && (cmdout.indexOf('microsoft') == -1)) {
                            //console.log(ip);
                            appendToFile('ips.txt', ip + '\n');
                        }
                        await delay(1000);
                    }
                }
                break;
        }
    }

}

run();

//console.log(sheet_name_list);

//var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
//var num = xlData[i]['NUMBER-1'];

/*
'ACCOUNT_EXTERNAL_OWNED',
    'AFFILIATE_COMPANY_NAME',
    'AFFILIATE_DESCRIPTION_ABSTRACT',
    'AFFILIATE_DESCRIPTION_CATEGORY',
    'AFFILIATE_DOMAIN_NAME',
    'AFFILIATE_DOMAIN_WHOIS',
    'AFFILIATE_EMAILADDR',
    'AFFILIATE_INTERNET_NAME',
    'AFFILIATE_INTERNET_NAME_UNRESOLVED',
    'AFFILIATE_IPADDR',
    'AFFILIATE_IPV6_ADDRESS',
    'AFFILIATE_WEB_CONTENT',
    'APPSTORE_ENTRY',
    'BGP_AS_MEMBER',
    'BITCOIN_ADDRESS',
    'BITCOIN_BALANCE',
    'BLACKLISTED_AFFILIATE_INTERNET_NAME',
    'BLACKLISTED_AFFILIATE_IPADDR',
    'BLACKLISTED_COHOST',
    'BLACKLISTED_INTERNET_NAME',
    'BLACKLISTED_IPADDR',
    'BLACKLISTED_SUBNET',
    'CLOUD_STORAGE_BUCKET',
    'CLOUD_STORAGE_BUCKET_OPEN',
    'COMPANY_NAME',
    'COUNTRY_NAME',
    'CO_HOSTED_SITE',
    'CO_HOSTED_SITE_DOMAIN',
    'CO_HOSTED_SITE_DOMAIN_WHOIS',
    'DNS_SPF',
    'DNS_TEXT',
    'DOMAIN_NAME',
    'DOMAIN_NAME_PARENT',
    'DOMAIN_REGISTRAR',
    'DOMAIN_WHOIS',
    'EMAILADDR',
    'EMAILADDR_COMPROMISED',
    'EMAILADDR_GENERIC',
    'ERROR_MESSAGE',
    'GEOINFO',
    'HASH',
    'HTTP_CODE',
    'HUMAN_NAME',
    'IBAN_NUMBER',
    'INTERESTING_FILE',
    'INTERESTING_FILE_HISTORIC',
    'INTERNET_NAME',
    'INTERNET_NAME_UNRESOLVED',
    'IPV6_ADDRESS',
    'IP_ADDRESS',
    'LEAKSITE_URL',
    'LEI',
    'LINKED_URL_EXTERNAL',
    'LINKED_URL_INTERNAL',
    'MALICIOUS_AFFILIATE_INTERNET_NAME',
    'MALICIOUS_AFFILIATE_IPADDR',
    'MALICIOUS_COHOST',
    'MALICIOUS_INTERNET_NAME',
    'MALICIOUS_IPADDR',
    'MALICIOUS_SUBNET',
    'NETBLOCKV6_MEMBER',
    'NETBLOCK_MEMBER',
    'PGP_KEY',
    'PHONE_NUMBER',
    'PHYSICAL_ADDRESS',
    'PHYSICAL_COORDINATES',
    'PROVIDER_DNS',
    'PROVIDER_HOSTING',
    'PROVIDER_JAVASCRIPT',
    'PROVIDER_MAIL',
    'PROXY_HOST',
    'PUBLIC_CODE_REPO',
    'RAW_DNS_RECORDS',
    'RAW_FILE_META_DATA',
    'RAW_RIR_DATA',
    'SIMILARDOMAIN',
    'SIMILARDOMAIN_WHOIS',
    'SOCIAL_MEDIA',
    'SSL_CERTIFICATE_EXPIRED',
    'SSL_CERTIFICATE_EXPIRING',
    'SSL_CERTIFICATE_ISSUED',
    'SSL_CERTIFICATE_ISSUER',
    'SSL_CERTIFICATE_MISMATCH',
    'SSL_CERTIFICATE_RAW',
    'TARGET_WEB_CONTENT',
    'TARGET_WEB_CONTENT_TYPE',
    'TCP_PORT_OPEN',
    'TCP_PORT_OPEN_BANNER',
    'URL_ADBLOCKED_EXTERNAL',
    'URL_FORM',
    'URL_JAVASCRIPT',
    'URL_PASSWORD',
    'URL_STATIC',
    'URL_WEB_FRAMEWORK',
    'USERNAME',
    'WEBSERVER_BANNER',
    'WEBSERVER_HTTPHEADERS',
    'WEBSERVER_STRANGEHEADER',
    'WEBSERVER_TECHNOLOGY',
    'WEB_ANALYTICS_ID'
*/
