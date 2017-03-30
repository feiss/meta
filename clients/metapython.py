import json, sys
PYFOLDER = '../bindings/python/';
sys.path.insert(0, PYFOLDER)

def render (project):
	data = None
	oplist = project['oplist']
	selection = None
	oprender = dict()
	for op in oplist:
		if not op['active']: continue
		opid = op['id']
		if not opid in oprender:
			try:
				oprender[opid] = __import__(opid)
			except Exception, e:
				print (e)
				exit(1)
		data = oprender[opid].render(data, selection, op)
	return data


if (len(sys.argv) < 2):
  print ("\nMetaPython - Python Binding for META by feiss.be\n\nUsage: python metapython.py <project.json> [input_files] \n");
  exit(0)

with open(sys.argv[1]) as json_data:
	project = json.load(json_data)

result = render(project)

print (result)