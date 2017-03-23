
var easyRE = function (re) {
	this.re = '';
	this.set(re)
}

easyREhelp =`<b>\\n</b> Nueva línea<br>
			 <b>\\t</b> Tabulador<br>
			 <b>\\p</b> Palabra<br>
			 <b>\\v</b> Vocal<br>
			 <b>\\w</b> Letra o dígito<br>
			 <b>\\d</b> Número (1 dígito)<br>
			 <b>\\#</b> Cifra sin decimales<br>
			 <b>\\@</b> Cifra con decimales (opcionales)<br>
			 <b>\\s</b> Espacios o tabuladores juntos<br>
			 `;

easyRE.prototype = {
	set: function(re) {
		this.re = re;
		this.re = this.re.replace(/\\v/g, '[aeiou]');
		this.re = this.re.replace(/\\p/g, '\\w+');
		this.re = this.re.replace(/\\#/g, '\\d+');
		this.re = this.re.replace(/\\@/g, '\\d+[.,]\\d*'); // TODO: fix this! no encaja con 3343 sin decimales
	}
}