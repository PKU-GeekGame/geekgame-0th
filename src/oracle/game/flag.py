import hashlib

FLAGS = ['cbc-is-insecure', 'ecb-is-even-more-insecure']
SECRETS = ['pkuggg::somzak28', 'pkuggg::17e86dlj']

def getflag(token, ind):
    serial = hashlib.sha256((SECRETS[ind]+token).encode()).hexdigest()[:8]
    return 'flag{%s_%s}'%(FLAGS[ind], serial)