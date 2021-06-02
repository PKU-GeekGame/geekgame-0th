/**
 * 扫描二维码
 * @param {} json
 */
function logonQrcode(json) {	
   	$("#msg").text("正在登录中...");
	if(true == json.success){
		if(redirectURL.indexOf("?")>0){
			window.location.href = redirectURL+"&_rand="+Math.random()+"&token="+json.token;	                			
		}
		else{
			window.location.href = redirectURL+"?_rand="+Math.random()+"&token="+json.token;
		}
    }
    else{
    	if("E02"==json.errors.code){//"E13"
    		window.location.href = "https://iaaa.pku.edu.cn/iaaa/activateAccount.jsp?Rand="+Math.random()+"&activeCode="+json.activeCode;
    	}
    }
}
function checkQRBind(){
	$.ajax('/iaaa/oauthlogin4QRCode.do',{
		data:{
				//userName : '',
				appId : 'PKUApp',
				issuerAppId: 'iaaa',
				targetAppId : $("#appid").val(),
				//validCode : 
				redirectUrl : redirectURL
			},
		type:"POST",
		dataType:"json",
		success : function(data,status,xhr) {
			var json = data;
			if(false == json.success){////{"success":true}						
				if(""!=json.errors.msg){
					if("E10"==json.errors.code)
						$("#jumpBindCodeErrorMsg").text("");
        			else $("#jumpBindCodeErrorMsg").text(json.errors.msg);
        			
        			if("E02"==json.errors.code)
						window.location.href = "https://iaaa.pku.edu.cn/iaaa/activateAccount.jsp?Rand="+Math.random()+"&activeCode="+json.activeCode;
					
        			if("E06"==json.errors.code)//E11
        				$("#otpHelp2").show();
        			else $("#otpHelp2").hide();
        				
				}
				if("是"==json.isStop || "E99"==json.errors.code)//{"success":false,"errors":{"code":"E99","msg":"操作失败。"},"message":"操作失败。","rows":[]}
					stopCheck();
    		}else{ 
				stopCheck();
				logonQrcode(json);//下一页
    		}
		},
		failure : function(xhr,status,error) {
			$("#tip").text("服务器没有响应，请刷新后重试!");
		}
	});
}
var checkBindInterval = null;
function stopCheck(){
	clearInterval(checkBindInterval);
}
function startCheck(){
	checkBindInterval=setInterval(checkQRBind,3000);
}