#pip install pyJWT
import jwt

import os
import json
import math
import time
from datetime import timedelta
import re
from shutil import copyfile
from flask import Flask,request,render_template,url_for,send_from_directory,make_response,Response
from flask import jsonify
from hashlib import md5
import queue

from hashlib import md5


import logging
log=logging.getLogger("iaaa")
log.setLevel(logging.WARNING)


app = Flask("iaaa",static_url_path='/resources')

@app.route('/',methods=["GET"])
def index():
    return send_from_directory('maximum/','maximum.html', mimetype='text/html')

@app.route('/maximum.js',methods=["GET"])
def jsf():
    return send_from_directory('maximum/','maximum.js', mimetype='application/x-javascript')

@app.route('/maximum.css',methods=["GET"])
def cssf():
    return send_from_directory('maximum/','maximum.css', mimetype='text/css')

@app.route('/flag',methods=["GET"])
def getflag():
    if not 'token' in request.args:
        return 'need token'
    if 'k' in request.args and request.args['k']=='cyclononane':
        return 'flag{Al1ow_prEviEw1n9_Fl4G_%s}'%md5(('114514ASDFhijkm1919810'+request.args['token']).encode()).hexdigest()[:8]
    return 'None'

@app.route('/callback',methods=["GET"])
def docallback():
    if not 'jwt' in request.args:
        return Response('need jwt token',mimetype='text/plain')
    if not 'token' in request.args:
        return Response('need token',mimetype='text/plain')
    try:
        jwtg=request.args['jwt']
        resu=jwt.decode(jwtg,"",algorithms=["HS256"])
        if resu['identity']=='teacher':
            return Response('感谢你完成实验。这是我们额外赠送给你的flag： %s'%("flag{D4nG3r0u5_pRoXy_4Nd_s1MpLe_jvvT_%s}"%(md5(("EZPr0XyPr0blem~~_!"+request.args["token"]).encode()).hexdigest()[:8])),mimetype='text/plain')
        else:
            return Response('感谢你完成实验。由于你的身份是%s，我们无法赠送你一个flag。只有teacher可以领取flag。'%(resu['identity']),mimetype='text/plain')
    except:
        return Response('Error',mimetype='text/plain')
    return Response('None',mimetype='text/plain')

app.run(host="0.0.0.0",port=81,debug=False,threaded=True)#!!!!!!!
