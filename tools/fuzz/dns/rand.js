var Promise = require("bluebird");
var randomNumber = require("random-number-csprng");
var lastrnx = 0;
const fs = require('node:fs');
var wc = 30;
var outc = 0;
var outar = [];
var outstr = "";

function randme() {
    Promise.try(function () {
        return randomNumber(0, (wordlist.length - 1));
    }).then(function (number) {
        lastrnx = number;
        outar[outar.length] = wordlist[number];
        console.log("Your random number:", number);
        console.log(outar.length + " = " + lastrnx);
        if (outar.length < outc) {
            randme();
        } else {
            outstr = outar.join("\n");
            fs.writeFile("sub_rand_" + outc + "_" + number + ".txt", outstr, err => {
                if (err) {
                    console.error(err);
                } else {
                    console.log("FINISH.....");// file written successfully
                }
            });

        }
    }).catch({ code: "RandomGenerationError" }, function (err) {
        console.log("Something went wrong!");
    });
}

var words = fs.readFileSync('distinct.txt', 'utf8');
//var wlist = await readFile(words);
var wordlist = words.split("\n");
console.log("all words: " + wordlist.length);


outc = wc * 100000;
console.log("working, " + outc + " ...");

randme();
