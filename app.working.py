from random import randint
from time import strftime
from flask import Flask, render_template, flash, request
from wtforms import Form, TextField, TextAreaField, validators, StringField, SubmitField
import json
from kafka import KafkaProducer

producer = KafkaProducer(bootstrap_servers=['localhost:9092'])

DEBUG = True
app = Flask(__name__)
app.config.from_object(__name__)
app.config['SECRET_KEY'] = 'SjdnUends821Jsdlkvxh391ksdODnejdDw'

class ReusableForm(Form):
	firstName = TextField('First Name:', validators=[validators.required()])
	lastName = TextField('Last Name:', validators=[validators.required()])

def get_time():
	time = strftime("%Y-%m-%dT%H:%M")
	return time

def write_to_json(allValues):
	with open('data.json', 'w', encoding='utf-8') as f:
		json.dump(allValues,f,ensure_ascii=False, indent=4)
	
def write_to_kafka(allValues):
	data = json.dumps(allValues)
	producer.send('nuix-topic', data.encode('utf-8'))

@app.route("/", methods=['GET', 'POST'])
def hello():
	form = ReusableForm(request.form)

	#print(form.errors)
	if request.method == 'POST':
		allValues = {
			"firstName": request.form['firstName'],
			"lastName": request.form['lastName'],
			"middleName": request.form['middleName'],
			"phoneNumber": request.form['phoneNumber'],
			"email": request.form['email'],
			"homeStreetName": request.form['homeStreetName'],
			"homeCity": request.form['homeCity'],
			"homeState": request.form['homeState'],
			"homeZip": request.form['homeZip'],
			"c1_lastName": request.form['c1_lastName'],
			"c1_firstName": request.form['c1_firstName'],
			"c1_phoneNumber": request.form['c1_phoneNumber'],
			"c1_Description": request.form['c1_Description'],
			"c1_location_StreetName": request.form['c1_location_StreetName'],
			"c1_location_City": request.form['c1_location_City'],
			"c1_location_State": request.form['c1_location_State'],
			"c1_location_Zip":request.form['c1_location_Zip']
		}


	if form.validate():
		write_to_json(allValues)
		write_to_kafka(allValues)
		flash('Hello: {} {}'.format(request.form['firstName'], request.form['lastName']))

	else:
		flash('Error: All Fields are Required')

	return render_template('index.html', form=form)

if __name__ == "__main__":
	app.run()