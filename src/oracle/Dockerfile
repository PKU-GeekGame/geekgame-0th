FROM python:3

WORKDIR /usr/src/app

COPY game ./

RUN pip install --no-cache-dir -r requirements.txt

CMD ["uwsgi", "--http", ":5000", "--wsgi-file", "app.py", "--callable", "app", "--master", "--processes", "4", "--threads", "2"]
EXPOSE 5000
