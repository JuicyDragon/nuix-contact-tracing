# Python Web Server Prerequisites:

```
pip3 install flask
pip3 install connexion
pip3 install flask wtforms
pip3 install kafka
pip3 install kafka-python
```
## Kakfa Setting for Nuix
Kafka Installation / Configuration:
https://confluence.nuix.com/display/NR/Kafka+Installation
```
Zookeeper - 127.0.0.1:2181
Bootstrap.servers - 127.0.0.1:9092
```
## Kafka - Putting items on a Topic
https://towardsdatascience.com/kafka-python-explained-in-10-lines-of-code-800e3e07dad1
```
def write_to_kafka(allValues):
	data = json.dumps(allValues)
	producer.send('nuix-topic', data.encode('utf-8'))
```
## Python Flask Tutorial I copied.
https://blog.ruanbekker.com/blog/2018/05/27/web-forms-with-python-flask-and-the-wtforms-module-with-bootstrap/


## Getting Kafka Running on a Windows Machine.
1. Download https://www.apache.org/dyn/closer.cgi?path=/kafka/1.0.0/kafka_2.11-1.0.0.tgz
2. Upzip to an easily accessible location
3. Update the /config/zookeeper.properties dataDir path to a correct locally accessible path eg. dataDir:G:\\kafka\\data
4. Update the /config/server.properties log.dirs path to a correct, locally accessible path eg. log.dirs=G:\\kakfa\\tmp\\logs
5. Start Zookeeper
```
{install_directory}/bin/windows>zookeeper-server-start.bat "{install_directory}\\config\\zookeeper.properties
```
6. Start Kafka
```
{install_directory}/bin/windows>zookeeper-server-start.bat "{install_directory}\\config\\server.properties
```
7. Create a Topic
```
{install_directory}/bin/windows>kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 2 --topic nuix-topic
```
