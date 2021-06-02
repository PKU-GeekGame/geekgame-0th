FROM ubuntu:20.04

RUN mkdir /chall

COPY decoder /chall/
#COPY flag.txt /chall/

RUN chmod 0777 /chall/decoder
RUN ln -s /data/flag /chall/flag.txt
#RUN chmod 0400 /chall/flag.txt

CMD tail -f /dev/null
#CMD cd /chall && ./decoder
