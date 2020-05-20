FROM ubuntu:latest

RUN apt-get update && apt-get -y install python3 python3-pip && apt-get clean
RUN pip3 install flask
RUN pip3 install connexion
RUN pip3 install flask wtforms
RUN pip3 install kafka
RUN pip3 install kafka-python

WORKDIR /user/server
COPY . .

#CMD ["sh","-c","python3","/user/server/app.working.py"]
RUN tail -f /dev/null