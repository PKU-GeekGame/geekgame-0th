from flask import *
from flask_session import Session
import random
import pickle
import time
from flag import getflag, checktoken
from ratelimit import checklimit, setlimit

MIN_INTERVAL_S = 1
TOT_SUCC_CNT = 20

#with open('emojis.txt', encoding='utf-8') as f:
#    emojis = list(set(f.read().splitlines()))
#random.seed(114514666)
#random.shuffle(emojis)
#emojis = emojis[::5]

#with open('emojis.pickle', 'wb') as f:
#    pickle.dump(emojis, f)

with open('emojis.pickle', 'rb') as f:
    emojis = pickle.load(f)

print('got', len(emojis), 'emojis')

emojis_rank = {emoji:ind for ind,emoji in enumerate(emojis)}

app = Flask(__name__)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_FILE_THRESHOLD'] = 262144
Session(app)

def gen_question():
    k = random.randrange(1, 5)
    if k==1:
        k = 2
    qs = random.sample(emojis, k)
    session['question'] = qs

@app.route('/token', methods=['GET', 'POST'])
def token():
    if request.method=='POST':
        token = request.form['token'].strip()
        if not checktoken(token):
            flash('Token无效')
            return render_template('token.html')
        
        session['token'] = token
        return redirect('/')
    else:
        return render_template('token.html')

@app.route('/', methods=['GET', 'POST'])
def index():
    if 'token' not in session:
        return redirect('/token')

    token = session['token']
    uid = checktoken(token)
    if not uid:
        flash('Token无效')
        return redirect('/token')
    
    if 'count' not in session:
        session['count'] = 0
    
    if session['count']>=TOT_SUCC_CNT:
        return '<h1>Your flag: '+getflag(token)+'</h1>'
    
    if 'question' not in session:
        gen_question()
        setlimit(uid, MIN_INTERVAL_S)
    
    if request.method=='POST':
        if not checklimit(uid):
            flash('提交过快，'+str(MIN_INTERVAL_S)+'秒内只能提交一次')
        else:
            choice = request.form.get('choice', None)
            if choice not in session['question']:
                flash('选项无效')
            
            else:
                correct = max(emojis_rank[e] for e in session['question'])
                
                if emojis_rank[choice]==correct:
                    session['count'] += 1
                    
                    if session['count']>=TOT_SUCC_CNT:
                        return '<h1>Your flag: '+getflag(token)+'</h1>'
                    
                    flash('回答正确，加油哦~')
                else:
                    session['count'] = 0
                    flash('回答错误，THIS IS BAD')
                    
                gen_question()
                setlimit(uid, MIN_INTERVAL_S)
          
    return render_template('index.html', qs=session['question'], succ=TOT_SUCC_CNT)
    
app.run('0.0.0.0', 5000)