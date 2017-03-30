
exports.render = function (input, selection, op){
	if (typeof(input)==='string') return input;
	var ret = new Array(input[0].length);
	for (var i = 0; i < ret.length; i++) {
		ret[i] = new Array(input.length);
		for (var j = 0; j < ret[i].length; j++) {
			ret[i][j] = input[j][i];
		};
	};
	return ret;
}
