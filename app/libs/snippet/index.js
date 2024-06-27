/// <summary>
/// return current time ticks
/// </summary>

exports.gettimetick = () => {
	var date = new Date();
	var ticks = date.getTime();
	return ticks;
}

/// <summary>
/// check if input was null or empty
/// </summary>

exports.isnullval = (tval) => {
	var retval = false;
	try {
		if ((tval == "") || (tval == undefined) || (tval == null) || (tval == NaN) || (jQuery.trim(tval) == "")) { retval = true; }
	} catch (ex) {
		retval = false;
	}
	return retval;
}

/// <summary>
/// helpers to make new UUID
/// </summary>

exports.S4 = () => {
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
exports.id = () => {
	return (global.snippet.S4() + global.snippet.S4() + global.snippet.S4() + global.snippet.S4() + global.snippet.S4() + global.snippet.S4() + global.snippet.S4() + global.snippet.S4());
}
exports.id2 = () => {
	return (global.snippet.S4() + '-' + global.snippet.S4() + '-' + global.snippet.S4() + '-' + global.snippet.S4() + '-' + global.snippet.S4());
}

/// <summary>
/// return current server datetime string
/// </summary>

exports.getnow = () => {
	var currentdate = new Date();
	var datetime = currentdate.getDate() + "/"
		+ (currentdate.getMonth() + 1) + "/"
		+ currentdate.getFullYear() + " "
		+ currentdate.getHours() + ":"
		+ currentdate.getMinutes() + ":"
		+ currentdate.getSeconds();
	return datetime;
}

exports.getnow2 = () => {
	var currentdate = new Date();
	var datetime = currentdate.getFullYear() + "/"
		+ (currentdate.getMonth() + 1) + "/"
		+ currentdate.getDate() + " "
		+ currentdate.getHours() + ":"
		+ currentdate.getMinutes() + ":"
		+ currentdate.getSeconds();
	return datetime;
}


/// <summary>
/// replace string in text
/// </summary>

exports.replaceallstr = (ts, tv, rv) => {
	try {
		while (ts.indexOf(tv) > -1) {
			ts = ts.replace(tv, rv);
		}
	} catch (ex) { }
	return ts;
}

/// <summary>
/// return seconds date-diff by now
/// </summary>

exports.datedifnow = (d) => {
	var d1 = new Date(d);
	var d2 = new Date();
	var dif = d1.getTime() - d2.getTime();
	var Seconds_from_T1_to_T2 = dif / 1000;
	var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
	//global.logging.netlog(Seconds_Between_Dates);
	var ret = new Date(Seconds_Between_Dates * 1000).toISOString().substring(11, 16);
	return ret;
}

/// <summary>
/// return days date-diff by now
/// </summary>

exports.datedifnowday = (d) => {
	var d1 = new Date(d);
	var d2 = new Date();
	var dif = d1.getTime() - d2.getTime();
	var Difference_In_Days = dif / (1000 * 3600 * 24);
	return parseInt(Math.abs(Difference_In_Days));
}

/// <summary>
/// return CET live datetime object
/// </summary>

exports.getCETorCESTDate = () => {
	var localDate = new Date();
	var utcOffset = localDate.getTimezoneOffset();
	var cetOffset = utcOffset + 60;
	var cestOffset = utcOffset + 120;
	var cetOffsetInMilliseconds = cetOffset * 60 * 1000;
	var cestOffsetInMilliseconds = cestOffset * 60 * 1000;

	var cestDateStart = new Date();
	var cestDateFinish = new Date();
	var localDateTime = localDate.getTime();
	var cestDateStartTime;
	var cestDateFinishTime;
	var result;

	cestDateStart.setTime(Date.parse('29 March ' + localDate.getFullYear() + ' 02:00:00 GMT+0100'));
	cestDateFinish.setTime(Date.parse('25 October ' + localDate.getFullYear() + ' 03:00:00 GMT+0200'));

	cestDateStartTime = cestDateStart.getTime();
	cestDateFinishTime = cestDateFinish.getTime();

	if (localDateTime >= cestDateStartTime && localDateTime <= cestDateFinishTime) {
		result = new Date(localDateTime + cestOffsetInMilliseconds);
	} else {
		result = new Date(localDateTime + cetOffsetInMilliseconds);
	}

	return result;
}

/// <summary>
/// add minutes to date object and return new one
/// </summary>

exports.addMinutes = (date, minutes) => {
	return new Date(date.getTime() + minutes * 60000);
}

exports.addPercentage = (number, percentage) => {
	const decimalPercentage = percentage / 100;
	return number + (number * decimalPercentage);
}

exports.onlyUnique = (value, index, array) => {
	return array.indexOf(value) === index;
}