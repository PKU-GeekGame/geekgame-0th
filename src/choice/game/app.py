from flask import *
import time
from flag import checktoken, getflag
import db
import json
import re

MAX_ANSWER_LEN = 32

def MIN_INTERVAL_S_AFTER(submitted_count):
    return 3600 * (2 ** (submitted_count-1))

def flags_based_on_correct_count(token, count):
    flags = []
    if count>=5:
        flags.append(getflag(token, 0))
    if count>=8:
        flags.append(getflag(token, 1))
    return flags

with open('db/problemset.json', encoding='utf-8') as f:
    _problemset = json.load(f)
    for p in _problemset:
        for ans in p['answer']:
            assert re.match(p['answer_validator'], ans)

    problemset = [{**p, 'answer': 'you guess'} for p in _problemset]
    answers = {p['id']: p['answer'] for p in _problemset}

print('got', len(problemset), 'questions')

app = Flask(__name__)
app.secret_key = 'gy29rkl8xzgdjs0fz45p4c1'

@app.template_filter(name='time')
def filter_time(s):
    return time.ctime(s)

@app.route('/token', methods=['GET', 'POST'])
def token():
    if request.method=='POST':
        req_token = request.form['token'].strip()
        if checktoken(req_token):
            session['token'] = req_token
            return redirect('/')
        else:
            flash('Token无效')
    
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

    history_raw = db.query_history(uid)
    if history_raw:
        next_submit_ts = history_raw[-1][0] + MIN_INTERVAL_S_AFTER(len(history_raw))
        remaining_waiting_s = int(next_submit_ts - time.time())
        if remaining_waiting_s<0:
            remaining_waiting_s = None
    else:
        remaining_waiting_s = None

    if request.method=='POST':
        if remaining_waiting_s:
            flash('还需要冷却 %d 秒才能再次提交'%remaining_waiting_s)
        else:
            submission = {
                pid: request.form.get(pid, '')
                for pid in answers.keys()
            }
            for v in submission.values():
                if len(v)>MAX_ANSWER_LEN:
                    flash('答案太长了哟')
                    return redirect('/')
            
            db.push_history(uid, submission)
            flash('提交成功')

        return redirect('/')

    history = [{
        'time_ts': time_ts,
        'questions': [{
            'pid': pid,
            'answer': ans,
            'correct': ans in answers[pid],
        } for pid, ans in submission.items()],
    } for time_ts, submission in history_raw]

    correct_count = max([0] + [
        sum([int(x['correct']) for x in submission['questions']])
        for submission in history
    ])
    flags = flags_based_on_correct_count(token, correct_count)

    return render_template(
        'index.html',
        problemset=problemset,
        history=history,
        remaining_waiting_s=remaining_waiting_s,
        correct_count=correct_count,
        flags=flags,
        max_length=MAX_ANSWER_LEN,
    )
    
app.run('0.0.0.0', 5000)