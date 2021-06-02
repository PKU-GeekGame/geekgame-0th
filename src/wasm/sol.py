import time

def toi32(x):
    x%=(2**32)
    if x>=2**31:
        return x-2**32
    return x

funcTable={
    "add":(2,(lambda a,b: a+b)),
    "sub":(2,(lambda a,b: a-b)),
    "mul":(2,(lambda a,b: a*b)),
    "rem_s":(2,(lambda a,b: a%b)),
    "and":(2,(lambda a,b: a&b)),
    "or":(2,(lambda a,b: a|b)),
    "eq":(2,(lambda a,b: int(a==b))),
    "ne":(2,(lambda a,b: int(a!=b))),
    "lt_s":(2,(lambda a,b: int(a<b))),
    "le_s":(2,(lambda a,b: int(a<=b))),
    "gt_s":(2,(lambda a,b: int(a>b))),
    "ge_s":(2,(lambda a,b: int(a>=b))),
    "shl":(2,(lambda a,b: int(a<<b))),
    "eqz":(1,(lambda a: int(a==0))),
}

class ASMRunner:
    CODE=[]
    MEMORY=[]
    LOCAL=[]
    GLOBAL=[]
    LABEL={}
    STACK=[]
    IF_TABLE={}
    def __init__(self):
        return
    def loadCode(self,codef):
        self.CODE=[]
        self.MEMORY=[]
        self.LOCAL=[]
        self.GLOBAL=[]
        self.LABEL={}
        self.STACK=[]
        self.IF_TABLE={}
        x=codef.split('\n')
        for a in x:
            self.CODE.append(a.strip())
        self.scanCode()
    def scanCode(self):
        ifs=[]
        for i in range(len(self.CODE)):
            nl=self.CODE[i]
            cdl=nl.split(' ')
            if cdl[0]=="loop":
                try:
                    gid=int(cdl[1][6:])
                    self.LABEL[gid]=i
                except:
                    raise Exception("unknow identifier at line %d:"%i)
            if cdl[0]=="if":
                ifs.append(i)
            if cdl[0]=="else":
                try:
                    itt=ifs[-1]
                    ifs.pop()
                    self.IF_TABLE[itt]=i
                except:
                    raise Exception("invalid if block at line %d:"%i)
                ifs.append(i)
            if cdl[0]=="end":
                if len(cdl)==2:
                    try:
                        gid=int(cdl[1][6:])
                        if not gid in self.LABEL:
                            self.LABEL[gid]=i
                    except:
                        raise Exception("unknow identifier at line %d:"%i)
                    continue
                try:
                    itt=ifs[-1]
                    ifs.pop()
                    self.IF_TABLE[itt]=i
                except:
                    raise Exception("invalid if block at line %d:"%i)
        for x in ifs:
            raise Exception("invalid if block at line %d:"%x)

    def getStack(self):
        if len(self.STACK)==0:
            raise Exception("stack error at line %d"%(self.pc+1))
            return 0
        x=self.STACK[-1]
        self.STACK.pop()
        return x

    def getMem(self,idt,pos):
        if idt==0:
            mem=self.LOCAL
        elif idt==1:
            mem=self.GLOBAL
        else:
            mem=self.MEMORY
        if len(mem)<=pos:
            ngl=pos-len(mem)+1
            mem.extend([0]*ngl)
        return mem[pos]
    
    def setMem(self,idt,pos,val):
        if idt==0:
            mem=self.LOCAL
        elif idt==1:
            mem=self.GLOBAL
        else:
            mem=self.MEMORY
        if len(mem)<=pos:
            ngl=pos-len(mem)+1
            mem.extend([0]*ngl)
        mem[pos]=val

    def run(self):
        self.pc=0
        while True:
            nl=self.CODE[self.pc]
            if len(nl)==0:
                self.pc+=1
                continue
            cdl=nl.split(' ')
            if cdl[0] in ["loop","block","end","else","call"]:
                self.pc+=1
                continue
            if cdl[0]=="return":
                return self.getStack()
            if cdl[0]=="br":
                try:
                    itt=int(cdl[1][6:])
                    self.pc=self.LABEL[itt]+1
                except:
                    raise Exception("unknow identifier at line %d:"%(self.pc+1))
                continue
            if cdl[0]=="if":
                ifv=self.getStack()
                if ifv==0:
                    self.pc=self.IF_TABLE[self.pc]+1
                else:
                    self.pc+=1
                continue
            pl=cdl[0].split('.')
            if len(pl)!=2:
                raise Exception("unknow identifier at line %d:"%(self.pc+1))
            if pl[0] not in ["local","global","i32"]:
                raise Exception("unknow identifier at line %d:"%(self.pc+1))
            if pl[0]=="local":
                if pl[1] not in ["set","get"]:
                    raise Exception("unknow identifier at line %d:"%(self.pc+1))
                try:
                    itt=int(cdl[1][4:])
                except:
                    raise Exception("unknow identifier at line %d:"%(self.pc+1))
                if pl[1]=="set":
                    va=self.getStack()
                    self.setMem(0,itt,va)
                else:
                    self.STACK.append(self.getMem(0,itt))
                self.pc+=1
                continue
            if pl[0]=="global":
                if pl[1] not in ["set","get"]:
                    raise Exception("unknow identifier at line %d:"%(self.pc+1))
                try:
                    itt=int(cdl[1][7:])
                except:
                    raise Exception("unknow identifier at line %d:"%(self.pc+1))
                if pl[1]=="set":
                    va=self.getStack()
                    self.setMem(1,itt,va)
                else:
                    self.STACK.append(self.getMem(1,itt))
                self.pc+=1
                continue
            if pl[1]=="load":
                pos=self.getStack()
                val=self.getMem(2,pos)
                self.STACK.append(val)
                self.pc+=1
                continue
            if pl[1]=="store":
                va=self.getStack()
                pos=self.getStack()
                self.setMem(2,pos,va)
                self.pc+=1
                continue
            if pl[1]=="const":
                try:
                    itt=int(cdl[1])
                except:
                    raise Exception("unknow identifier at line %d:"%(self.pc+1))
                self.STACK.append(itt)
                self.pc+=1
                continue
            if not pl[1] in funcTable:
                raise Exception("unknow identifier at line %d:"%(self.pc+1))
            cb=self.getStack()
            if funcTable[pl[1]][0]==1:
                self.STACK.append(toi32(funcTable[pl[1]][1](cb)))
                self.pc+=1
                continue
            ca=self.getStack()
            self.STACK.append(toi32(funcTable[pl[1]][1](ca,cb)))
            self.pc+=1
        return 0

