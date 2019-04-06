module.exports = function f(data) {
	var resdata = {};
	data.map(function(item) {
		if(item[0] in resdata) {
			if(item[4] < resdata[item[0]][4]) {
				resdata[item[0]] = item;
			}
		} else {
			resdata[item[0]] = item;
		}
	});
	let rdata = [];
	for(var i = 0; i < Object.keys(resdata).length; i ++) {
		rdata.push(resdata[Object.keys(resdata)[i]]);
	}
	return rdata;
}

