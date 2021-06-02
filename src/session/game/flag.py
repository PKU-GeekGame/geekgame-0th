import hashlib

FLAG = 'F1a5k_debugging_mode_1S_1Ns3cure'
SECRET = 'pkuggg::7hhmv5il'











def getflag(token):
    serial = hashlib.sha256((SECRET+token).encode()).hexdigest()[:8]
    return 'flag{%s_%s}'%(FLAG, serial)