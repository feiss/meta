var MatrixSelection = function(s){
	this.rows = [];
	this.iterator = {mat: undefined, rows: 0, cols: 0, it: 0, rowit: 0};
	this.sel = s || '';
};

MatrixSelection.prototype = {
	clear: function () {
		this.sel = '';
		this.rows = [];

		this.iterator = {mat: undefined, rows: 0, cols: 0, it: 0, rowit: 0};
	},
	setSel: function (s) {
		this.sel = s || '';
		this.rows = [];
	},
	add: function (s) {
		if (!this.sel) this.sel = s || '';
		else this.sel += ',' + s;
	},
	clean: function () {
		this.sel = this.sel.toLowerCase();
		this.sel = this.sel.replace(/[^\d,:a-z]+/g, "");
	},
	checkPart: function (coords) {
		if (/^[a-z]+:[a-z]+$/.test(coords)) return 1; // a:b
		if (/^\d+:\d+$/.test(coords)) return 2; // 3:5
		if (/^[a-z]+\d+$/.test(coords)) return 3; // a4
		if (/^[a-z]+\d+:[a-z]+\d+$/.test(coords)) return 4; // a4:b7
		return false;
	},
	getAlphaIndex: function (a) {
		var d;
		for (var i = a.length - 1, j = 0; i >= 0 ; i--, j++) {
			if (j === 0) d = a.charCodeAt(i) - 97;
			else d += (a.charCodeAt(i) - 97 + 1) * Math.pow(26, j);
		}
		return d;
	},
	getCoordsFromPart: function (p) {
		var a = p.match(/^[a-z]+/)[0];
		var b = p.substr(a.length);
		var col = Math.max( 0, Math.min(this.getAlphaIndex(a), this.iterator.cols));
		var row = Math.max( 0, Math.min(parseInt(b) - 1, this.iterator.rows));
		return {rowcol: row, start: col, length: 1, iscolumn: false};
	},
	calcRows: function () {
		// convertir this.sel en arrays [ {rowcol, start, length, iscolumn}, ... ]
		var parts = this.sel.split(',');
		for (var i = 0; i < parts.length; i++) {
			var p = parts[i];
			// parttype=
			// 1  a:b
			// 2  1:2
			// 3  a1
			// 4  a1:b2
			var parttype = this.checkPart(p);
			if (!parttype) {
				console.warn(p + ' is not a valid coordinate(s)');
				continue;
			}

			if (p.indexOf(':') === -1) { // parttype 3 - a1
					this.rows.push(this.getCoordsFromPart(p));
			}
			else if (parttype == 1 || parttype == 2) { 
				var [a, b] = p.split(':');
				if (parttype == 1) {
					a = this.getAlphaIndex(a);
					b = this.getAlphaIndex(b);
				} 
				else {
					a = parseInt(a) - 1;
					b = parseInt(b) - 1;
				}
				if (b > a) { var aux = a; a = b; b = aux; }
				if (a < 0) a = 0;
				if (parttype == 1 && b > this.iterator.cols) b = this.iterator.cols;
				if (parttype == 2 && b > this.iterator.rows) b = this.iterator.rows;
				for (var i = a; i <= b; i++) {
					if (parttype == 1) {
						this.rows.push({rowcol: i, start: 0, length: this.iterator.rows, iscolumn: true});
					}
					else {
						this.rows.push({rowcol: i, start: 0, length: this.iterator.cols, iscolumn: false});
					}
				}
			}
			else { //parttype 4 - a1:b2
				var [a, b] = p.split(':');
				var aa = this.getCoordsFromPart(a);
				var bb = this.getCoordsFromPart(b);
				if (aa.rowcol > bb.rowcol) {var aux = aa; aa = bb; bb = aux;}
				var start = Math.min(aa.start, bb.start);
				var length = Math.max(aa.start, bb.start) - start;
				for (var r = aa.rowcol; r <= bb.rowcol; r++) {
					this.rows.push({rowcol: r, start: start, length: length ,iscolumn: false})
				}
			}
		}
	},
	normalize: function () {
		this._calcRows();
		this._checkColumn();
	},
	iterate: function (mat) {
		if (mat !== this.iterator.mat) {
			this.iterator.mat = mat;
			this.iterator.rows = this.iterator.mat.length;
			this.iterator.cols = this.iterator.mat.length > 0 ? this.iterator.mat[0].length : 0;
			this.iterator.rowit = 0;
			this.iterator.it = 0;

			this.calcRows();
		}
		else {
			var row = this.rows[this.iterator.rowit];
			if (this.iterator.it >= row.length){
				this.iterator.it = 0;
				this.iterator.rowit ++;
				if (this.iterator.rowit > this.rows.length) {
					return null;
				}
			}
			var colit = row.start + this.iterator.it;
			this.iterator.it++;
			if (row.iscolumn) {
				return { 
					row: row.rowcol,
					col: colit,
					value: this.iterator.mat[row.rowcol][colit]
				}
			}
			else {
				return { 
					row: colit,
					col: row.rowcol,
					value: this.iterator.mat[colit][row.rowcol]
				}
			}
		}
	}	
};


//rowtest


var row = MatrixSelection();
