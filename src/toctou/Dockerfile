FROM ubuntu:20.04

RUN apt-get update

ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get install -y python3 python3-openssl xinetd

RUN mkdir /chall

COPY service.py /chall/
COPY comm.py /chall/
COPY verify.py /chall/
COPY cert.pem /chall/

RUN cd /chall && python3 -m compileall service.py

COPY store.xinetd /etc/xinetd.d/store

RUN useradd -m -s /bin/bash player

CMD xinetd -dontfork

EXPOSE 3000
