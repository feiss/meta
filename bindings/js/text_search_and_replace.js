var easyRE = require('./easyre.js')

exports.render = function (input, selection, op){
	var re = easyRE.easyRE(op.search);
	try{
		var regexp = new RegExp( re, 'g'+(op.casesensitive?'':'i'));
	}
	catch(e){
		return 'ERROR en el campo de búsqueda';
	}
	
	//TODO inselection param is ignored !!!

	return input.replace(regexp, op.replace);
}
