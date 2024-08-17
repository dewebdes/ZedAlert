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

function runcshell(cmd){
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

async function hackerone() {
    addlog('hackerone');
    await cmd('./bbscope', 'h1', '-t', global.h1key, '-u', global.h1us, '-b', '-o', 'tu');
    var lst = cmdout.split(/\r?\n/);
    var unique = lst.filter(global.snippet.onlyUnique);
    console.log(lst.length + ' > ' + unique.length);
    console.log(unique[0]);
    console.log(unique[1]);
    //return;
    for (var i = 0; i <= unique.length - 1; i++) {
        if (global.snippet.isnullval(unique[i].trim()) == false) {
            var infoar = unique[i].trim().split(' ');
            var page = infoar[infoar.length-1];
            var tempar = page.split('/');
            var name = tempar[tempar.length-1];

            var domain = infoar[0];
            domain = global.snippet.replaceallstr(domain,'*.','');
            if(domain.indexOf('.') == -1){
                domain = '';
            }



            var cfnd = programAr.find(o => o.name == name);
            if (cfnd == undefined) {
                programAr[programAr.length] = { 'platform': 'hackerone', 'name': name, 'page': page, 'domain':domain };
            }else{
                if(domain.length < cfnd.domain){
                    cfnd.domain = domain;
                }
            }

            
        }
    }
    addlog(unique.length + ' programs found from hackerone.');
    //await writeToFile('log.txt', JSON.stringify(programAr));

//console.log(programAr.length);

//console.log(programAr);

}

async function intigiriti() {
    addlog('intigiriti');
    await cmd('./bbscope', 'it', '-t', global.intikey, '-o', 'tu', '--oos');
    var lst = cmdout.split(/\r?\n/);
    var unique = lst.filter(global.snippet.onlyUnique);
    //console.log(lst.length + ' > ' + unique.length);
    //console.log(unique[0]);
    //console.log(unique[1]);

    for (var i = 0; i <= unique.length - 1; i++) {
        if (global.snippet.isnullval(unique[i].trim()) == false) {

            var line = global.snippet.replaceallstr(unique[i].trim(),'[OOS] ','');

            var infoar = line.split(' ');
            var page = infoar[infoar.length-1];
            var tempar = page.split('/');
            var name = tempar[tempar.length-2];

            var domain = infoar[0];
            domain = global.snippet.replaceallstr(domain,'*.','');
            if(domain.indexOf('.') == -1){
                domain = '';
            }

            var cfnd = programAr.find(o => o.name == name);
            if (cfnd == undefined) {
                programAr[programAr.length] = { 'platform': 'Intigiriti', 'name': name, 'page': page, 'domain':domain };
            }else{
                if(domain.length < cfnd.domain){
                    cfnd.domain = domain;
                }
            }
        }
    }
    addlog(unique.length + ' programs found from intigiriti.');
    //await writeToFile('log2.txt', JSON.stringify(programAr));

console.log(programAr.length);

console.log(programAr);

}

var indx = 0;
async function save_programs() {
    addlog('saveprogram');
    if (indx >= programAr.length) { return false; }
    var sql = "SELECT * FROM program WHERE (page='" + programAr[indx].page + "')";
    body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
    console.log(indx + ':' + ':saveprogram-1' + ':::' + body2 + '\n**endlog**\n');
    var fnd = false;
    try {
        var res = JSON.parse(body2.trim());
        if (res.length > 0) {
            fnd = true;
        }
    } catch (ex) { fnd = false; }
    if (fnd == false) {
        var vals = "'" + programAr[indx].platform + "',";
        vals += "'" + programAr[indx].name + "',";
        vals += "'" + programAr[indx].page + "',";
        vals += "'" + programAr[indx].domain + "',";
        vals += "'" + "NA" + "',";
        vals += "now(),now()";
        var sql = "INSERT INTO  program (platform, name, page, domain, status, cdate, udate) VALUES (" + vals + ")";
        body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
        console.log(indx + ':' + ':saveprogram-2' + + ':::' + body2 + '\n**endlog**\n');
    }
    indx++;
    await save_programs();
}

var programAr = [];
async function update_programs() {
    addlog('updateprograms');
    programAr = [];
    await hackerone();
    await intigiriti();
    await save_programs();
}

async function run() {
    addlog('run');
    await update_programs();

}
//run();

function spider_post(durl, dbody) {
	return new Promise(function (resolve, reject) {
        console.log("spider_post = " + durl);
		request.post(durl, {
			body: dbody,
            headers: {'content-type' : 'application/x-www-form-urlencoded','Cache-Control':'max-age=0','Accept-Language':'en-US','Upgrade-Insecure-Requests':'1','Origin':'null','Connection':'keep-alive'},
		}, function (error, res, body) {
			resolve(body);
			/*if (!error && res.statusCode === 200) {
				resolve(body);
			} else {
				reject(error);
			}*/
		});
	});
}


var namecol = [];
var ipcol = [];

async function spider(){
    addlog('spider');
    var url = global.spiderUrl + "scanlist";
    var body = "";
    var bak = await spider_post(url,body);

    console.log(typeof(bak));
    var obj = JSON.parse(bak.trim());
    console.log(obj);
    var isrun = false;
    for(var i=0;i<=obj.length-1;i++){
        var id = obj[i][0];
        var domain = obj[i][1];
        var status = obj[i][6];
        if(status == 'RUNING'){
            isrun = true;
        }
        if((status == 'FINISHED') || (status == 'ABORT-REQUESTED')){
            var sql = "SELECT * FROM program WHERE (domain='" + domain + "') and (status='spider-start') limit 1";
            var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
            console.log(':spider-01' + ':::' + body2 + '\n**endlog**\n');
            var fnd = false;
            var res = [];
            try {
                res = JSON.parse(body2.trim());
                if (res.length > 0) {
                    fnd = true;
                }
            } catch (ex) { fnd = false; }

            if(fnd == true){
                /*console.log('spider dl found ' + res[0].domain);
                var url = global.spiderUrl + "scaneventresultexportmulti?filetype=excel&ids=" + id;
                ////var domain = res[0].domain;
                ////var body = "";
                var bak = await spider_get(url);
                ////console.log(bak);

                await writeToFile(res[0].id + '.xlsx');




                var sql = "update program set status='spider-finished' WHERE id=" + res[0].id;
                var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
                console.log(':spider-02' + ':::' + body2 + '\n**endlog**\n');
                */

                var url = global.spiderUrl + "scaneventresults";
                var domain = res[0].domain;
                var body = "id=" + id + "&eventType=AFFILIATE_INTERNET_NAME";
                var bak = await spider_post(url,body);
                console.log(bak);

                var obj = JSON.parse(bak.trim());

                for (var j = 0; j <= obj.length - 1; j++) {
                    var sub = obj[j][2];

                    var subar = [obj[j][1],obj[j][2]];

                    for(var z=0;z<=subar.length-1;z++){
                        sub = subar[z];
                        if(sub.length > 63){continue;}
                        if (namecol.indexOf(sub) == -1) {
                            namecol[namecol.length] = sub;
                            await appendToFile('sub.txt', sub + '\n');

                            var sql = "SELECT * FROM targets WHERE (programid=" + res[0].id + ") and (addr='" + sub + "') limit 1";
                            var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
                            console.log(':spider-030' + ':::' + body2 + '\n**endlog**\n');
                            var fnd2 = false;
                            var res2 = [];
                            try {
                                res2 = JSON.parse(body2.trim());
                                if (res2.length > 0) {
                                    fnd2 = true;
                                }
                            } catch (ex) { fnd2 = false; }

                            if(fnd2 == false){

                                var vals = res[0].id + ",";
                                vals += "'" + sub + "',";
                                vals += "'" + 'na' + "',";
                                vals += "now(),now()";
                                var sql = "INSERT INTO targets (programid, addr, status, cdate, udate) VALUES (" + vals + ")";// + res[0].id;
                                var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
                                console.log(':spider-03' + ':::' + body2 + '\n**endlog**\n');
                            }
                        }
                    }
                }

                console.log(namecol);

                //===============================

                var url = global.spiderUrl + "scaneventresults";
                var domain = res[0].domain;
                var body = "id=" + id + "&eventType=INTERNET_NAME";
                var bak = await spider_post(url,body);
                console.log(bak);

                var obj = JSON.parse(bak.trim());

                for (var j = 0; j <= obj.length - 1; j++) {
                    var sub = obj[j][2];

                    var subar = [obj[j][1],obj[j][2]];

                    for(var z=0;z<=subar.length-1;z++){
                        sub = subar[z];
                        if(sub.length > 63){continue;}
                        if (namecol.indexOf(sub) == -1) {
                            namecol[namecol.length] = sub;
                            await appendToFile('sub.txt', sub + '\n');

                            var sql = "SELECT * FROM targets WHERE (programid=" + res[0].id + ") and (addr='" + sub + "') limit 1";
                            var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
                            console.log(':spider-030' + ':::' + body2 + '\n**endlog**\n');
                            var fnd2 = false;
                            var res2 = [];
                            try {
                                res2 = JSON.parse(body2.trim());
                                if (res2.length > 0) {
                                    fnd2 = true;
                                }
                            } catch (ex) { fnd2 = false; }

                            if(fnd2 == false){

                                var vals = res[0].id + ",";
                                vals += "'" + sub + "',";
                                vals += "'" + 'na' + "',";
                                vals += "now(),now()";
                                var sql = "INSERT INTO targets (programid, addr, status, cdate, udate) VALUES (" + vals + ")";// + res[0].id;
                                var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
                                console.log(':spider-03' + ':::' + body2 + '\n**endlog**\n');
                            }
                        }
                    }
                }

                console.log(namecol);

                //===============================

                var url = global.spiderUrl + "scaneventresults";
                var domain = res[0].domain;
                var body = "id=" + id + "&eventType=AFFILIATE_IPADDR";
                var bak = await spider_post(url,body);
                console.log(bak);

                var obj = JSON.parse(bak.trim());

                for (var j = 0; j <= obj.length - 1; j++) {
                    var ip = obj[j][1];

                    var ipar = [obj[j][1],obj[j][2]];

                    for(var z=0;z<=ipar.length-1;z++){
                        ip = ipar[z];
                        if(ip.length > 63){continue;}
                        if (ipcol.indexOf(ip) == -1) {
                            ipcol[ipcol.length] = ip;
                            await cmd('whois', ip);
                            cmdout = cmdout.toLowerCase();
                            if ((cmdout.indexOf('akamai') == -1) && (cmdout.indexOf('google') == -1) && (cmdout.indexOf('github') == -1) && (cmdout.indexOf('facebook') == -1) && (cmdout.indexOf('dropbox') == -1) && (cmdout.indexOf('airenetworks') == -1) && (cmdout.indexOf('twitter') == -1) && (cmdout.indexOf('cloudflare') == -1) && (cmdout.indexOf('fastly') == -1) && (cmdout.indexOf('amazon') == -1) && (cmdout.indexOf('microsoft') == -1)) {
                                //console.log(ip);
                                appendToFile('ips.txt', ip + '\n');


                                var sql = "SELECT * FROM black WHERE (programid=" + res[0].id + ") and (ip='" + ip + "') limit 1";
                                var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
                                console.log(':spider-040' + ':::' + body2 + '\n**endlog**\n');
                                var fnd2 = false;
                                var res2 = [];
                                try {
                                    res2 = JSON.parse(body2.trim());
                                    if (res2.length > 0) {
                                        fnd2 = true;
                                    }
                                } catch (ex) { fnd2 = false; }
        
                                if(fnd2 == false){
        


                                    var vals = "'" + ip + "'," + res[0].id + ",";
                                    vals += "'na',";
                                    vals += "now(),now()";
                                    var sql = "INSERT INTO  black (ip, programid, status, cdate, udate) VALUES (" + vals + ")";// + res[0].id;
                                    console.log(sql);
                                    var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
                                    console.log(':spider-04' + ':::' + body2 + '\n**endlog**\n');
                                }    
                            }
                            await delay(1000);
                        }
                    }
                }

                console.log(ipcol);


                //===============================


                var url = global.spiderUrl + "scaneventresults";
                var domain = res[0].domain;
                var body = "id=" + id + "&eventType=IP_ADDRESS";
                var bak = await spider_post(url,body);
                console.log(bak);

                var obj = JSON.parse(bak.trim());

                for (var j = 0; j <= obj.length - 1; j++) {
                    var ip = obj[j][1];

                    var ipar = [obj[j][1]];

                    for(var z=0;z<=ipar.length-1;z++){
                        ip = ipar[z];
                        if(ip.length > 63){continue;}
                        if (ipcol.indexOf(ip) == -1) {
                            ipcol[ipcol.length] = ip;
                            await cmd('whois', ip);
                            cmdout = cmdout.toLowerCase();
                            if ((cmdout.indexOf('akamai') == -1) && (cmdout.indexOf('google') == -1) && (cmdout.indexOf('github') == -1) && (cmdout.indexOf('facebook') == -1) && (cmdout.indexOf('dropbox') == -1) && (cmdout.indexOf('airenetworks') == -1) && (cmdout.indexOf('twitter') == -1) && (cmdout.indexOf('cloudflare') == -1) && (cmdout.indexOf('fastly') == -1) && (cmdout.indexOf('amazon') == -1) && (cmdout.indexOf('microsoft') == -1)) {
                                //console.log(ip);
                                appendToFile('ips.txt', ip + '\n');


                                var sql = "SELECT * FROM black WHERE (programid=" + res[0].id + ") and (ip='" + ip + "') limit 1";
                                var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
                                console.log(':spider-040' + ':::' + body2 + '\n**endlog**\n');
                                var fnd2 = false;
                                var res2 = [];
                                try {
                                    res2 = JSON.parse(body2.trim());
                                    if (res2.length > 0) {
                                        fnd2 = true;
                                    }
                                } catch (ex) { fnd2 = false; }
        
                                if(fnd2 == false){
        


                                    var vals = "'" + ip + "'," + res[0].id + ",";
                                    vals += "'na',";
                                    vals += "now(),now()";
                                    var sql = "INSERT INTO  black (ip, programid, status, cdate, udate) VALUES (" + vals + ")";// + res[0].id;
                                    console.log(sql);
                                    var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
                                    console.log(':spider-04' + ':::' + body2 + '\n**endlog**\n');
                                }    
                            }
                            await delay(1000);
                        }
                    }
                }

                console.log(ipcol);


                //===============================


                var sql = "update program set status='spider-finished' WHERE id=" + res[0].id;
                var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
                console.log(':spider-02' + ':::' + body2 + '\n**endlog**\n');

                /* delete from spider server */
                
                //var url = global.spiderUrl + "scandelete?id=" + id;
                //var body2 = await global.outgoing.doRequest(url, {});
                //console.log(body2);

            }else{
                console.log('spider dl not found...');
            }
        }

    }
    
//return;

    if(isrun==false){
        var sql = "SELECT * FROM program WHERE (status='spider-ready') order by periority desc limit 1";
        var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
        console.log(indx + ':' + ':spider-1' + ':::' + body2 + '\n**endlog**\n');
        var fnd = false;
        var res = [];
        try {
            res = JSON.parse(body2.trim());
            if (res.length > 0) {
                fnd = true;
            }
        } catch (ex) { fnd = false; }

        if(fnd == true){
            console.log('spider start found ' + res[0].domain);
            var url = global.spiderUrl + "startscan";
            var domain = res[0].domain;
            var body = "scanname=" + domain + "&scantarget=" + domain + "&usecase=all&modulelist=&typelist=";
            var bak = await spider_post(url,body);
            console.log(bak);
            var sql = "update program set status='spider-start' WHERE id=" + res[0].id;
            var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
            console.log(indx + ':' + ':spider-2' + ':::' + body2 + '\n**endlog**\n');
        }else{
            console.log('spider start not found...');
        }
    }

    await delay(60000);
    await spider();
}


async function target_check_1() {

    addlog('targetcheck1');
    var sql = "SELECT * FROM targets WHERE (status='na') limit 1";
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

    if(fnd == true){


        var payl = res[0].addr;
        var id = res[0].id;
        console.log(payl);


        metho = 'get';
        //await page.setExtraHTTPHeaders({
        //	"Sec-Ch-Ua": "\"(Not(A:Brand\";v=\"8\", \"Chromium\";v=\"101\"","Accept": "application/json, text/plain, */*",'Authorization': 'Bearer ' + token,		"Sec-Ch-Ua-Mobile": "?0", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Safari/537.36", "Sec-Ch-Ua-Platform": "\"Windows\"", "Origin": "https://bo.imprexisplatform.com", "Sec-Fetch-Site": "same-site", "Sec-Fetch-Mode": "cors", "Sec-Fetch-Dest": "empty", "Referer": "https://bo.imprexisplatform.com/", "Accept-Encoding": "gzip, deflate", "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8", "Connection": "close"
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
                    path: 'shots/target/' + id + '.jpg'
                });

                appendToFile('oksub.txt', 'http://' + payl + ' - ' + responseBody.length + '\n');
                //okindex++;
                console.log('\nok: ' + payl + '\n');

                /*} else {
                    console.log('server error ' + statuscode);
                    process.exit(1);
                }*/

                    var sql = "update targets set status='ok',udate=now() WHERE (id=" + id + ")";
                    var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
                    console.log(':targetcheck-02' + ':::' + body2 + '\n**endlog**\n');
                    

                await delay(12000);


              //  cupage++;
                //await writeToFile('index.txt', cupage.toString());


                await target_check_1();

            } catch (ex) {


                var sql = "update targets set status='notok',udate=now() WHERE (id=" + id + ")";
                var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
                console.log(':targetcheck-02' + ':::' + body2 + '\n**endlog**\n');
                

                console.log('server error...\n' + ex.message);
                await delay(10000);
                await target_check_1();
            }
        } else {
            //cupage++;
            //await writeToFile('index.txt', cupage.toString());
            
            var sql = "update targets set status='notok',udate=now() WHERE (id=" + id + ")";
                var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
                console.log(':targetcheck-02' + ':::' + body2 + '\n**endlog**\n');
                

                //console.log('server error...\n' + ex.message);
            //    await delay(10000);
              //  await target_check_1();

            await delay(12000);
            await target_check_1();
        }

    }

}


