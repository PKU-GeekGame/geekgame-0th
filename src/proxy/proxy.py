#!/usr/bin/python3
# -*- coding: utf-8 -*-

import socket
import re
from socketserver import ThreadingMixIn, TCPServer, StreamRequestHandler
import struct
import select
import _thread

compile_ipv4=re.compile('^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$')
compile_ipv6=re.compile('(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))')



def check_ipv4(host):
    if compile_ipv4.match(host.decode("utf-8")):
        return True
    return False
def check_ipv6(host):
    if compile_ipv6.match(host.decode("utf-8")):
        return True
    return False



class ThreadingTCPServer(ThreadingMixIn, TCPServer):
    pass

class SocksProxy(StreamRequestHandler):


    def recvtrash(self,remote):
        remote.recv(3)
        ty=struct.unpack("!B",remote.recv(1))[0]
        if ty==1:
            remote.recv(4)
        elif ty==4:
            remote.recv(16)
        else:
            le=struct.unpack("!B",remote.recv(1))[0]
            remote.recv(le)
        remote.recv(2)
    def handle(self):
        # greeting header
        # read and unpack 2 bytes from a client
        ddt=self.connection.recv(1)
        typ=struct.unpack("!B",ddt)[0]
        if typ==5:
            return 
        gg = ddt+self.connection.recv(4096)
        if gg[0:7]==b'CONNECT':
            return
        else:
            print("HTTP")
            tmp=gg.split(b' ')[1].split(b'/')
            if tmp[0]!=b"http:":
                print("ERR")
                return
            if tmp[2]!=b"iaaa.pku.edu.cn" and tmp[2]!=b"game.pku.edu.cn":
                print("NOT ALLOWED")
                self.connection.send(b"HTTP/1.1 406 Not Acceptable\r\nConnection: close\r\nContent-Type: text/plain\r\n\r\nThe requested URL is not allowed")
                return
            net=tmp[0]+b'//'+tmp[2]
            request=gg.replace(net,b'')
            if tmp[2]==b"iaaa.pku.edu.cn":
                port=80
            else:
                port=81
            remote = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            remote.connect(("127.0.0.1", port))
            remote.send(request)
            self.exchange_loop(self.connection, remote)


    def exchange_loop(self, client, remote):
        while True:
            r, w, e = select.select([client, remote], [], [])
            if client in r:
                data = client.recv(4096)
                if remote.send(data) <= 0:
                    break
            if remote in r:
                data = remote.recv(4096)
                if client.send(data) <= 0:
                    break


server=ThreadingTCPServer(('0.0.0.0', 8080), SocksProxy)
server.serve_forever()