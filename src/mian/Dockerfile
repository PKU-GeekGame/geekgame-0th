FROM ubuntu:20.04

RUN apt-get update

ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get install -y gcc g++

RUN mkdir /chall

COPY check.sh /chall/
RUN chmod 0777 /chall/check.sh

RUN useradd -m -s /bin/bash player
USER player

CMD tail -f /dev/null