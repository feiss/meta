var Selection = function(){
	this.sel = '';
	this.inputlength = 9999;
}

Selection.prototype = {
	clear: function() {
		this.sel = '';
	},
	setLength: function(input) {
		if (input && input.length > 0){
			if (typeof(input) == 'string') this.inputlength = input.length;
			else this.inputlength = input.length * input[0].length;
		}
		else this.inputlength = 9999;
	},
	set: function (s, input) {
		this.sel = '' + s;
		this.setLength(input);
		this.clean();
		this.normalize();
	},
	add: function (s, input) {
		this.sel += (this.sel? ',' : '') + s;
		this.setLength(input);
		this.clean();
		this.normalize();
	},
	clean: function () {
		this.sel = this.sel.replace(/[^\d-,]+/g, "");
		//this.sel = this.sel.replace(/^[^\d]*/g, "");
		//this.sel = this.sel.replace(/[^\d-]*$/g, "");
	},
	remove: function (s) {

	},
	invert: function () {
	},
	toArray: function(sorted) {
		if (!this.sel) return [];
		var parts = this.sel.split(',');
		var arr = [];
		for (var i = 0; i < parts.length; i++) {
			var p = parts[i];
			if (p.indexOf('-') !== -1){
				var pp = p.split('-');
				var start = parseInt(pp[0]) || 0;
				var end = parseInt(pp[1]) || this.inputlength;
				//if (start===NaN || end===NaN) continue;
				if (start === end) arr.push(start);
				else if (start < end){
					for (var j = start; j <= end; j++) {
						arr.push(j);
					}
				}
			}
			else arr.push(parseInt(p));
		}
		//remove duples
		var res = [];
		var arrlen = arr.length;
		for (var i = 0; i < arrlen; i++) {
			var it = arr[i];
			if(res.indexOf(it) < 0) res.push(it);
		}
		if (sorted !== false) res.sort((a,b)=>a-b);		
		return res;
	},
	normalize: function(){
		//this.sel = this.sel.test(/[^\d,-]/g, '');
		var arr = this.toArray();
		var s = '', a;
		var start, prev;
		var end = arr.length - 1;
		for (var i = 0; i <= end; i++) {
			if (prev === undefined) {
				if (i == end) s= ''+arr[0]; //only one number
				prev = arr[i]; 
				start = prev;
				continue;
			};
			if (arr[i] > prev + 1) {
				if (start < prev) a = start+'-'+prev;
				else a = start;
				s += (s!=''?',':'') + a; 
				prev = arr[i];
				start = prev;
				if (i === end) {
					s += ',' + arr[i];
				}
			}
			else if(i === end) {
				if (arr[i] == prev) a = arr[i];
				else a = start+'-'+arr[i];
				s += (s!=''?',':'') + a;
			}
			else prev++;
		}
		this.sel = s;
		return this.sel;
	},
	highlightText: function(text, open, close) {
		if (!this.sel) return text;
		var parts = this.sel.split(',');
		var ret = '';
		var pos = parseInt(parts[0].split('-')[0]);
		if (pos > 0) ret = text.substr(0, pos);
		for (var i = 0; i < parts.length; i++) {
			var pp = parts[i].split('-');
			if (pp.length == 1) {
				ret += open + text[parseInt(pp[0])] + close;
			}
			else {
				ret += open + text.substring(parseInt(pp[0]), parseInt(pp[1])+1) + close;
			}
			if (i < parts.length - 1){
				pos = parseInt(parts[i+1].split('-')[0]);
				ret += text.substring(parseInt(pp[1])+1, pos);
			}
		}
		if (pp.length == 1) pos = parseInt(pp[0]); else pos = parseInt(pp[1]);
		if (pos < text.length) {
			ret += text.substr(pos+1);
		}
		return ret;
	}
};