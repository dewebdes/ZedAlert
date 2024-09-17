
/// <summary>
/// return an ready to fire async request object
/// </summary>

function doRequest(durl, dqs) {
	return new Promise(function (resolve, reject) {
		global.request({ url: durl, qs: dqs }, function (error, res, body) {
			resolve(body);
			//if (!error && res.statusCode === 200) {
			//	resolve(body);
			//} else {
			//	reject(error);
			//}
		});

	});
}
module.exports.doRequest = doRequest;

function doRequest_proxy(durl) {
	return new Promise(function (resolve, reject) {
		console.log(durl);

		var uri2 = "https://flat-dust-acfXXXXXXX.workers.dev/?dieuri=" + encodeURIComponent(durl);

		global.request({ url: uri2 }, function (error, res, body) {
			console.log('res: ' + res);
			console.log('err: ' + error);
			resolve(body);
			//if (!error && res.statusCode === 200) {
			//	resolve(body);
			//} else {
			//	reject(error);
			//}
		});

	});
}
module.exports.doRequest_proxy = doRequest_proxy;