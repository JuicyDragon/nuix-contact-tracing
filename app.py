from random import randint
from time import strftime
from flask import Flask, render_template, flash, request
from wtforms import Form, TextField, TextAreaField, validators, StringField, SubmitField
import json

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

def write_to_disk(lastName, firstName, middleName, phoneNumber, email, homeStreetName, homeCity, homeState, homeZip, c1_lastName, c1_firstName, c1_phoneNumber, c1_Description, c1_location_StreetName, c1_location_City, c1_location_State, c1_location_Zip):
	data = open('file.log', 'a')
	timestamp = get_time()
	data.write('DateStamp={}, First Name={}, Last Name={}, Middle Name={}, Phone Number={}, Email={}, Street Address={}, City={}, State={}, Zip={}, Contact Last Name={}, Contact First Name={}, Contact Phone Number={},  Contact Description={}, Contact Location Street Name={}, Contact Location City={}, Contact Location State={}, Contact Location Zip={} \n'.format(timestamp, firstName, lastName, middleName, phoneNumber, email, homeStreetName, homeCity, homeState, homeZip, c1_lastName, c1_firstName, c1_phoneNumber, c1_Description, c1_location_StreetName, c1_location_City, c1_location_State, c1_location_Zip))
	data.close()

@app.route("/", methods=['GET', 'POST'])
def hello():
	form = ReusableForm(request.form)

	#print(form.errors)
	if request.method == 'POST':
		firstName=request.form['firstName']
		lastName=request.form['lastName']
		middleName=request.form['middleName']
		phoneNumber=request.form['phoneNumber']
		email=request.form['email']
		homeStreetName=request.form['homeStreetName']
		homeCity=request.form['homeCity']
		homeState=request.form['homeState']
		homeZip=request.form['homeZip']
		c1_lastName=request.form['c1_lastName']
		c1_firstName=request.form['c1_firstName']
		c1_phoneNumber=request.form['c1_phoneNumber']
		c1_Description=request.form['c1_Description']
		c1_location_StreetName=request.form['c1_location_StreetName']
		c1_location_City=request.form['c1_location_City']
		c1_location_State=request.form['c1_location_State']
		c1_location_Zip=request.form['c1_location_Zip']

	if form.validate():
		write_to_disk(lastName, firstName, middleName, phoneNumber, email, homeStreetName, homeCity, homeState, homeZip, c1_lastName, c1_firstName, c1_phoneNumber, c1_Description, c1_location_StreetName, c1_location_City, c1_location_State, c1_location_Zip)
		flash('Hello: {} {}'.format(firstName, lastName))

	else:
		flash('Error: All Fields are Required')

	return render_template('index.html', form=form)

if __name__ == "__main__":
	app.run()