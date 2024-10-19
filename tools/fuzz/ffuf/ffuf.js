const fs = require('fs');

var url = "https://learn.greatplacetowork.com/index.php/FUZZ1/getFUZZ2";
var wordlist = 'raft-medium-directories-lowercase.txt';
var worker = "https://lucky-sea-f31a.eynikave.workers.dev/?dieuri=";


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

async function writeToFile(filePath, dataToWrite) {
    try {
        await fs.promises.writeFile(filePath, dataToWrite, 'utf8');
    } catch (error) {
        console.error('Error writing data:', error);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function main() {

    var fwords = await readFile('words/' + wordlist);
    var words = fwords.split('\n');


    var fuzzlist = [];
    for(var i=0;i<=words.length-1;i++){
        var newel = url;
        newel = newel.toString().replaceAll('FUZZ1', words[i].trim());
        newel = newel.toString().replaceAll('FUZZ2', capitalizeFirstLetter(words[i].trim()));
        fuzzlist[fuzzlist.length] = worker + encodeURIComponent(newel);
    }

    let text = fuzzlist.join('\n');
    var fn = 'ffuf_' + (new Date()).getTime().toString() +'.txt';
    await writeToFile(fn,text);
    //./ffuf -mc all -x http://127.0.0.1:8080 -w ffuf_1726558193493.txt -u FUZZ

    console.log('finishe with ' + words.length + ' payloads... > ' + fn);


}

main();


