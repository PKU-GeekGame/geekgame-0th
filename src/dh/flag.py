from hashlib import md5

A_cert="416c696365_7d2e831fc7c37b4932604c66de52a3c7f631eee0badffb42f40899fb88ff19e41518fc8326f620aaeb54cecd8bd22a5fa8576848c131370c0fcb8fb0e093fbd0d76b73c47c04ffe2b913472595c9987d53b8cdffa4ff16f6a6176f215e6ded63e65089d763691a4cef91284e6934b95580e64854304b99e87215b582e201222d"
B_cert="426f62_2453e551e17519b6dcfdae46f75b9d92dd943fcb5d2c71911adb83f43753dfba86be013dfb8c2413cbc70eac852e312040d3fbf471b57da2ae7a7aa95d39f3b972e34214f5cc69093d9929b2c5fc24684b0d5443dcb8338d1f52bb34f9913bd1e98c29302bbbd3cb532001adde7f06d93badcdee7b12b1b550a816537e950bad"

def flag1(token):
    return "flag{th3_Tr1V14l_1s_N0t_trIviAL_%s}"%(md5(("PramR*ange!mportant"+token).encode()).hexdigest()[:8])

def flag2(token):
    return "flag{Wh4t_A_w3Ak_Pr0toCo1_%s}"%(md5(("DHIs-N0Ts4Fe!"+token).encode()).hexdigest()[:8])