async function waybak() {
    addlog('waybak');
    var sql = "SELECT * FROM targets WHERE (status='ok') limit 1";
    var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
    console.log(':waybak-01' + ':::' + body2 + '\n**endlog**\n');
    var fnd = false;
    var res = [];
    try {
        res = JSON.parse(body2.trim());
        if (res.length > 0) {
            fnd = true;
        }
    } catch (ex) { fnd = false; }

    if(fnd == true){

        //await cmd('echo', '"' + res[0].addr + '"', '|', './waybackurls');
        //const nameOutput = await exec('echo "' + res[0].addr + '" | ./waybackurls',{maxBuffer: 1024 * 5000});
        const nameOutput = await runcshell('echo "' + res[0].addr + '" | ./waybackurls');

        //console.log('out: ' + (nameOutput));
        //return;
        
        var lst = nameOutput.split(/\r?\n/);
        var unique = lst.filter(global.snippet.onlyUnique);
        console.log('waybak result: ' + lst.length);
        //console.log(lst.length + ' > ' + unique.length);
        //console.log(unique[0]);
        //console.log(unique[1]);

        for (var i = 0; i <= unique.length - 1; i++) {
            if (global.snippet.isnullval(unique[i].trim()) == false) {


                var sql = "SELECT * FROM endpoints WHERE (addr='" + unique[i].trim() + "') limit 1";
                var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
                console.log(':waybak-01' + ':::' + body2 + '\n**endlog**\n');
                var fnd = false;
                var res2 = [];
                try {
                    res2 = JSON.parse(body2.trim());
                    if (res2.length > 0) {
                        fnd = true;
                    }
                } catch (ex) { fnd = false; }

                if(fnd==false){
                    var vals = res[0].programid + "," + res[0].id + ",";
                    vals += "'" + unique[i].trim() + "',";
                    vals += "'" + 'na' + "',";
                    vals += "now(),now()";
                    var sql = "INSERT INTO endpoints (programid, targetid, addr, status, cdate, udate) VALUES (" + vals + ")";// + res[0].id;
                    var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
                    console.log(':waybak-02' + ':::' + body2 + '\n**endlog**\n');
                }
            }
        }

        var sql = "update targets set status='checked' WHERE id=" + res[0].id;
        var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
        console.log(':waybak-03' + ':::' + body2 + '\n**endlog**\n');

        //addlog(unique.length + ' programs found from intigiriti.');
        //await writeToFile('log2.txt', JSON.stringify(programAr));

        //console.log(programAr.length);

        //console.log(programAr);
    }
    await delay(10000);
    await waybak();
}


