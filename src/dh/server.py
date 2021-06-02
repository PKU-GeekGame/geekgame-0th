from Crypto.Cipher import AES #pip install pycryptodome,aioconsole
from Crypto.Random import random
from CA import *
from flag import flag1,flag2,A_cert,B_cert
import asyncio
import os
import aioconsole

assert cert_verify(A_cert)[0]
assert cert_verify(B_cert)[0]


def pad(msg):
    n = 16 - len(msg) % 16
    return msg + bytes([n]) * n

def unpad(msg):
    assert len(msg) > 0 and len(msg) % 16 == 0
    n = msg[-1]
    assert 1 <= n <= 16
    assert msg[-n:] == bytes([n]) * n
    return msg[:-n]

class Alice:
    def __init__(self,token,net):
        self.token=token
        self.net=net
        self.running=False
        self.end=False
    async def run(self):
        try:
            self.running=True
            self.d=random.getrandbits(1024)
            self.d-=self.d&1
            pk=pow(G,self.d,P)
            self.net.send(1,(hex(pk)[2:]))
            gk=self.net.recv(0)
            rgk=await asyncio.wait_for(gk,timeout=300)
            rgk=int(rgk,16)
            key=pow(rgk,self.d,P)

            aes_key=int.to_bytes(key%(2**128),16,'big')
            aes_iv = os.urandom(16)
            aes=AES.new(aes_key, AES.MODE_CBC, aes_iv)
            cmess=(aes_iv+aes.encrypt(pad(A_cert.encode()))).hex()
            self.net.send(1,cmess)

            bcmess=self.net.recv(0)
            ugb=await asyncio.wait_for(bcmess,timeout=300)
            bcmess=bytes.fromhex(ugb)
            baes_iv,bcipher=bcmess[:16],bcmess[16:]
            baes=AES.new(aes_key,AES.MODE_CBC,baes_iv)
            bmess=unpad(baes.decrypt(bcipher)).decode()
            cert_verify(bmess)

            if key<(2**512):
                flag=flag1(self.token)
            else:
                flag=flag2(self.token)
            
            aes_iv = os.urandom(16)
            aes=AES.new(aes_key, AES.MODE_CBC, aes_iv)
            cmess=(aes_iv+aes.encrypt(pad(flag.encode()))).hex()
            self.net.send(1,cmess)
            self.end=True
            return
        except Exception as e:
            self.net.send(1,"ERROR!")
            print(repr(e))#for debug only
            self.end=True
            return


class Bob:
    def __init__(self,token,net):
        self.token=token
        self.net=net
        self.running=False
        self.end=False
    async def run(self):
        try:
            self.running=True
            self.d=random.getrandbits(1024)
            self.d-=self.d&1
            pk=pow(G,self.d,P)
            self.net.send(0,(hex(pk)[2:]))
            gk=self.net.recv(1)
            rgk=await asyncio.wait_for(gk,timeout=300)
            gk=int(rgk,16)
            key=pow(gk,self.d,P)

            aes_key=int.to_bytes(key%(2**128),16,'big')
            aes_iv = os.urandom(16)
            aes=AES.new(aes_key, AES.MODE_CBC, aes_iv)
            cmess=(aes_iv+aes.encrypt(pad(B_cert.encode()))).hex()
            self.net.send(0,cmess)

            acmess=self.net.recv(1)
            uga=await asyncio.wait_for(acmess,timeout=300)
            acmess=bytes.fromhex(uga)
            baes_iv,bcipher=acmess[:16],acmess[16:]
            aaes=AES.new(aes_key,AES.MODE_CBC,baes_iv)
            amess=unpad(aaes.decrypt(bcipher)).decode()
            cert_verify(amess)

            cflag=self.net.recv(1)
            fga=await asyncio.wait_for(cflag,timeout=300)
            cflag=bytes.fromhex(fga)
            civ,flagc=cflag[:16],cflag[16:]
            caes=AES.new(aes_key,AES.MODE_CBC,civ)
            flag=unpad(caes.decrypt(flagc)).decode()
            self.end=True
            return
        except Exception as e:
            self.net.send(1,"ERROR!")
            print(repr(e))#for debug only
            self.end=True
            return

class Net:
    def __init__(self,token,onmess):
        self.token=token
        self.U=[Alice(token,self),Bob(token,self)]
        self.que=[asyncio.Queue(),asyncio.Queue()]
        self.onmess=onmess
    async def recv(self,uid):
        mess=await self.que[uid].get()
        return mess
    def send(self,uid,mess):
        nml=["Alice","Bob"]
        self.onmess("Message to "+nml[uid]+":\n"+mess)
    def usend(self,uid,mess):
        self.que[uid].put_nowait(mess)

async def localinput(g):
    while True:
        if g.U[0].end and g.U[1].end:
            break
        print("0. Talk to Alice")
        print("1. Talk to Bob")
        try:
            x=int((await aioconsole.ainput()).strip())
            assert x in [0,1]
            print("Your message:")
            y=(await aioconsole.ainput()).strip()
            g.usend(x,y)
        except KeyboardInterrupt:
            break
        except:
            print("ERROR!")
            continue

def localtest():
    #print("Please input your token:")
    #token=input().strip()
    token=os.getenv('hackergame_token').strip()
    g=Net(token,print)
    loop=asyncio.get_event_loop()
    loop.run_until_complete(asyncio.wait([localinput(g),g.U[0].run(),g.U[1].run()]))
    loop.close()



async def handle_echo(reader, writer):
    #writer.write("Please input your token:\n".encode())
    #await writer.drain()
    #token=await reader.read(4096)
    #token=token.decode().strip()
    token=os.getenv('hackergame_token').strip()
    def netwrite(data):
        assert writer.is_closing()==False
        writer.write(data.encode()+b"\n")
    async def netinput(g):
        while True:
            if g.U[0].end and g.U[1].end:
                break
            netwrite("0. Talk to Alice")
            netwrite("1. Talk to Bob")
            try:
                x=int((await reader.read(4096)).strip())
                assert x in [0,1]
                netwrite("Your message:")
                y=(await reader.read(4096)).strip()
                g.usend(x,y.decode())
            except:
                netwrite("ERROR!")
                continue
    g=Net(token,netwrite)
    await asyncio.gather(netinput(g),g.U[0].run(),g.U[1].run())
    print("Close the connection")
    writer.close()
    await writer.wait_closed()


async def net_main():
    server = await asyncio.start_server(
        handle_echo, '0.0.0.0', 1919)

    addr = server.sockets[0].getsockname()
    print(f'Serving on {addr}')

    async with server:
        await server.serve_forever()

asyncio.run(net_main())
#localtest()
#asyncio.run(handle_echo())