import sys
import os
import re
import datetime

sys.path.append('/Library/Frameworks/Python.framework/Versions/2.7/lib/python2.7/site-packages')
import requests

for item in current_selected_items:
	#print item.getProperties()
	for prop in item.getProperties().entrySet():
		if prop.key == "homeStreetName":
			homeStreetName = prop.value
		if prop.key == 'homeState':
			homeState = prop.value
		if prop.key == 'homeCity':
			homeCity = prop.value
		if prop.key == 'homeZip':
			homeZip = prop.value
	print homeStreetName + ' ' + homeCity + ' ' + homeState + ' ' + homeZip

	payload = {'sentence': itemText}
	try:
		# https://github.com/artpar/languagecrunch/
		response = requests.get('http://localhost:8080/nlp/parse', params=payload)
		data = response.json()
