
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
