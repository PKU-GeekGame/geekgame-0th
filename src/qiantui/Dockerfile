FROM ubuntu:18.04

COPY pwn /
COPY libc-2.27.so /

ENV LD_PRELOAD /libc-2.27.so

RUN chmod 0777 /pwn

CMD /pwn