async function endpoint_check_1() {
    addlog('endpointcheck');
    var sql = "SELECT * FROM endpoints WHERE (status='na') ORDER BY periority desc,RAND() limit 1";
    var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
    console.log(':endpointcheck-01' + ':::' + body2 + '\n**endlog**\n');
    var fnd = false;
    var res = [];
    try {
        res = JSON.parse(body2.trim());
        if (res.length > 0) {
            fnd = true;
        }
    } catch (ex) { fnd = false; }

    if(fnd == true){


        var payl = res[0].addr;
        var id = res[0].id;
        console.log(payl);


        metho = 'get';
        //await page.setExtraHTTPHeaders({
        //	"Sec-Ch-Ua": "\"(Not(A:Brand\";v=\"8\", \"Chromium\";v=\"101\"","Accept": "application/json, text/plain, */*",'Authorization': 'Bearer ' + token,		"Sec-Ch-Ua-Mobile": "?0", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Safari/537.36", "Sec-Ch-Ua-Platform": "\"Windows\"", "Origin": "https://bo.imprexisplatform.com", "Sec-Fetch-Site": "same-site", "Sec-Fetch-Mode": "cors", "Sec-Fetch-Dest": "empty", "Referer": "https://bo.imprexisplatform.com/", "Accept-Encoding": "gzip, deflate", "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8", "Connection": "close"
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

                //await delay(5000);

                await page.screenshot({
                    path: 'shots/endpoint/' + id + '.jpg'
                });

                appendToFile('oksub.txt', 'http://' + payl + ' - ' + responseBody.length + '\n');
                //okindex++;
                console.log('\nok: ' + payl + '\n');

                /*} else {
                    console.log('server error ' + statuscode);
                    process.exit(1);
                }*/

                    var sql = "update endpoints set status='ok',udate=now() WHERE (id=" + id + ")";
                    var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
                    console.log(':endpointcheck-02' + ':::' + body2 + '\n**endlog**\n');
                    

                await delay(12000);


              //  cupage++;
                //await writeToFile('index.txt', cupage.toString());


                await endpoint_check_1();

            } catch (ex) {


                var sql = "update endpoints set status='notok',udate=now() WHERE (id=" + id + ")";
                var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
                console.log(':endpointcheck-02' + ':::' + body2 + '\n**endlog**\n');
                

                console.log('server error...\n' + ex.message);
                await delay(10000);
                await endpoint_check_1();
            }
        } else {
            //cupage++;
            //await writeToFile('index.txt', cupage.toString());
            
                var sql = "update endpoints set status='notok',udate=now() WHERE (id=" + id + ")";
                var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
                console.log(':endpointcheck-02' + ':::' + body2 + '\n**endlog**\n');
                

                //console.log('server error...\n' + ex.message);
                await delay(12000);
                await endpoint_check_1();

            //await delay(12000);
            //await target_check_1();
        }

    }

}


