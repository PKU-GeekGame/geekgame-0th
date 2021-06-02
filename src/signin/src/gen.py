import urllib.parse
import base64

def rot13(s):
    def rotchar(c):
        for basechar in ['a', 'A']:
            base = ord(basechar)
            idx = ord(c)-base
            if 0<=idx<26:
                return chr(base + (idx+13)%26)
        return c
            
    return ''.join([rotchar(c) for c in s])
    
s = 'flag{W3lcome to 0th PKU GuGuGu, enjoy the game!}'
s = rot13(s)
#s = urllib.parse.quote(s)
s = base64.b64encode(s.encode()).decode()

print(s)
with open('quiz.txt', 'w') as f:
    f.write(s)