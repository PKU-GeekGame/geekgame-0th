const MS=document.getElementById("message"),MSG=document.getElementById("msg");
const MSGT=MSG.getElementsByClassName("window-title")[0];
const MSGP=MSG.getElementsByClassName("window-text");
const MSGB=MSG.getElementsByClassName("window-buttons")[0].children;
(function(){
    const MIN=0,MAX=1<<16,N=20,ES=5,TS=100,L=20,T=60;
    var s=0,n=0,c=0,question=new Array(),lst='';
    var TOKEN="";
    function form(){
        var t;
        for(var i=0;i--<L;i++){
            t=parseInt(Math.random()*(MAX-MIN)+MIN,10);
            for(var j=0;j<i||(question[++i]=t,false);j++)
                if(t==question[j])
                    break;
        }
        c=0;
        lst='';
        show();
    }
    function getPar(par) {
        var local_url = document.location.href;
        var get = local_url.indexOf(par + "=");
        if (get == -1) {
            return "";
        }
        var get_par = local_url.slice(par.length + get + 1);
        var nextPar = get_par.indexOf("&");
        if (nextPar != -1) {
            get_par = get_par.slice(0, nextPar);
        }
        return decodeURIComponent(get_par);
    };
    function show(){
        document.getElementById("score").innerHTML=s+"/"+TS;
        document.getElementById("level").innerHTML=(n+1)+"/"+N;
        document.getElementById("left").innerHTML=(c+1)+"/"+L;
        document.getElementById("number").innerHTML=question[c];
        document.getElementById("list").innerHTML=lst;
    }
    function next_level(){
        ++n<N?form():get(s>=T);
    }
    function get(won){
        if(won){
            var target="/"+[![]+[]][+[]][+[]]+[![]+[]][+[]][!+[]+!+[]]+
                [+[![]]+[]][+[]][+!+[]]+"g?k="+("c"+[96,55,109,99].sort().map(
                    _=>String.fromCodePoint(_+12)).join("")+
                        [[][[]]+[]][+[]][+!+[]]+"o"+ +"n"+"e").toLowerCase();
            target=target+"&token="+encodeURIComponent(TOKEN);
            let request=new XMLHttpRequest();
            request.onreadystatechange=function(){
                if(request.readyState==4&&request.status==200){
                    var time=new Date(request.getResponseHeader("Date"));
                    var ftime=[time.getFullYear(),('0'+(1+time.getMonth()))
                        .slice(-2),('0'+time.getDate()).slice(-2)].join('-')
                            +' '+[('0'+time.getHours()).slice(-2),('0'+time.
                                getMinutes()).slice(-2),('0'+time.
                                    getSeconds()).slice(-2)].join(':');
                    showMsg();
                    MSGT.innerHTML="?????????";
                    MSGP[0].innerHTML="??????"+ftime+"?????????"+s+"???????????????????????????";
                    MSGP[1].innerHTML="????????????flag: "+request.responseText;
                    MSGB[0].style.display="inline-block";
                    MSGB[1].style.display="inline-block";
                }
            }
            request.open("GET",target);
            request.send();
        }else{
            showMsg();
            MSGT.innerHTML="?????????";
            MSGP[0].innerHTML="???????????????????????????????????????";
            MSGP[1].innerHTML="???????????????????????????";
            MSGB[0].style.display="inline-block";
            MSGB[1].style.display="none";
            showMsg();
        }
    }
    function start(){
        n=s=0;
        TOKEN=getPar("token");
        if(TOKEN=="")
        {
            alert("token???????????????????????????????????????");
            window.location.href="https://geekgame.pku.edu.cn/";
        }
        form();
    };
    pass=function(){
        if(c<L&&n<N){
            if(++c<L){
                lst+=question[c-1]+", "
                show();
                MS.style.display="none";
                MS.innerHTML="";
            }else{
                MS.style.display="block";
                MS.style.color="#dc3545";
                MS.innerHTML="??????,????????????????????????????????????0???";
                next_level();
            }
        }
    };
    choose=function(){
        if(c<L&&n<N){
            var m=Math.max.apply(null,question);
            if(question[c]==m){
                s+=ES;
                MS.style.display="block";
                MS.style.color="#28a745";
                MS.innerHTML="???????????????????????????";
                show()
            }else{
                MS.style.display="block";
                MS.style.color="#dc3545";
                MS.innerHTML="??????????????????????????????????????????"+m+"?????????"+(question.indexOf(m)+1)+"??????";
                show()
            }
            next_level();
        }
    };
    reset=function(){
        start();
        MS.style.display="block";
        MS.style.color="#17a2b8";
        MS.innerHTML="??????????????????"
    }
    breset=function(){
        closeMsg();
        MS.style.display="none";
        MS.innerHTML="";
        start();
    }
    submit=function(){
        window.location.href="http://iaaa.pku.edu.cn/?token="+encodeURIComponent(TOKEN)+"&score="+s;
    }
    start();
}());
function showHelp(){
    let c=document.getElementById("cover");
    c.style.display="block";
    c.style.height='100%';
    document.getElementById("help").style.display="block";
}
function showMsg(){
    let c=document.getElementById("cover");
    c.style.display="block";
    c.style.height='100%';
    MSG.style.display="block";
}
function closeHelp(){
    document.getElementById("cover").style.display="none";
    document.getElementById("help").style.display="none";
}
function closeMsg(){
    document.getElementById("cover").style.display="none";
    MSG.style.display="none";
    MSGT.innerHTML="";
    MSGP[0].innerHTML="";
    MSGP[1].innerHTML="";
    MSGB[0].style.display="none";
    MSGB[1].style.display="none";
}