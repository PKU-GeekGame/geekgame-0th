import hashlib
import OpenSSL
import base64

FLAG = 'y0uAr3_S00_K1raK1ra'
SECRET = 'pkuggg::vsylaesl'

with open('cert.pem', 'rb') as f:
    cert = OpenSSL.crypto.load_certificate(OpenSSL.crypto.FILETYPE_PEM, f.read())

def getflag(token):
    serial = hashlib.sha256((SECRET+token).encode()).hexdigest()[:8]
    return 'flag{%s_%s}'%(FLAG, serial)
    
def checktoken(token):
    try:
        id, sig = token.split(':', 1)
        sig = base64.b64decode(sig, validate=True)
        OpenSSL.crypto.verify(cert, sig, id.encode(), 'sha256')
        return id
    except Exception:
        return None