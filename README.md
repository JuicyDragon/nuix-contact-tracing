# Python Web Server Prerequisites:

```
pip3 install flask
pip3 install connexion
```
### Web Files that need updating based on OS
Validate URL. 
```
./WEB/static/js/stoplight.js
const STOPLIGHT_SERVER_URL = 'http://localhost:5000/api/flags'
const STOPLIGHT_SERVER_URL = 'http://{DNS_NAME}:5000/api/flags'
```
Validate the correct location of the alerts.json file.
```
./WEB/flags.py
outputAlertsPath  = '/Users/stephenstewart/Documents/DEV/GIT/GraphPOC/WEB/data/alerts.json'
outputAlertsPath  = 'F:/WEB/data/alerts.json'

```

### Starting the Python Web Server
1. Change directory to the location of the server.py
2. Start the server.py
```
pthon3 server.py
```
