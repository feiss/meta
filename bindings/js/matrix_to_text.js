
exports.render = function (input, selection, op){
	if (typeof(input) === 'string') return input;
	var ret = [];
	var rows = input.length;
	for (var i = 0; i < rows; i++) {
		ret.push(input[i].join(op.separator));
	}
	return ret.join('\n');
}
