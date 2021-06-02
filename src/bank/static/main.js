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

function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

var TOKEN = "";
var mydata = {};
var nowbank = 0;
var edata = []

function renderbank(nexbank = nowbank) {
    nowbank = nexbank;

    document.getElementById("brem").innerText = mydata.bank[nowbank][0];
    document.getElementById("blo").innerText = mydata.bank[nowbank][1];
    document.getElementById("bam").innerText = mydata.bank[nowbank][2];
    edata = [mydata.cash, mydata.bank[nowbank][0], Math.max(0,mydata.bank[nowbank][2] - mydata.bank[nowbank][1]), Math.min(mydata.cash, mydata.bank[nowbank][1])];
    $("#tobank-0").removeClass("active");
    $("#tobank-1").removeClass("active");
    $("#tobank-2").removeClass("active");
    $("#tobank-"+nowbank).addClass("active");
    for (let i = 0; i < 4; i++) {
        document.getElementById("amount-" + i).value = 0;
        document.getElementById("avail-" + i).innerText = edata[i];
        document.getElementById("scol-" + i).value = 0;
    }
}

function changeinput(id) {
    gamt = parseInt(document.getElementById("amount-" + id).value);
    if (isNaN(gamt)) gamt = 0;
    gamt = Math.max(Math.min(gamt, edata[id]), 0);
    document.getElementById("amount-" + id).value = gamt;
    if (edata[id] == 0)
        document.getElementById("scol-" + id).value = 0;
    else
        document.getElementById("scol-" + id).value = gamt / edata[id];
}

function changescoll(id) {
    gamt = parseFloat(document.getElementById("scol-" + id).value);
    if (isNaN(gamt)) gamt = 0;
    gamt = Math.max(Math.min(gamt, 1), 0);
    document.getElementById("scol-" + id).value = gamt;
    document.getElementById("amount-" + id).value = Math.floor(gamt * edata[id]);
}

function changemax(id) {
    gamt = 1;
    document.getElementById("scol-" + id).value = gamt;
    document.getElementById("amount-" + id).value = Math.floor(gamt * edata[id]);
}

function donotify(data)
{
    let dat=new Date();
    let gg=dateFormat("HH:MM:SS",dat)
    if(data.success)
    {
        toastr.success(data.message);
        document.getElementById("logger").innerHTML=document.getElementById("logger").innerHTML+gg+" 成功 "+data.message+"\n";
    }
    else
    {
        toastr.error(data.message);
        document.getElementById("logger").innerHTML=document.getElementById("logger").innerHTML+gg+" 失败 "+data.message+"\n";
    }
    document.getElementById("logger").scrollTop=document.getElementById("logger").scrollHeight;
}

function domet(id)
{
    methodl=["buy_flag","buy_bread","nextday"]
    $.post(
        "/do",
        { token: TOKEN, method: methodl[id]},
        function (data) {
            data = JSON.parse(data);
            donotify(data);
            getinfo();
        }
    );
}

function dosubmit(id) {
    methodl = ["deposit", "draw", "loan", "repay"]
    mdl = parseInt(document.getElementById("amount-" + id).value);
    $.post(
        "/do",
        { token: TOKEN, method: methodl[id] ,bank:nowbank,money:mdl},
        function (data) {
            data = JSON.parse(data);
            donotify(data);
            getinfo();
        }
    );
}

function getinfo() {
    $.post(
        "/do",
        { token: TOKEN, method: "getinfo" },
        function (data) {
            data = JSON.parse(data)
            if (!data.success) {
                alert("获取信息失败：" + data.message);
                return;
            }
            mydata = data.data;
            document.getElementById("dayid").innerText = "第 " + mydata.day + " 天";
            document.getElementById("assa").innerText = mydata.money;
            document.getElementById("cash").innerText = mydata.cash;
            document.getElementById("bread").innerText = mydata.bread;
            renderbank();
            for (let i = 0; i < 4; i++) {
                document.getElementById("amount-" + i).oninput = function () { changeinput(i) };
                document.getElementById("scol-" + i).oninput = function () { changescoll(i) };
                document.getElementById("setmax-" + i).onclick = function () { changemax(i) };
                document.getElementById("button-" + i).onclick = function () { dosubmit(i) };
            }
        }
    );
}

function doreset()
{
    $.post(
        "/do",
        { token: TOKEN, method: "reset"},
        function (data) {
            data = JSON.parse(data);
            document.getElementById("logger").innerHTML="";
            donotify(data);
            getinfo();
        }
    );
}

window.onload = function () {
    TOKEN = getPar("token");
    if (TOKEN == "") {
        alert("token异常，请从比赛平台进入页面");
        return
    }
    getinfo();
}