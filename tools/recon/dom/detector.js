const puppeteer = require('puppeteer');
const prettier = require('prettier');
//const useProxy = require('puppeteer-page-proxy');
const fs = require('fs');//.promises;
//import fsPromises from "node:fs/promises";
var request = require('request');
const { spawn } = require("child_process");
const process = require("process");

var baseurl = 'https://3bon.booth.pm/items/4519345';

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

		havexss = havexss.replace(new RegExp("[0-9]", "g"), "X");
		if (havexss == basereflect) {
			havexss = 'n';
		}else{
			havexss = 'y';
		}

		console.log(payl + ' = ' + havexss);

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

async function test_unit() {

	metho = 'get';

	var q = 'http://localhost/dom.html';
	var q = baseurl + '?scobar=scobar';

	console.log(q);

	const response = await page.goto(q, { timeout: 0 });


	try {

		var statuscode = response.status();
		//console.log(statuscode);

		//if (statuscode == 200) {
		const responseBody = await response.text();
		//var rspj = JSON.parse(responseBody);

		console.log(responseBody.length);

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

		if (havexss != 'n') {
			basereflect = havexss;
			basereflect = basereflect.replace(new RegExp("[0-9]", "g"), "X");
		}
		console.log(havexss);

		console.log('base reflect: ' + basereflect + '\n\n');


	} catch (ex) {
		console.log('server error...\n' + ex.message);
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

	await test_unit();
	console.log('base reflect = ' + basereflect);
	await forever();

})();


