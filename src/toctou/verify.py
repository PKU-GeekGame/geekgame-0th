import OpenSSL
import base64
import os


CERT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cert.pem")

with open(CERT_FILE) as f:
    cert = OpenSSL.crypto.load_certificate(OpenSSL.crypto.FILETYPE_PEM, f.read())


def validate(token):
    try:
        id, sig = token.split(":", 1)
        sig = base64.b64decode(sig, validate=True)
        OpenSSL.crypto.verify(cert, sig, id.encode(), "sha256")
        return id
    except Exception:
        return None
