FROM ubuntu:20.04

RUN mkdir /chall

COPY rop /chall/
#COPY flag.txt /chall/

RUN chmod 0777 /chall/rop
RUN ln -s /data/flag /chall/flag
#RUN chmod 0400 /chall/flag.txt

CMD tail -f /dev/null
#CMD cd /chall && ./rop
