from flask import *
import random
import time
import base64
import pickle
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes
from flag import getflag

app = Flask(__name__)

from secret import AES_KEY, AES_KEY_2

def myencode(d):
    s = []
    for k, v in d.items():
        s.append('%s=%s'%(k,v))
    return '|'.join(s)

def mydecode(s):
    d = {}
    for pair in s.split('|'):
        k, _, v = pair.partition('=')
        d[k] = v
    return d

def gen_token():
    ALPHABET='qwertyuiopasdfghjklzxcvbnm1234567890'
    LENGTH=16
    return ''.join([random.choice(ALPHABET) for _ in range(LENGTH)])

@app.template_filter('mosaic')
def mosaic_filter(s):
    #return s
    if len(s)<=6:
        return '*'*len(s)
    else:
        return s[:4] + '*'*(len(s)-4)

@app.route('/')
def index():
    return render_template('index.html')
    
@app.route('/<mode>/gen-ticket')
def gen_ticket(mode):
    if mode not in ['cbc', 'ecb']:
        return 'Error: 不支持的模式'
    
    name = request.args['name']
    stuid = request.args['stuid']
    
    #print(name, len(name))
    if not 0<len(name)<=19:
        return 'Error: 姓名长度不正确'
    if not (len(stuid)==10 and stuid.isdigit()):
        return 'Error: 学号格式不正确'
    if 'flag' in request.args:
        return 'Error: 为支持环保事业，暂时无法选择需要礼品'
        
    data = myencode({
        'stuid': stuid,
        'name': name,
        'flag': False,
        'code': gen_token(),
        'timestamp': int(time.time()),
    }).encode()
    
    if mode=='cbc':
        cipher = AES.new(AES_KEY, AES.MODE_CBC)
        ct_bytes = cipher.encrypt(pad(data, AES.block_size))
        iv = cipher.iv
        enc_out = base64.b64encode(iv+ct_bytes).decode()
    else:
        cipher = AES.new(AES_KEY_2, AES.MODE_ECB)
        ct_bytes = cipher.encrypt(pad(data, AES.block_size))
        enc_out = base64.b64encode(ct_bytes).decode()
    
    return '<p>已为您生成购票凭证：</p><br><p>'+enc_out+'</p><br><p><a href="/">返回</a></p>'
    
@app.route('/<mode>/query-ticket')
def query_ticket(mode):
    if mode not in ['cbc', 'ecb']:
        return 'Error: 不支持的模式'
    ticket_b64 = request.args['ticket'].strip()
    
    try:
        ticket = base64.b64decode(ticket_b64)
        if mode=='cbc':
            iv = ticket[:16]
            ct_bytes = ticket[16:]
            cipher = AES.new(AES_KEY, AES.MODE_CBC, iv)
        else:
            ct_bytes = ticket
            cipher = AES.new(AES_KEY_2, AES.MODE_ECB)
        plaintext = unpad(cipher.decrypt(ct_bytes), AES.block_size)
    except:
        return 'Error: 解密购票凭证失败'
    
    try:
        data = mydecode(plaintext.decode('utf-8', 'ignore'))
        print(plaintext)
    except:
        print(plaintext)
        print(plaintext.decode('utf-8', 'ignore'))
        raise
        return 'Error: 信息解码失败'
    
    return render_template('query.html', ticket=data)
    
@app.route('/<mode>/getflag')
def flag(mode):
    if mode not in ['cbc', 'ecb']:
        return 'Error: 不支持的模式'
    ticket_b64 = request.args['ticket'].strip()
    code = request.args['redeem_code']
    token = request.args['token']
    
    try:
        ticket = base64.b64decode(ticket_b64)
        if mode=='cbc':
            iv = ticket[:16]
            ct_bytes = ticket[16:]
            cipher = AES.new(AES_KEY, AES.MODE_CBC, iv)
        else:
            ct_bytes = ticket
            cipher = AES.new(AES_KEY_2, AES.MODE_ECB)
        plaintext = unpad(cipher.decrypt(ct_bytes), AES.block_size)
    except:
        return 'Error: 解密购票凭证失败'
    
    try:
        data = mydecode(plaintext.decode('utf-8', 'ignore'))
    except:
        return 'Error: 信息解码失败'
        
    if data['flag']!='True':
        return 'Error: 您未选择需要礼品'
        
    if code!=data['code']:
        return 'Error: 兑换码错误'
    
    if mode=='cbc':
        return '<p>兑换成功，这是你的礼品：</p><br><p>'+getflag(token, 0)+'</p>'
    else:
        return '<p>兑换成功，这是你的礼品：</p><br><p>'+getflag(token, 1)+'</p>'

if __name__=='__main__':
    #app.run('0.0.0.0', 5000)
    app.run('127.0.0.1', 5000)