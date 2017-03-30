import re

def easyRE(expr):
	expr = re.sub(r'\\v', '[aeiou]', expr, flags = re.IGNORECASE)
	expr = re.sub(r'\\p', '\\w+', expr, flags = re.IGNORECASE)
	expr = re.sub(r'\\#', '\\d+', expr, flags = re.IGNORECASE)
	expr = re.sub(r'\\@', '\\d+[.,]\\d*', expr, flags = re.IGNORECASE) # TODO: fix this! no encaja con 3343 sin decimales
	return expr;

