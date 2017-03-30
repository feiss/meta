
const fs = require('fs');
const opsfolder = '../ops/';
const outputfolder = '../';
var all = {
	version: '0.1',
	ops: []
};
console.log('=== Looking for operations in '+opsfolder+' ====')
fs.readdir(opsfolder, (err, files) => {
  files.forEach(file => {
  	var obj = JSON.parse(fs.readFileSync(opsfolder+file, 'utf8'));
  	if (obj){
	  	all.ops.push(obj);
      console.log('· Added ' + file)
  	}
  });
  fs.writeFileSync(outputfolder + 'ops.json', JSON.stringify(all));
  console.log('=== Saved ops.json ====');
})