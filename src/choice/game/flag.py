import hashlib
import OpenSSL
import base64

FLAGS = ['you-are-master-of-searching', 'you-are-phd-of-searching', 'you-are-professor-of-searching']
SECRET = ['pkuggg::9an9agm1', 'pkuggg::nfmr8rp0', 'pkuggg::dku1aedj']

with open('cert.pem', 'rb') as f:
    cert = OpenSSL.crypto.load_certificate(OpenSSL.crypto.FILETYPE_PEM, f.read())

def getflag(token, idx):
    serial = hashlib.sha256((SECRET[idx]+token).encode()).hexdigest()[:8]
    return 'flag{%s_%s}'%(FLAGS[idx], serial)

def checktoken(token):
    try:
        id, sig = token.split(':', 1)
        sig = base64.b64decode(sig, validate=True)
        OpenSSL.crypto.verify(cert, sig, id.encode(), 'sha256')
        return id
    except Exception:
        return None