const { exec } = require("child_process");

function runbak() {
	exec("/zalert/db/bak.sh", (error, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
			return;
		}
		console.log(`stdout: ${stdout}`);
	});
}

//runbak();


function gettimetick() {
	var date = new Date();
	var ticks = date.getTime();
	return ticks;
}


var t1 = gettimetick();
var t2 = t1;
var t3 = 0;

function checktime() {
	clearInterval(int1);
	t2 = gettimetick();
	var sec = parseInt((t2 - t1) / 1000);
	t3 += sec;
	console.log(t3);
	if (t3 >= 2400) {
		t3 = 0;
		console.log('run bak...');
		runbak();
    }
	t1 = t2;
	int1 = setInterval(checktime, 60000);
}


var int1 = setInterval(checktime, 60000);
