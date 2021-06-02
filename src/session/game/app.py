from flask import *
from flag import getflag

app = Flask(__name__)
app.secret_key = 'oh you got it, one more step to get flag'

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.is_json:
        action = request.json.get('action', '').strip()
        flag = getflag(request.json.get('token', '').strip())
        
        if action=='login':
            if request.json.get('flag', '').strip()==flag:
                session['admin'] = True
                return '已登录'
            else:
                return 'flag错误'
        
        elif action=='logout':
            session['admin'] = False
            return '已注销'
        
        elif action=='getflag':
            if 'admin' in session and session['admin']:
                return 'Here is your flag: '+flag
            else:
                return '请登录后查看flag'
        
        else:
            return '操作无效'
        
    else:
        return render_template('index.html')
    
@app.route('/src')
def src():
    with open(__file__, encoding='utf-8') as f:
        src = f.read()
        src = src.replace(repr(app.secret_key), '***')
    
    resp = Response(src)
    resp.headers['content-type'] = 'text/plain; charset=utf-8'
    return resp

app.run('0.0.0.0', 5000, True)