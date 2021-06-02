FROM python:3

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

RUN apt-get update && apt-get install -y netcat

COPY . .

#CMD [ "python", "./server.py" ]
CMD [ "bash", "./run.sh" ]

#EXPOSE 1919
