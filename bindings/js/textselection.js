var TextSelection = function(s){
	this.lines_at = []; // indexes of line beginnings
	this.lines = [];
	this.iterator = {text: undefined, length: 0, it: 0, lineit: 0};
	this.sel = s || '';
};

TextSelection.prototype = {
	clear: function () {
		this.sel = '';
		this.lines = [];
		this.resetIterator()
	},
	setSel: function (s) {
		this.sel = s || '';
		this.lines = [];
		this.resetIterator(this.iterator.text)
	},
	add: function (s) {
		if (!this.sel) this.sel = s || '';
		else this.sel += ',' + s;
		this.resetIterator(this.iterator.text)
	},
	clean: function () {
		this.sel = this.sel.toLowerCase();
		this.sel = this.sel.replace(/[^\d,:-]+/g, "");
	},
	checkPart: function (coords) {
		if (/^\d+$/.test(coords)) return 1; // whole line (1, 3, 15..)
		if (/^\d+:\d+-\d+$/.test(coords)) return 2; // 1:1-5
		if (/^\d+:\d+-$/.test(coords)) return 3; // 1:1-
		if (/^\d+:-\d+$/.test(coords)) return 4; // 1:-5
		return false;
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
		return {start: col, end: 1, selected: true};
	},
	findLines: function() {
		this.lines_at = [];
		if (!this.iterator.text) return;
		this.lines_at.push(0);
		var p, lastp;
		while ( (p = this.iterator.text.indexOf('\n', lastp)) !== -1){
			if (p < this.iterator.length) {
				this.lines_at.push(p+1);
				lastp = p + 1;
			}
			else break;
		}
	}
	calcRows: function (clamp) {
		// convertir this.sel en arrays [ {rowcol, start, length, iscolumn}, ... ]
		this.clean();
		this.findLines();
		var parts = this.sel.split(',');
		for (var i = 0; i < parts.length; i++) {
			var p = parts[i];
			// parttype=
			// 1  1
			// 2  1:1-5
			// 3  1:1-
			// 4  1:-5
			var parttype = this.checkPart(p);
			if (!parttype) {
				console.warn(p + ' is not a valid coordinate(s)');
				continue;
			}

			if (p.indexOf(':') === -1) { // parttype 1
				this.lines.push();
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
						this.lines.push({rowcol: j, start: 0, length: this.iterator.rows, iscolumn: true});
					}
					else {
						this.lines.push({rowcol: j, start: 0, length: this.iterator.cols, iscolumn: false});
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
					this.lines.push({rowcol: r, start: start, length: length ,iscolumn: false})
				}
			}
		}
	},
	resetIterator: function(text, recalculateRows) {
		if (text !== undefined) {
			this.iterator.text = text;
			this.iterator.length = text.length;
			this.iterator.it = 0;
			this.iterator.lineit = 0;
			if (recalculateRows === undefined || recalculateRows === true) {
				this.calcRows();
			}
		}
		else {
			this.iterator = {mat: undefined, length: 0, it: 0, lineit: 0};
		}
	},
	iterate: function (mat) {
		if (mat === undefined || mat !== this.iterator.text) {
			this.resetIterator(mat);
			if (mat) return this.iterate(mat);
		}
		else {
			var row = this.lines[this.iterator.lineit];
			if (this.iterator.it >= row.length){
				this.iterator.it = 0;
				this.iterator.lineit ++;
				if (this.iterator.lineit >= this.lines.length) {
					this.resetIterator(mat, false);
					return null;
				}
				else {
					row = this.lines[this.iterator.lineit];
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


