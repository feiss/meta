const fs = require('fs');
const JSFOLDER = '../bindings/js/';

function render (project){
  var oplist = project.oplist;
  var data;
  var selection;
  var oprender = {};
  for (var i = 0; i < oplist.length; i++) {
    var op = oplist[i];
    if (!op.active) continue;
    if (oprender[op.id] === undefined) {
      try {
        oprender[op.id] = require(JSFOLDER + op.id + '.js');
      }
      catch(e){ console.log(e.message); return null; };
    }
    data = oprender[op.id].render(data, selection, op);
  };
  return data;
}


if (process.argv.length < 3) {
  console.log("\nMetanode - NodeJS Binding for META by feiss.be\n\nUsage: node metanode.js <project.json> [input_files] \n");
  return;
}

try {
  var project = JSON.parse(fs.readFileSync(process.argv[2]));
}
catch(e) { console.log(e.message); return; };

var result = render(project);

console.log(result);

