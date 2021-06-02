#pip install pyJWT

import os
import json
import math
import time
from datetime import timedelta
import re
from shutil import copyfile
from flask import Flask,request,render_template,url_for,send_from_directory,make_response
from flask import jsonify
from hashlib import md5
import queue


import logging
log=logging.getLogger("bank")
log.setLevel(logging.WARNING)
app = Flask("bank")

def toint32(x):
    x%=(2**32)
    if x>=2**31:
        x-=2**32
    return x

class User:
    def __init__(self,token):
        self.bread=0
        self.cash=500
        self.allmoney=500
        self.day=1
        self.bank=[[0,0,0],[0,0,0],[0,0,0]]
        self.token=token
    def getinfo(self):
        return {"bread":self.bread,"day":self.day,"cash":self.cash,"money":self.allmoney,"bank":self.bank}
    def update(self):
        self.allmoney=self.cash
        for x in self.bank:
            self.allmoney+=x[0]-x[1]
        self.allmoney=toint32(self.allmoney)
    def deposit(self,bkid,money):
        money=toint32(money)
        if bkid<0 or bkid>=3:
            return (False,"银行不存在")
        if money>self.cash:
            return (False,"现金不足")
        if money<=0:
            return (False,"非法金额")
        self.cash-=money
        self.cash=toint32(self.cash)
        self.bank[bkid][0]+=money
        self.bank[bkid][0]=toint32(self.bank[bkid][0])
        self.bank[bkid][2]=min(max(self.bank[bkid][2],(self.bank[bkid][0]-self.bank[bkid][1])*10),2000000000)
        self.update()
        return (True,"存钱成功")
    def draw(self,bkid,money):
        money=toint32(money)
        if bkid<0 or bkid>=3:
            return (False,"银行不存在")
        if money>self.bank[bkid][0]:
            return (False,"余额不足")
        if money<=0:
            return (False,"非法金额")
        self.cash+=money
        self.cash=toint32(self.cash)
        self.bank[bkid][0]-=money
        self.bank[bkid][0]=toint32(self.bank[bkid][0])
        self.bank[bkid][2]=min(max(self.bank[bkid][2],(self.bank[bkid][0]-self.bank[bkid][1])*10),2000000000)
        self.update()
        return (True,"取钱成功")
    def loan(self,bkid,money):
        money=toint32(money)
        if bkid<0 or bkid>=3:
            return (False,"银行不存在")
        if money<=0:
            return (False,"非法金额")
        if money>toint32(self.bank[bkid][2]-self.bank[bkid][1]):
            return (False,"超出可用额度")
        self.cash+=money
        self.cash=toint32(self.cash)
        self.bank[bkid][1]+=money
        self.bank[bkid][1]=toint32(self.bank[bkid][1])
        self.bank[bkid][2]=min(max(self.bank[bkid][2],(self.bank[bkid][0]-self.bank[bkid][1])*10),2000000000)
        self.update()
        return (True,"借款成功")
    def repay(self,bkid,money):
        money=toint32(money)
        if bkid<0 or bkid>=3:
            return (False,"银行不存在")
        if money>self.cash:
            return (False,"现金不足")
        if money<=0 or money>self.bank[bkid][1]:
            return (False,"非法金额")
        self.cash-=money
        self.cash=toint32(self.cash)
        self.bank[bkid][1]-=money
        self.bank[bkid][1]=toint32(self.bank[bkid][1])
        self.bank[bkid][2]=min(max(self.bank[bkid][2],(self.bank[bkid][0]-self.bank[bkid][1])*10),2000000000)
        self.update()
        return (True,"还款成功")
    def buy_bread(self):
        if self.cash<10:
            return (False,"现金不足")
        self.cash-=10
        self.cash=toint32(self.cash)
        self.bread+=1
        self.bread=toint32(self.bread)
        self.update()
        return (True,"已购买1面包")
    def buy_flag(self):
        for x in self.bank:
            if x[1]!=0:
                return (False,"欠这么多钱还想买flag?")
        if self.cash<999888777:
            return (False,"这么穷还想买flag?")
        self.cash-=999888777
        self.cash=toint32(self.cash)
        self.update()
        return (True,"flag: flag{SucH_Na!V3_b4Nk_%s}"%(md5(("EZyB4Nk_NN00_!!"+self.token).encode()).hexdigest()[:8]))
    def nextday(self):
        if self.bread<1:
            return (False,"没有面包充饥")
        self.bread-=1
        self.bread=toint32(self.bread)
        self.day+=1
        for x in self.bank:
            x[0]=x[0]+x[0]//50
            x[0]=toint32(x[0])
            x[1]=x[1]+x[1]//20
            x[1]=toint32(x[1])
            x[2]=min(max(x[2],(x[0]-x[1])*10),2000000000)
        self.update()
        return (True,"你醒了？你已经睡了整整一晚了！")

userlist={}

@app.route('/',methods=["GET"])
def index():
    response = make_response(render_template('index.html'))
    return response

@app.route('/do',methods=["POST"])
def dologin():
    try:
        global userlist
        token=request.form["token"]
        obj={"success":False,"message":"方法未定义"}
        if token=="":
            obj['message']="token异常，请从比赛平台进入页面"
            return json.dumps(obj)
        method=request.form["method"]
        if not token in userlist:
            userlist[token]=User(token)
        ob=userlist[token]
        if method=='getinfo':
            obj["success"]=True
            obj["message"]="获取成功"
            obj["data"]=ob.getinfo()
        elif method=="reset":
            obj["success"]=True
            obj["message"]="已重开"
            userlist[token]=User(token)
        elif method in ['deposit','draw','loan','repay']:
            bkid=int(request.form["bank"])
            money=int(request.form["money"])
            rts,trm=getattr(ob,method)(bkid,money)
            obj["success"]=rts
            obj["message"]=trm
        elif method in ['buy_bread','buy_flag','nextday']:
            rts,trm=getattr(ob,method)()
            obj["success"]=rts
            obj["message"]=trm
        
        return json.dumps(obj)
    except:
        obj={"success":False,"message":"系统错误"}
        return json.dumps(obj)


app.run(host="0.0.0.0",port=80,debug=False,threaded=True)#!!!!!!!
