var MatrixSelection = function(s){
	this.rows = [];
	this.iterator = {mat: undefined, rows: 0, cols: 0, it: 0, rowit: 0};
	this.sel = s || '';
};

MatrixSelection.prototype = {
	clear: function () {
		this.sel = '';
		this.rows = [];
		this.resetIterator()
	},
	setSel: function (s) {
		this.sel = s || '';
		this.rows = [];
		this.resetIterator(this.iterator.mat)
	},
	add: function (s) {
		if (!this.sel) this.sel = s || '';
		else this.sel += ',' + s;
		this.resetIterator(this.iterator.mat)
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
	getCoordsFromPart: function (p, clamp) {
		var a = p.match(/^[a-z]+/)[0];
		var b = p.substr(a.length);
		if (clamp) {
			var col = Math.max( 0, Math.min(this.getAlphaIndex(a), this.iterator.cols - 1));
			var row = Math.max( 0, Math.min(parseInt(b) - 1, this.iterator.rows - 1));
		}
		else {
			var col = this.getAlphaIndex(a);
			if (col < 0 || col > this.iterator.cols - 1) return false;
			var row = parseInt(b) - 1;
			if (row < 0 || row > this.iterator.rows - 1) return false;
		}
		return {rowcol: row, start: col, length: 1, iscolumn: false};
	},
	calcRows: function (clamp) {
		// convertir this.sel en arrays [ {rowcol, start, length, iscolumn}, ... ]
		this.clean();
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
				var row = this.getCoordsFromPart(p, clamp);
				if (row !== false) {
					this.rows.push(row);
				}
			}
			else if (parttype == 1 || parttype == 2) { 
				var [a, b] = p.split(':');
				if (parttype == 1) {
					a = this.getAlphaIndex(a);
					b = this.getAlphaIndex(b);
				} 
				else {
					//debugger;
					a = parseInt(a) - 1;
					b = parseInt(b) - 1;
				}
				if (b < a) { var aux = a; a = b; b = aux; }
				if (a < 0) a = 0;
				if (parttype == 1 && b > this.iterator.cols) b = this.iterator.cols;
				if (parttype == 2 && b > this.iterator.rows) b = this.iterator.rows;
				for (var j = a; j <= b; j++) {
					if (parttype == 1) {
						this.rows.push({rowcol: j, start: 0, length: this.iterator.rows, iscolumn: true});
					}
					else {
						this.rows.push({rowcol: j, start: 0, length: this.iterator.cols, iscolumn: false});
					}
				}
			}
			else { //parttype 4 - a1:b2
				var [a, b] = p.split(':');
				var aa = this.getCoordsFromPart(a, clamp);
				var bb = this.getCoordsFromPart(b, clamp);
				if (aa.rowcol > bb.rowcol) {var aux = aa; aa = bb; bb = aux;}
				var start = Math.min(aa.start, bb.start);
				var length = Math.max(aa.start, bb.start) - start + 1;
				for (var r = aa.rowcol; r <= bb.rowcol; r++) {
					this.rows.push({rowcol: r, start: start, length: length ,iscolumn: false})
				}
			}
		}
	},
	resetIterator: function(mat, recalculateRows) {
		if (mat !== undefined) {
			this.iterator.mat = mat;
			this.iterator.rows = this.iterator.mat.length;
			this.iterator.cols = this.iterator.mat.length > 0 ? this.iterator.mat[0].length : 0;
			this.iterator.rowit = 0;
			this.iterator.it = 0;
			if (recalculateRows === undefined || recalculateRows === true) {
				this.calcRows();
			}
		}
		else {
			this.iterator = {mat: undefined, rows: 0, cols: 0, it: 0, rowit: 0};
		}
	},
	iterate: function (mat) {
		if (mat === undefined || mat !== this.iterator.mat) {
			this.resetIterator(mat);
			if (mat) return this.iterate(mat);
		}
		else {
			var row = this.rows[this.iterator.rowit];
			if (this.iterator.it >= row.length){
				this.iterator.it = 0;
				this.iterator.rowit ++;
				if (this.iterator.rowit >= this.rows.length) {
					this.resetIterator(mat, false);
					return null;
				}
				else {
					row = this.rows[this.iterator.rowit];
				}
			}
			var colit = row.start + this.iterator.it;
			this.iterator.it++;
			if (!row.iscolumn) {
				return { 
					row: row.rowcol,
					col: colit
				}
			}
			else {
				return { 
					row: colit,
					col: row.rowcol
				}
			}
		}
	}	
};


//rowtest


var row = MatrixSelection();
