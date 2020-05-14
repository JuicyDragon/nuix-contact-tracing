# Python Web Server Prerequisites:

```
pip3 install flask
pip3 install connexion
pip3 install flask wtforms
```
## Kakfa Setting for Nuix
```
Zookeeper - 127.0.0.1:2181
Bootstrap.servers - 127.0.0.1:9092
```
## Kafka - Putting items on a Topic
https://towardsdatascience.com/kafka-python-explained-in-10-lines-of-code-800e3e07dad1
def write_to_kafka(allValues):
	data = json.dumps(allValues)
	producer.send('nuix-topic', data.encode('utf-8'))
