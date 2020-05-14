from datetime import datetime
import json

# Data to serve with our API

# Paths to the A&I Schema file used to load Named Entities
# For a Mac
#outputAlertsPath  = '/Users/stephenstewart/Documents/DEV/GIT/GraphPOC/WEB/data/alerts.json'
# For Azure / Windows Instance
outputAlertsPath  = 'F:/DEV/GIT/GraphPOC/WEB/data/alerts.json'


# Create a handler for our read (GET) people
def read():
	"""
	This function responds to a request for /api/people
	with the complete lists of people

	:return:        sorted list of people
	"""
	with open(outputAlertsPath, 'r') as json_file:
		FLAGS = json.load(json_file)

	# Create the list of people from our data
	#return [FLAGS[key] for key in sorted(FLAGS.keys())]
	return FLAGS
