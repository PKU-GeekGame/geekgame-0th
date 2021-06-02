import pathlib
import time
from threading import Lock

p = pathlib.Path('limit')
p.mkdir(exist_ok=True)

lock = Lock()

def checklimit(uid):
    pp = p/(uid+'.txt')
    with lock:
        if not pp.exists():
            return True
        
        with pp.open() as f:
            try:
                t = float(f.read())
                return time.time() > t
            except Exception:
                return True
    
def setlimit(uid, limtime):
    pp = p/(uid+'.txt')
    with lock:
        with pp.open('w') as f:
            f.write(str(time.time() + limtime))