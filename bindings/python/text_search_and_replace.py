import re, easyre

def render(input, selection, op):
	regexp = easyre.easyRE(op['search'])
	
	#TODO inselection param is ignored !!!

	return re.sub(regexp, op['replace'], input, flags = re.IGNORECASE if not op['casesensitive'] else 0)