async function endpoint_params() {
    addlog('params');
    var sql = "SELECT * FROM endpoints WHERE (status='ok') ORDER BY periority desc,RAND() limit 1";
    var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
    console.log(':params-01' + ':::' + body2 + '\n**endlog**\n');
    var fnd = false;
    var res = [];
    try {
        res = JSON.parse(body2.trim());
        if (res.length > 0) {
            fnd = true;
        }
    } catch (ex) { fnd = false; }

    if(fnd == true){

        //await cmd('echo', '"' + res[0].addr + '"', '|', './waybackurls');
        //const nameOutput = await exec('echo "' + res[0].addr + '" | ./waybackurls',{maxBuffer: 1024 * 5000});
        var nameOutput = await runcshell('./fallparams -u ' + res[0].addr + ' -crawl');

        nameOutput = await readFile('parameters.txt');
        //console.log('out: ' + (nameOutput));
        //return;
        
        var lst = nameOutput.split(/\r?\n/);
        var unique = lst.filter(global.snippet.onlyUnique);
        console.log('params result: ' + lst.length);
        //console.log(lst.length + ' > ' + unique.length);
        //console.log(unique[0]);
        //console.log(unique[1]);

        for (var i = 0; i <= unique.length - 1; i++) {
            if (global.snippet.isnullval(unique[i].trim()) == false) {


                var sql = "SELECT * FROM params WHERE (name='" + unique[i].trim() + "') and (endpointid=" + res[0].id + ") limit 1";
                var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
                console.log(':params-02' + ':::' + body2 + '\n**endlog**\n');
                var fnd = false;
                var res2 = [];
                try {
                    res2 = JSON.parse(body2.trim());
                    if (res2.length > 0) {
                        fnd = true;
                    }
                } catch (ex) { fnd = false; }

                if(fnd==false){
                    var vals = res[0].programid + "," + res[0].targetid + "," + res[0].id + ",";
                    vals += "now(),now(),";
                    vals += "'" + 'fall' + "',";
                    vals += "'" + unique[i].trim() + "'";
                    
                    
                    var sql = "INSERT INTO params (programid, targetid, endpointid, cdate, udate, status, name) VALUES (" + vals + ")";// + res[0].id;
                    var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
                    console.log(':params-03' + ':::' + body2 + '\n**endlog**\n');


                    


                }
            }
        }


        console.log('X8 Start...');
        var nameOutput2 = await runcshell('./x8 -u "' + res[0].addr + '" -w parameters.txt -o reflect.txt -d 12000');
        nameOutput2 = await readFile('reflect.txt');
        var pasr = nameOutput2.split('%')[1].split(',');
        for (var j = 0; j <= pasr.length - 2; j++) {
            if (global.snippet.isnullval(pasr[j].trim()) == false) {
                var prm = pasr[j].trim();
                var sql = "update params set status='x8' WHERE (name='" + prm + "') and (endpointid=" + res[0].id + ")";
                var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
                console.log(':params-04' + ':::' + body2 + '\n**endlog**\n');
            }
        }


        var sql = "update endpoints set status='checked' WHERE id=" + res[0].id;
        var body2 = await global.outgoing.doRequest(global.queryapi, { query: encodeURIComponent(sql) });
        console.log(':params-03' + ':::' + body2 + '\n**endlog**\n');

        //addlog(unique.length + ' programs found from intigiriti.');
        //await writeToFile('log2.txt', JSON.stringify(programAr));

        //console.log(programAr.length);

        //console.log(programAr);
    }
    await delay(10000);
    await endpoint_params();
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

    //Promise.allSettled([run(), spider(), target_check_1(), waybak(), endpoint_check_1(), endpoint_params()]);
    //Promise.allSettled([run(), spider(), target_check_1()]);
    Promise.allSettled([endpoint_check_1()]);
    
    
    //run();
    //spider();
    //target_check_1();
    //waybak();
    //endpoint_check_1();
    //endpoint_params();

})();

