import hashlib


flag = "flag{a_good_merchant_knows_how_to_make_money_TOKEN}"


def set_token(token):
    global flag
    msg = token.encode('latin-1') + b"\"3ef587a1293bc7b"
    msg = hashlib.md5(msg).hexdigest()
    flag = flag.replace("TOKEN", msg)


# https://darkestdungeon.fandom.com/wiki/Items

def comms():
    global flag
    return {
            "citrine": {
                "desc": "Yellow like fading hope.",
                "price": 250
                },
            "jade": {
                "desc": "Dull green like rotting flesh.",
                "price": 375
                },
            "onyx": {
                "desc": "Black like endless night.",
                "price": 500
                },
            "emerald": {
                "desc": "Green like molten envy.",
                "price": 750
                },
            "sapphire": {
                "desc": "Blue like strangled dreams.",
                "price": 1000
                },
            "ruby": {
                "desc": "Red like blazing lust.",
                "price": 1250
                },
            "egg": {
                "desc": "Colorful like boring author.",
                "price": 2000
                },
            "flag": {
                "desc": "Spotless flag, showing a strange sentence: %s." % flag,
                "price": 100000
                }
            }