class Problem:
    def __init__(self):
        f=open("asm.txt")
        code=f.read()
        f.close()
        self.runner=ASMRunner()
        self.runner.loadCode(code)
        self.runner.setMem(1,18,4982)
        self.runner.setMem(1,19,5400)
        self.runner.setMem(1,20,4986)
        self.runner.setMem(1,21,5000)
        key='.q~03QKLNSp"s6AQtEW<=MNv9(ZMYntg2N9hSe5=k'
        self.putBytes(5400,key.encode())
        self.runner.setMem(2,4986,len(key))
        return
    def putBytes(self,pos,bts):
        for i in range(len(bts)):
            self.runner.setMem(2,pos+4*i,bts[i])
    def run(self,inv):
        length=len(inv)
        self.runner.setMem(2,4982,length)
        #bts=inv.encode()
        bts=inv
        self.putBytes(5000,bts)
        result=self.runner.run()
        if result==-1:
            return -1
        elif result==0:
            return 0
        else:
            return 1



#flag='flag{W4SM_1S_s0_fun_but_1t5_subs3t_isN0T}'
flag=[32]*41
for i in range(41):
    bg=Problem()
    bg.run(bytes(flag))
    ost=bg.runner.MEMORY[1552:1552+42*4]*1
    dst=bg.runner.MEMORY[5400:5400+42*4]*1
    for j in range(32,128):
        flag[i]=j
        ng=Problem()
        ng.run(bytes(flag))
        nst=ng.runner.MEMORY[1552:1552+42*4]*1
        mak=False
        for k in range(41):
            if nst[k*4]!=ost[k*4]:
                mak=(nst[k*4]==dst[k*4])
                break
        if mak:
            break
    print(bytes(flag))
