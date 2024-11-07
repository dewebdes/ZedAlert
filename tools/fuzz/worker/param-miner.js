const fs = require('fs');

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


var inputfile = 'full-params.txt';
var outputfile = '300-params';


(async function main() {
    const readline = require('node:readline');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    var paramfile = await new Promise(resolve => {
        rl.question("parameters file, default " + inputfile + ":\n", resolve)
    })
    if (isnullval(paramfile) == false) {
        inputfile = paramfile;
    }
    //console.log()

    var inputcontent = await readFile(inputfile);
    inputar = inputcontent.split("\n").sort();
    console.log(inputar.length);
    var sorted = [];
    inputar.forEach((element) => {
        sorted.push({ param: element, len: element.length });
    });
    var lenar = [];
    for (var i = 0; i <= sorted.length; i++) {
        console.log(i);
        newl = sorted.filter(tm => tm.len == i);//;
        //console.log(newl);
        //console.log(newl.map(u => u.param).join('\n'));
        if (newl.length > 0) {
            lenar.push({ len: i, ar: newl.map(u => u.param).join('\n') });
        } else {
            console.log("\n\nfinish....\n\n");
            break;
        }
    }
    lenar.forEach(async (element) => {
        console.log(element.len + " = " + element.ar + " items");
        await writeToFile(element.len + ".prm", element.ar);
    });

    console.log("\n\nfinished... all params saved ");

})();