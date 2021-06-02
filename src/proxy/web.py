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

import jwt


import logging
log=logging.getLogger("iaaa")
log.setLevel(logging.WARNING)


app = Flask("iaaa",static_url_path='/resources')

@app.route('/',methods=["GET"])
def index():
    token=request.args.get("token")
    if token==None:
        flag1="token异常，请从比赛平台直接进入"
    else:
        flag1="flag{U5e_Pr0xY_1s_E4zY_%s}"%(md5(("EaZYYYYY!!Pr0Xy~"+token).encode()).hexdigest()[:8])
    response = make_response(render_template('index.html',userflag1=flag1))
    encoded_jwt = jwt.encode({"isadmin": "false"}, "", algorithm="HS256")
    response.set_cookie("jwt-auth",encoded_jwt,max_age=3600*24)
    return response

@app.route('/favicon.ico')
def favicon():
    return send_from_directory('static/','favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/iaaa/oauthlogin.do',methods=["POST"])
def dologin():
    try:
        encoded_jwt = jwt.encode({"identity": "student"}, "", algorithm="HS256")
        obj={"success":True,"token":encoded_jwt}
        #obj["errors"]["msg"]="您的flag: "+"flag{D4nG3r0u5_pRoXy_4Nd_s1MpLe_jvvT_%s}"%(md5(("EZPr0XyPr0blem~~_!"+request.form["token"]).encode()).hexdigest()[:8])
        
        return json.dumps(obj)
    except:
        obj={"success":False,"errors":{"code":"E01","msg":"系统错误"}}
        return json.dumps(obj)

@app.route('/iaaa/servlet/DrawServlet')
def dosendcap():
    return send_from_directory('static/images/','pku_logo_red.png', mimetype='image/png')


app.run(host="0.0.0.0",port=80,debug=False,threaded=True)#!!!!!!!
