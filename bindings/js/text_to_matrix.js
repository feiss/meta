
exports.render = function (input, selection, op){
	if (!input['split']) return [[]];
	var m = input.split('\n');
	var numlines = m.length;
	var max = 0;
	for (var i = 0; i < numlines; i++) {
		m[i] = m[i].split(op.separator);
		if (m[i].length > max) max = m[i].length;
	}
	for (var i = 0; i < m.length; i++) {
		if (m[i].length < max) m[i][max-1] = undefined;
	}
	return m;
}
