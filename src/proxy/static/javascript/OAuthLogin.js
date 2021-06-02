/* 让FF 7 支持outerHTML*/
	try{
		if (typeof(HTMLElement) != "undefined") {
		   HTMLElement.prototype.__defineSetter__("outerHTML", function(s) {
		        var r = this.ownerDocument.createRange();
		        r.setStartBefore(this);
		        var df = r.createContextualFragment(s);
		        this.parentNode.replaceChild(df, this);
		        return s;
		    });
		   HTMLElement.prototype.__defineGetter__("outerHTML", function(){
		        var a = this.attributes, str = "<" + this.tagName, i = 0;
		        for (; i < a.length; i++)
		            if (a[i].specified)
		                str += " " + a[i].name + '="' + a[i].value + '"';
		        if (!this.canHaveChildren)
		            return str + " />";
		        return str + ">" + this.innerHTML + "</" + this.tagName + ">";
		    });
		
		    HTMLElement.prototype.__defineGetter__("canHaveChildren", function(){
		        return !/^(area|base|basefont|col|frame|hr|img|br|input|isindex|link|meta|param)$/.test(this.tagName.toLowerCase());
		    });
		}
	}catch(e){
	}
document.onkeydown = function(e){
   if(!e) e = window.event;//火狐中是 window.event
   if((e.keyCode || e.which) == 13){
    if(e.target.id=="user_name"){
    	e.preventDefault();
    	//enterPassword(e);/*默认回车就是进入下一个元素*/
    }
    else if(e.target.id=="password"){
    	if($("#sms_area:visible").length>0 || $("#otp_area:visible").length>0 || $("#code_area:visible").length>0){
	    	e.preventDefault();
	    	/*if($("#otp_button:visible").length>0){
				enterCode2Bind(e);
			}
			else
	    		enterSMSCode(e);*/
    	}
    }
    else if(e.target.id=="sms_code" || e.target.id=="otp_code" ){
    	if($("#code_area:visible").length>0){
	    	e.preventDefault();
	    	//enterCode(e);
    	}
    }
   }
}

function getUrlVars(paramName)
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars[paramName];
}
function logon () {
   if($("#user_name").val()=="" /* || $("#user_name").val()=="学号/职工号/北大邮箱/手机号"*/) { 
     	//$("#msg").text("账号不能为空");
 		$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 账号不能为空");
     	$("#user_name").focus();
   }else if($("#password").val()==""/* ||$("#password").val()=="密码"*/) { 
     	//$("#msg").text("密码不能为空");
		$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 密码不能为空");
     	$("#password").focus();
   }
   else if($("#otp_area:visible").length>0 && 
   	($("#otp_code").val()=="" /* ||	$("#otp_code").val()=="手机令牌"*/)) { 
     	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 手机令牌不能为空");
     	$("#otp_code").focus();
   }
   else if($("#sms_area:visible").length>0 && 
   	($("#sms_code").val()=="" /* ||	$("#sms_code").val()=="短信验证码"*/)) { 
     	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 短信验证码不能为空");
     	$("#sms_code").focus();
   }
   else if($("#code_area:visible").length>0 && 
   	($("#valid_code").val()==""/*  ||	$("#valid_code").val()=="验证码"*/)) { 
     	//$("#msg").text("验证码不能为空");
     	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 验证码不能为空");
     	$("#valid_code").focus();
   }
   else { //document.myForm.submit();
   		if($("#remember_check")[0].checked==true){
   			setCookie("userName",$("#user_name").val());
   			setCookie("remember","true");
   		}
   		else{
   			delCookie("userName");
   			delCookie("remember");
   		}
   		$("#msg").text("正在登录...");
   		$.ajax(	'/iaaa/login.do',
			{
				type:"POST",
				data:{
					userName: $("#user_name").val(),
					password: $("#password").val(),
					randCode: $("#valid_code").val(),
					smsCode:$("#sms_code").val(),
					otpCode:$("#otp_code").val()
				},
				dataType:"json",
				success : function(data,status,xhr) {
					var json = data;
                	if(true == json.success)
                    	window.location.href = "./index.jsp";
                    else{
                    	//$("#msg").text(json.errors.msg);
                    	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.errors.msg);
                    	$("#code_img")[0].src="/iaaa/servlet/DrawServlet?Rand="+Math.random();
                    	if("账号未激活"==json.errors.msg){
                    		window.location.href = "https://iaaa.pku.edu.cn/iaaa/activateAccount.jsp?Rand="+Math.random()+"&activeCode="+json.activeCode;
                    		//window.location.href = "http://162.105.132.*:7001/iaaa/activateAccount.jsp?Rand="+Math.random()+"&activeCode="+json.activeCode;	//做验证码测试时
                    	}
						else if("用户名或密码错误"==json.errors.msg){
                    		$("#user_name").select();
                    		if(true==json.showCode){
                    			$("#code_area").show();
                    		}
                    	}
                    	else if("验证码错误"==json.errors.msg){
                    		$("#code_area").show();
                			$("#valid_code").select();
                    	}
                    	else if("短信验证码错误或已过期"==json.errors.msg){
                    		$("#sms_code").select();
                    	}
                    	else if("手机令牌错误或已过期"==json.errors.msg){
                    		$("#otp_code").select();
                    	}
                    }
				},
				error : function(xhr,status,error) {
					//$("#msg").text("查询时出现异常");
					$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 系统服务异常");
					$("#code_img").attr("src","/iaaa/servlet/DrawServlet?Rand="+Math.random());
				}
			});
   }
}
function oauthLogon () {
   if($("#user_name").val()==""/* || $("#user_name").val()=="学号/职工号/北大邮箱/手机号"*/) { 
     	//$("#msg").text("账号不能为空");
   		if(LOCALE_LANG.indexOf("zh")<0)
   			$("#msg").html("<i class=\"fa fa-minus-circle\"></i> Please input User ID.");
   		else
     		$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 账号不能为空");
     	$("#user_name").focus();
   }else if($("#password").val()==""/* ||$("#password").val()=="密码"*/) { 
     	//$("#msg").text("密码不能为空");
   		if(LOCALE_LANG.indexOf("zh")<0)
   			$("#msg").html("<i class=\"fa fa-minus-circle\"></i> Please input Password.");
   		else
   			$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 密码不能为空");
     	$("#password").focus();
   }else if(TOKEN=="") { 
          $("#msg").html("<i class=\"fa fa-minus-circle\"></i> token异常，请从比赛平台直接进入");
}
   else if($("#otp_area:visible").length>0 && 
   	($("#otp_code").val()=="" /* ||	$("#otp_code").val()=="手机令牌"*/)) { 
   		if(LOCALE_LANG.indexOf("zh")<0)
   			$("#msg").html("<i class=\"fa fa-minus-circle\"></i> Please input OTP Code.");
   		else
     		$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 手机令牌不能为空");
     	$("#otp_code").focus();
   }
   else if($("#sms_area:visible").length>0 && 
   	($("#sms_code").val()=="" /* ||	$("#sms_code").val()=="短信验证码"*/)) { 
   		if(LOCALE_LANG.indexOf("zh")<0)
   			$("#msg").html("<i class=\"fa fa-minus-circle\"></i> Please input SMS Code.");
   		else
     		$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 短信验证码不能为空");
     	$("#sms_code").focus();
   }
   else if($("#code_area:visible").length>0 && 
   	($("#valid_code").val()=="" /* ||	$("#valid_code").val()=="验证码"*/)) { 
     	//$("#msg").text("验证码不能为空");
   		if(LOCALE_LANG.indexOf("zh")<0)
   			$("#msg").html("<i class=\"fa fa-minus-circle\"></i> Please input Captcha.");
   		else
     		$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 验证码不能为空");
     	$("#valid_code").focus();
   }
   else { //document.myForm.submit();
   		if($("#remember_check")[0].checked==true){
   			setCookie("userName",$("#user_name").val());
   			setCookie("remember","true");
   		}
   		else{
   			delCookie("userName");
   			delCookie("remember");
   		}
   		if(LOCALE_LANG.indexOf("zh")<0)
   			$("#msg").text("Logging In ...");
   		else
   			$("#msg").text("正在登录...");
   		$.ajax('/iaaa/oauthlogin.do',
   			{
   				type:"POST",
				data:{//appid: $("#appid").val(),
					//userName: $("#user_name").val(),
					//password: $("#password").val(),
					//randCode: $("#valid_code").val(),
					//smsCode:$("#sms_code").val(),
					//otpCode:$("#otp_code").val(),
					//redirUrl:redirectURL
                    token:TOKEN
				},
				dataType:"json",
				success : function(data,status,xhr) {
					var json = data;
                	if(true == json.success){
                		/*//如果是弱口令 显示#msg 提示
                		if(json.isFlag){
                			$("#msg").text("密码强度不足，请尽快登录门户修改");
                			setTimeout(function(){
                				if(redirectURL.indexOf("?")>0)
		               			window.location.href = redirectURL+"&rand="+Math.random()+"&token="+json.token;
		               		else
		                   		window.location.href = redirectURL+"?rand="+Math.random()+"&token="+json.token;
                			},2000);
                		}else{*/
                			var pIdx = redirectURL.indexOf("?");
	                		if(pIdx>0){
//	                			window.location.href = redirectURL.substring(0,pIdx)+"?_rand="+Math.random()+"&token="+json.token+"&"+redirectURL.substring(pIdx+1);
                                window.location.href = redirectURL+"?_rand="+Math.random()+"&jwt="+encodeURIComponent(json.token)+"&token="+encodeURIComponent(TOKEN);
	                		}
	                		else
                                window.location.href = redirectURL+"?_rand="+Math.random()+"&jwt="+encodeURIComponent(json.token)+"&token="+encodeURIComponent(TOKEN);
	                    //}
                    }
                    else{
                    	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.errors.msg);
                    	$("#code_img")[0].src="/iaaa/servlet/DrawServlet?Rand="+Math.random();
                    	if("E02"==json.errors.code){
                    		window.location.href = "https://iaaa.pku.edu.cn/iaaa/activateAccount.jsp?Rand="+Math.random()+"&activeCode="+json.activeCode;
                    		//window.location.href = "http://162.105.*:7001/iaaa/activateAccount.jsp?Rand="+Math.random()+"&activeCode="+json.activeCode;
                    	}
                    	else if("E01"==json.errors.code){
                    		$("#user_name").select();
                    		if(true==json.showCode){
                    			$("#code_area").show();
                    		}
                    	}
                    	else if(json.isFlag){                    		
                			//如果是弱口令 允许登录，但是，显示#msg 提示，
                			/*$("#msg").text("密码强度不足，请尽快登录门户修改");
                			setTimeout(function(){
                				if(redirectURL.indexOf("?")>0)
		               			window.location.href = redirectURL+"&rand="+Math.random()+"&token="+json.token;
		               		else
		                   		window.location.href = redirectURL+"?rand="+Math.random()+"&token="+json.token;
                			},2000);*/
                			//20170928
                			$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 您的密码强度不足，请按照“忘记密码”说明重置密码");
                			
                			//var logonId = $("#user_name").val();
                			//window.location.href = "https://iaaa.pku.edu.cn/iaaa/weakPwdModifyl.jsp?Rand="+Math.random()+"&logonId="+logonId;
                			//window.location.href = "http://162.105.223.*:*/iaaa/weakPwdModifyl.jsp?Rand="+Math.random()+"&logonId="+logonId;
                			
                		} 
                    	else if("E03"==json.errors.code){
                    		$("#code_area").show();
                    		$("#valid_code").select();
                    	}
                    	else if("E04"==json.errors.code){
                    		$("#sms_code").select();
                    	}
                    	else if("E05"==json.errors.code){
                    		$("#otp_code").select();
                    	}
                    }
				},
				error : function(xhr,status,error) {
					if(LOCALE_LANG.indexOf("zh")<0)
			   			$("#msg").html("<i class=\"fa fa-minus-circle\"></i> Service with exception.");
			   		else
			   			$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 系统服务异常");
					$("#code_img").attr("src","/iaaa/servlet/DrawServlet?Rand="+Math.random());
				}
			});
   }
}
var cnt=15;
var itv;
function jumpProgress(){
		cnt--;
		if(cnt>0){
			$("input[name='logonButton']").val("请正确操作("+cnt+")");//下一步
			$("#logon_button").attr("disabled",false);
			$("#logon_button").css("background-color","#B40605");
			$("#logon_button").css("cursor","pointer");
		}
		else{
			if(cnt==0){
				clearInterval(itv);	
				$("input[name='logonButton']").val("下一步");//下一步
			}
		}
	}
function proxyLogon() {	
	   if($("#user_name").val()==""/* || $("#user_name").val()=="学号/职工号/北大邮箱/手机号"*/) { 
	     	//$("#msg").text("账号不能为空");
	     	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 账号不能为空");
	     	$("#user_name").focus();
	   }else if($("#otp_area:visible").length>0 && 
	   	($("#otp_code").val()=="" /* ||	$("#otp_code").val()=="手机令牌"*/)) { 
	     	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 手机令牌不能为空");
	     	$("#otp_code").focus();
	   }
	   else if($("#sms_area:visible").length>0 && 
	   	($("#sms_code").val()==""/*  ||	$("#sms_code").val()=="短信验证码"*/)) { 
	     	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 短信验证码不能为空");
	     	$("#sms_code").focus();
	   }else { 
	   		/*if($("#remember_check")[0].checked==true){
	   			setCookie("userName",$("#user_name").val());
	   			setCookie("remember","true");
	   		}
	   		else{
	   			delCookie("userName");
	   			delCookie("remember");
	   		}*/
	   		$("#msg").text("正在登录...");
	   		$.ajax('/iaaa/mobileAuth4proxy.do',
	   			{
	   				type:"POST",
					data:{appid: $("#appid").val(),
						userName: $("#user_name").val(),
						grantToken: $("#grantToken").val(),
						proxyAppId: $("#proxyAppId").val(),
						smsCode:$("#sms_code").val(),
						otpCode:$("#otp_code").val(),
						redirUrl:redirectURL
					},
					dataType:"json",
					success : function(data,status,xhr) {
						var json = data;
	                	if(true == json.success){
	                		var pIdx = redirectURL.indexOf("?");
	                		if(pIdx>0){
//	                			window.location.href = redirectURL.substring(0,pIdx)+"?_rand="+Math.random()+"&token="+json.token+"&"+redirectURL.substring(pIdx+1);
//	                			window.location.href = redirectURL+"&_rand="+Math.random()+"&token="+json.token;
                                window.location.replace(redirectURL+"?_rand="+Math.random()+"&token="+json.token);
	                		}
	                		else{
//	                			window.location.href = redirectURL+"?_rand="+Math.random()+"&token="+json.token;
	                			window.location.replace(redirectURL+"?_rand="+Math.random()+"&token="+json.token);
	                		}
	                    }
	                    else{
	                    	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.errors.msg);
	                    	//$("#code_img")[0].src="/iaaa/servlet/DrawServlet?Rand="+Math.random();//20190919remark??
	                    	if("账号未激活"==json.errors.msg){
	                    		window.location.href = "https://iaaa.pku.edu.cn/iaaa/activateAccount.jsp?Rand="+Math.random()+"&activeCode="+json.activeCode;
	                    	}
	                    	else if("用户名或密码错误"==json.errors.msg){
	                    		$("#user_name").select();
	                    		if(true==json.showCode){
	                    			$("#code_area").show();
	                    		}
	                    	}
	                    	else if("短信验证码错误或已过期"==json.errors.msg){
	                    		$("#sms_code").select();
	                    	}
	                    	else if("手机令牌错误或已过期"==json.errors.msg){
	                    		$("#otp_code").select();
	                    	}
	                    }
					},
					error : function(xhr,status,error) {
						$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 系统服务异常");
						$("#code_img").attr("src","/iaaa/servlet/DrawServlet?Rand="+Math.random());
					}
				});
   }
}
function redirectLogon(){
	window.location.href = redirectLogonURL;
}
function changeCode(){
	$("#code_img")[0].src="/iaaa/servlet/DrawServlet?Rand="+Math.random();
}
function focusUserName(){
	$("#user_name").next(".i-clear").show();
	$("#user_name").select();
}
function leaveUserName(){
	var name=$("#user_name").val();
	if(""==name/* || "学号/职工号/北大邮箱"==name*/){
		$("#user_name").next(".i-clear").hide();
	}
	
}
function enterPassword(keypressed){
	var key;
    if (document.all) {
        key=window.event.keyCode;
    }
    else {
        key=keypressed.which;
    };
	if(key==13){
		$("#password").focus();
	}
	else{
		var name=$("#user_name").val();
		/*if(""==name || "学号/职工号/北大邮箱"==name){
			$("#user_name").val("");
			$("#user_name").css("color","#000000");
		}
		$("#user_name").next(".i-clear").show();*/
	}
}
function focusPassword(){
  /*var val = $("#password").val();
  if("密码"==val){
       $("#password")[0].outerHTML="<input class='input-txt-row input-txt-pad' type='password' id='password'  name='password' tabIndex = '2' value='' onFocus='focusPassword()' onblur='leavePassword()' onKeyDown='enterSMSCode(event)'  onMouseOver='changeBorderColor(this)' onMouseOut='backBorderColor(this)'/>";
       $("#password").css("color","#000000");
       $("#password").focus();
  }*/
  /*$("#password").css("color","#000000");*/
  $("#password").next(".i-clear").show();
  $("#password").select();
}
function focusPassword2Bind(){
  /*var val = $("#password").val();
  if("密码"==val){
       $("#password")[0].outerHTML="<input class='input-txt-row input-txt-pad' type='password' id='password'  name='password' tabIndex = '2' value='' onFocus='focusPassword()' onblur='leavePassword()' onKeyDown='enterCode2Bind(event)'  onMouseOver='changeBorderColor(this)' onMouseOut='backBorderColor(this)'/>";
       $("#password").css("color","#000000");
       $("#password").focus();
  }*/
  /*$("#password").css("color","#000000");*/
  $("#password").next(".i-clear").show();
  $("#password").select();
}
function leavePassword(){
  var val = $("#password").val();
  if(""==val){
	   //$("#password")[0].outerHTML="<input class='input-txt-row input-txt-pad' type='text' id='password' name='password' tabIndex = '2'  value='密码' onFocus='focusPassword()' onblur='leavePassword()' onKeyDown='enterSMSCode(event)'  onMouseOver='changeBorderColor(this)' onMouseOut='backBorderColor(this)''/>";
	  /* $("#password").css("color","#B7B7B9");*/
	   $("#password").next(".i-clear").hide();
  }
}
/**
 * 口令输入回车之后
 * @param {} keypressed
 */
function enterSMSCode(keypressed){
	var key;
    if (document.all) {
        key=window.event.keyCode;
    }
    else {
        key=keypressed.which;
    };

	if(key==13){
		if($("#sms_area:visible").length>0){
			$("#sms_code").focus();
			$("#sms_code").select();
		}
		else if($("#otp_area:visible").length>0){
			$("#otp_code").focus();
			$("#otp_code").select();
		}
		else if($("#code_area:visible").length>0){
			$("#valid_code").focus();
			$("#valid_code").select();
		}
		else if(0==$("#appid").length)
			//logon();/*改用button的focus，可以避免两次提交。*/
			$("#logon_button").focus();
		else
			//oauthLogon();
			$("#logon_button").focus();
	}
	else{
		$("#password").next(".i-clear").show();
	}
}
/**
 * 回车之后进入验证码区域
 * @param {} keypressed
 */
function enterCode(keypressed){
	var key;
    if (document.all) {
        key=window.event.keyCode;
    }
    else {
        key=keypressed.which;
    };

	if(key==13){
		if($("#code_area:visible").length>0){
			$("#valid_code").focus();
			$("#valid_code").select();
		}
		else if(0==$("#appid").length)
			//logon();/*改用button的focus，可以避免两次提交。*/
			$("#logon_button").focus();
		else
			//oauthLogon();
			$("#logon_button").focus();
	}
	else{
		if($("#sms_area:visible").length>0){
			var val=$("#sms_code").val();
			if(""==val || "短信验证码"==val){
				$("#sms_code").val("");
				/*$("#sms_code").css("color","#000000");*/
			}
			$("#sms_code").next(".i-clear").show();
		}
		else if($("#otp_area:visible").length>0){
			var val=$("#otp_code").val();
			if(""==val || "手机令牌"==val){
				$("#otp_code").val("");
				/*$("#otp_code").css("color","#000000");*/
			}
			$("#otp_code").next(".i-clear").show();
		}
	}
}
function enterCode2Bind(keypressed){
	var key;
    if (document.all) {
        key=window.event.keyCode;
    }
    else {
        key=keypressed.which;
    };

	if(key==13){
		if($("#code_area:visible").length>0){
			$("#valid_code").focus();
			$("#valid_code").select();
		}
		else 
			//gotoOTPBind();
			$("#otp_button").focus();
	}
	else{
		$("#password").next(".i-clear").show();
	}
}
function enterCode2Proxy(keypressed){
	var key;
    if (document.all) {
        key=window.event.keyCode;
    }
    else {
        key=keypressed.which;
    };

	if(key==13){
		proxyLogon();
	}
	else{
		if($("#sms_area:visible").length>0){
			var val=$("#sms_code").val();
			if(""==val || "短信验证码"==val){
				$("#sms_code").val("");
				/*$("#sms_code").css("color","#000000");*/
			}
			$("#sms_code").next(".i-clear").show();
		}
		else if($("#otp_area:visible").length>0){
			var val=$("#otp_code").val();
			if(""==val || "手机令牌"==val){
				$("#otp_code").val("");
				$/*("#otp_code").css("color","#000000");*/
			}
			$("#otp_code").next(".i-clear").show();
		}
	}
}
function focusCode(){
	var code=$("#valid_code").val();
	/*if(""!=code && "验证码"!=code){
		$("#valid_code").css("color","#000000");
	}*/
	$("#valid_code").select();
}
function leaveCode(){
	var code=$("#valid_code").val();
	if(""==code|| "验证码"==code){
		/*$("#valid_code").val("验证码");
		$("#valid_code").css("color","#B7B7B9");*/
	}
}
function enterKey(keypressed){
	var key;
    if (document.all) {
        key=window.event.keyCode;
    }
    else {
        key=keypressed.which;
    };

	if(key==13){
		if(0==$("#appid").length)
			//logon();
			$("#logon_button").focus();
		else
			//oauthLogon();
			$("#logon_button").focus();
	}
	else{
		var val=$("#valid_code").val();
		/*if(""==val || "验证码"==val){
			$("#valid_code").val("");
			$("#valid_code").css("color","#000000");
		}*/
		$("#valid_code").next(".i-clear").show();
	}
}
function enterKey2Bind(keypressed){
	var key;
    if (document.all) {
        key=window.event.keyCode;
    }
    else {
        key=keypressed.which;
    };

	if(key==13){
		gotoOTPBind();
	}
	else{
		var val=$("#valid_code").val();
		/*if(""==val || "验证码"==val){
			$("#valid_code").val("");
			$("#valid_code").css("color","#000000");
		}*/
		$("#valid_code").next(".i-clear").show();
	}
}
function getCookie(c_name)
{
	if (document.cookie.length>0){
		c_start=document.cookie.indexOf(c_name + "=")
	  	if (c_start!=-1){ 
	    	c_start=c_start + c_name.length+1 
	    	c_end=document.cookie.indexOf(";",c_start)
	    	if (c_end==-1) 
	    		c_end=document.cookie.length
	    	return unescape(document.cookie.substring(c_start,c_end))
    	} 
  	}
	return ""
}
function setCookie(c_name,value)
{
	var expiredays=30;
	var exdate=new Date()
	exdate.setDate(exdate.getDate()+expiredays)
	document.cookie=c_name+ "=" +escape(value)+
	((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}
function delCookie(name)//删除cookie
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}
function reCalculate(){
	var offset = document.body.clientWidth-1000>0?0:document.body.clientWidth-1000;
	$("#left")[0].style.width=555+offset; 
}
var viewIntr=["博雅塔","北阁","办公楼前的华表","北京大学匾额","未名湖博雅塔","南北阁"]
var viewAuth=["吕凤翥","吕凤翥","吕凤翥","吕凤翥","吕凤翥","吕凤翥"]
var vwNo=1;
var vwCnt=12;
var redirectURL = null;
var redirectLogonURL = null;
function focusName4HTML(){
	/**20201019将JSP改成HTML页面***/
	redirectURL = decodeURIComponent(this.getUrlVars("redirectUrl"));
	redirectLogonURL = decodeURIComponent(this.getUrlVars("redirectLogonUrl"));
	var appId = this.getUrlVars("appID");
	if (appId!=null && appId!="" && appId!="undefined"){
		$("#appid").val(appId);
	}
	if ( redirectLogonURL!=null && redirectLogonURL!="" && redirectLogonURL!="undefined"){
		$("#redir_logon_button").show();
	}
	/***End Of 20201019 **/
	focusName();
}
function focusName(){
    TOKEN=getPar("token");
	vwNo = Math.round((Math.random()*10))%vwCnt+1;
	$(".mid").css("background-image","url(./resources/images/pku_view_"+vwNo+".jpg)");
	//$("#left")[0].style.background="url(./resources/images/pku_view_"+vwNo+".jpg) left top no-repeat";
	// $("#view-tip").html(viewIntr[vwNo-1]+"<BR>原图摄影："+viewAuth[vwNo-1]);
	var userName=getCookie('userName')
	if (userName!=null && userName!=""){
		$("#user_name").val(userName);
	  	$("#password").focus();/*如果停在password，IE无法自动填写密码*/
//		$("#user_name").focus();
	}
	else{
	  $("#user_name").focus();
	  $("#user_name").next(".i-clear").show();
	}
	var remember=getCookie('remember')
	if (remember!=null && remember!="" && remember!="false"){
		$("#remember_check")[0].checked =true;
		$("#remember_text").children(".i-check").removeClass("fa-square-o").addClass("fa-check-square-o");
	}
	var name=$("#user_name").val();
	if(""!=name/* && "学号/职工号/北大邮箱"!=name*/){
		$("#user_name").next(".i-clear").show();
	}
	showOrHideSmsCode();
	
	/**20201211 对CARSI特殊处理 ***/
	var appId = this.getUrlVars("appID");
	if(appId==='zygxfw'){
		var token = this.getCookie("carsitoken");
		if(token!=""){
			var pIdx = redirectURL.indexOf("?");
			if(pIdx>0){
				window.location.href = redirectURL+"&_rand="+Math.random()+"&token="+token;
			}
			else
	    		window.location.href = redirectURL+"?_rand="+Math.random()+"&token="+token;
		}
		this.delCookie("carsitoken");
	}
	/**End of 20201211*****/
	
}
//add 20171023
function focusName2OTP(){
	vwNo = Math.round((Math.random()*10))%vwCnt+1;
	$(".mid").css("background-image","url(./resources/images/pku_view_"+vwNo+".jpg)");
	//$("#left")[0].style.background="url(./resources/images/pku_view_"+vwNo+".jpg) left top no-repeat";
	// $("#view-tip").html(viewIntr[vwNo-1]+"<BR>原图摄影："+viewAuth[vwNo-1]);
	var userName=getCookie('userName')
	if (userName!=null && userName!=""){
		$("#user_name").val(userName);
		/*$("#user_name").css("color","#000000");*/
	  	$("#password").focus();/*如果停在password，IE无法自动填写密码*/
//		$("#user_name").focus();
	}
	else{
	  $("#user_name").focus();
	  $("#user_name").next(".i-clear").show();
	}
	var remember=getCookie('remember')
	if (remember!=null && remember!="" && remember!="false"){
		$("#remember_check")[0].checked =true;
		$("#remember_text").children(".i-check").removeClass("fa-square-o").addClass("fa-check-square-o");
	}
	var name=$("#user_name").val();
	if(""!=name/* && "学号/职工号/北大邮箱"!=name*/){
		$("#user_name").next(".i-clear").show();
	}
//	showOrHideSmsCode2OTP();
	$.ajax('/iaaa/isShowCode.do',
		{
			dataType:"json",
			success : function(data,status,xhr) {
				var json = data;
	        	if(true == json.success){
	        		$("#code_area").show();
	            }
			},
			error : function(xhr,status,error) {
			}
	});
}

function init4Proxy(){
	//vwNo = Math.round((Math.random()*10))%vwCnt+1;
	//$(".mid").css("background-image","url(./resources/images/pku_view_"+vwNo+".jpg)");
	$("#user_name").css("color","#000000");
	showOrHideSmsCodeProxy();
}
//add 20170412 for iaaa, refresh logon.jsp appId null error
function focusNameIaaa(){
	vwNo = 10;//Math.round((Math.random()*10))%vwCnt+1;
	$(".mid").css("background-image","url(./resources/images/pku_view_"+vwNo+".jpg)");
	//$("#left")[0].style.background="url(./resources/images/pku_view_"+vwNo+".jpg) left top no-repeat";
	// $("#view-tip").html(viewIntr[vwNo-1]+"<BR>原图摄影："+viewAuth[vwNo-1]);
	var userName=getCookie('userName')
	if (userName!=null && userName!=""){
		$("#user_name").val(userName);
//		$("#user_name").css("color","#000000");
	  	$("#password").focus();/*如果停在password，IE无法自动填写密码*/
//		$("#user_name").focus();
	}
	else{
	  $("#user_name").focus();
	  $("#user_name").next(".i-clear").show();
	}
	var remember=getCookie('remember')
	if (remember!=null && remember!="" && remember!="false"){
		$("#remember_check")[0].checked =true;
		$("#remember_text").children(".i-check").removeClass("fa-square-o").addClass("fa-check-square-o");
	}
	//add 20170412 for iaaa, refresh logon.jsp appId null error
	var name=$("#user_name").val();
	if(""!=name/* && "学号/职工号/北大邮箱"!=name*/){
		$("#user_name").next(".i-clear").show();
	}
	showOrHideSmsCodeIaaa();
	//add 20170412
	$.ajax('/iaaa/isShowCode.do',
		{
			dataType:"json",
			success : function(data,status,xhr) {
				var json = data;
	        	if(true == json.success){
	        		$("#code_area").show();
	            }
			},
			error : function(xhr,status,error) {
			}
	});
}
//end 20170412
function showViewTip(){
	$("#view-tip").fadeIn();
}
function hideViewTip(){
	$("#view-tip").fadeOut();
}
function changeViewImg(){
	vwNo = vwNo%vwCnt+1;
	$(".mid").css("background-image","url(./resources/images/pku_view_"+vwNo+".jpg)");
}
function changeBorderColor(obj){
	obj.style.borderColor="#B40605";
}
function backBorderColor(obj){
	obj.style.borderColor="#CECECE";
}
function changeOutlineColor(obj){
	obj.style.outline="1px solid #B40605";
}
function backOutlineColor(obj){
	obj.style.outline="";
}
function clickCheck(){
	if($("#remember_check").attr("checked")===true || $("#remember_check").attr("checked")==="checked"){
		$("#remember_check").removeAttr("checked");
		$("#remember_text").children(".i-check").removeClass("fa-check-square-o").addClass("fa-square-o");
	}
	else{
		$("#remember_check").attr("checked","checked");
		$("#remember_text").children(".i-check").removeClass("fa-square-o").addClass("fa-check-square-o");
	}
}
/*function mouseOverCheck(){
	if($("#remember_check").attr("checked")===true || $("#remember_check").attr("checked")==="checked"){
		$("#remember_text").css("background-image","url(/iaaa/resources/images/checkbox_yes_red.png)");
	}
	else{
		$("#remember_text").css("background-image","url(/iaaa/resources/images/checkbox_no_red.png)");
	}
}
function mouseOutCheck(){
	if($("#remember_check").attr("checked")===true || $("#remember_check").attr("checked")==="checked"){
		$("#remember_text").css("background-image","url(/iaaa/resources/images/checkbox_yes.png)");
	}
	else{
		$("#remember_text").css("background-image","url(/iaaa/resources/images/checkbox_no.png)");
	}
}*/
function showOrHideSmsCode(){
	$("#msg").text("");//add 20180612 清除
	var name=$("#user_name").val();			
	var appId=$("#appid").val();//add 201702 for user/app mobile authen
	if(""==name /*|| "学号/职工号/北大邮箱"==name*/){
		//hide
		$("#sms_area").hide();
		//$("#otp_area").hide();
	}
	else{
		//add 20180622 for bjmu
		var listIn = "11956903,11957906,11957909,11959938,11961904,11962916,11963908,11966913,11966918,11967907,11970912,11971915,11972919,11977936,11966940,11955902,11955905,11960911,11963910,11960918";
		if(name!=null && name.length>0 
			&& (name.indexOf("119")==0 || name.indexOf("B119")==0) && name.length==8 && listIn.indexOf(name)<0){
			$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+"请使用医学部10位新账号登录。");
			return;
		}
		//end add
		$.getJSON('/iaaa/isMobileAuthen.do',
			//{userName: name,_rand:Math.random()},
			{userName: name,appId: appId,_rand:Math.random()},
			function(data) {
				var json = data;           		
            	$("#msg").text("");
            	if(true===json.success){
	            	/*if(true == json.isMobileAuthen){//OLD!
	            		$("#sms_area").show();
	                }*/
	            	//add 201705
	            	var isMobileAuthen = json.isMobileAuthen;//modi 201705 String 
	            	var modeAuthen = json.authenMode;//modi 201705 String 
					var isBind = json.isBind;//绑定状态 boolean
					if(true==isMobileAuthen){
						if("OTP"===modeAuthen){
							$("#sms_area").hide();
			            	$("#otp_area").show();
			            	if(false===isBind){
			            		$("#msg").text("请先绑定手机App");
			            		$("#otp_button").show();
			            		$("#logon_button").hide();
			            	}
			            	else{
			            		$("#otp_button").hide();
			            		$("#logon_button").show();
			            	}
						}
						else if("SMS"===modeAuthen){
							$("#sms_area").show();
			            	$("#otp_area").hide();
			            	$("#otp_button").hide();
			            	$("#logon_button").show();
						}
            	   }
					else{//不验证，或者有错误
						$("#sms_area").hide();
		            	$("#otp_area").hide();
		            	$("#otp_button").hide();
		            	$("#logon_button").show();
	                }
            	}
            	/*2020-01-09 验证手机不提示错误
            	 * else{
            		if(json.errors){
	                	 $("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.errors.msg); 
                    		$("#user_name").select();
                    		if(true==json.showCode){
                    			$("#code_area").show();
                    		}
            		}
	               	else
	               	 	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 操作异常，请重试。");
            	}*/
			}
		);
	}
}
function showOrHideSmsCodeIaaa(){//add 201702 for user/iaaa mobile authen
	var name=$("#user_name").val();
	if(""==name/* || "学号/职工号/北大邮箱"==name*/){
		//hide
		$("#sms_area").hide();
		$("#otp_area").hide();
	}
	else{		
		var appId="iaaa";//add 201702 for user/app mobile authen
		$.getJSON('/iaaa/isMobileAuthen.do',
			//{userName: name,_rand:Math.random()},
			{userName: name,appId:appId,_rand:Math.random()},
			function(data) {
				var json = data;
            	$("#msg").text("");//应清除如果已经显示的msg信息
            	if(true===json.success){
	            	/*if(true == json.isMobileAuthen){//OLD!
	            		$("#sms_area").show();
	                }*/
	            	//add 201705
	            	var isMobileAuthen = json.isMobileAuthen;//modi 201705 String 
	            	var modeAuthen = json.authenMode;//modi 201705 String 
					var isBind = json.isBind;//绑定状态 boolean
					if(true==isMobileAuthen){
						if("OTP"===modeAuthen){
							$("#sms_area").hide();
			            	$("#otp_area").show();
			            	if(false===isBind){
			            		$("#msg").text("请先绑定手机App");
			            		$("#otp_button").show();
			            		$("#logon_button").hide();
			            	}
			            	else{
			            		$("#otp_button").hide();
			            		$("#logon_button").show();
			            	}
						}
						else if("SMS"===modeAuthen){
							$("#sms_area").show();
			            	$("#otp_area").hide();
			            	$("#otp_button").hide();
			            	$("#logon_button").show();
						}
					}
					else{//不验证，或者有错误
						$("#sms_area").hide();
		            	$("#otp_area").hide();
		            	$("#otp_button").hide();
		            	$("#logon_button").show();
	                }
            	}
            	/*2020-01-09 验证手机不提示错误
            	 * else{
            		if(json.errors){
	                	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.errors.msg);
                    		$("#user_name").select();
                    		if(true==json.showCode){
                    			$("#code_area").show();
                    		}
            		}
	                else if(json.errMsg)
	                	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.errMsg);
	               	else
	               		$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 操作异常，请重试。");
            	}*/
			}
		);
	}
}
function showOrHideSmsCodeProxy(){	
	$("#msg").text("");
	var name=$("#user_name").val();			
	var appId=$("#appid").val();//add 201702 for user/app mobile authen
	
	if(""==name/* || "学号/职工号/北大邮箱"==name*/){
		//hide
		$("#sms_area").hide();
		//$("#otp_area").hide();
	}else{
		//add 20180622 for bjmu
		var listIn = "11956903,11957906,11957909,11959938,11961904,11962916,11963908,11966913,11966918,11967907,11970912,11971915,11972919,11977936,11966940,11955902,11955905,11960911,11963910,11960918";
		if(name!=null && name.length>0 && (name.indexOf("119")==0 || name.indexOf("B119")==0) && name.length==8 && listIn.indexOf(name)<0){
			$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+"请使用医学部10位新账号登录。");
			return;
		}
		//end add
		var otpCodePara = getUrlVars("otpCode");
		/*var redirectURLPara =getUrlVars("redirectUrl");
		var userIdPara = getUrlVars("userId");
		var appIdPara = getUrlVars("appId");
		var proxyAppIdPara = getUrlVars("proxyAppId");
		var grantTokenPara = getUrlVars("grantToken");*/
		$.getJSON('/iaaa/isMobileAuthen.do',
			//{userName: name,_rand:Math.random()},
			{userName: name,appId: appId,_rand:Math.random()},
			function(data) {
				var json = data;           		
            	$("#msg").text("");
            	if(true===json.success){
	            	/*if(true == json.isMobileAuthen){//OLD!
	            		$("#sms_area").show();
	                }*/
	            	//add 201705
	            	var isMobileAuthen = json.isMobileAuthen;//modi 201705 String 
	            	var modeAuthen = json.authenMode;//modi 201705 String 
					var isBind = json.isBind;//绑定状态 boolean
					if(true==isMobileAuthen){
						if("OTP"===modeAuthen){
							$("#title-tip").text("请从您的手机中提取手机令牌：");
							$("#mobile").text(json.mobileMask);
							$("#sms_area").hide();
			            	$("#otp_area").show();
			            	$("#otp_code").focus();
			            	if(false===isBind){
			            		$("#msg").text("请先绑定手机App");
			            		$("#otp_button").show();
			            		$("#logon_button").hide();
			            	}
			            	else{
			            		$("#otp_button").hide();
			            		$("#logon_button").show();
			            		if(otpCodePara!=null){
			            			//Write Code
			            			$("#otp_code").val(otpCodePara);
			            			/*$("#user_Name").val(userIdPara);
			            			$("#appId").val(appIdPara);
			            			$("#proxyAppId").val(proxyAppIdPara);
			            			$("#grantToken").val(grantTokenPara);
			            			$("#user_Name").val(userIdPara);
			            			redirectURL = redirectURLPara;*/
			            			proxyLogon();
			            		}
			            	}
						}
						else if("SMS"===modeAuthen){
							$("#title-tip").text("验证码已发送至您的手机：");
							$("#mobile").text(json.mobileMask);
							$("#sms_area").show();
			            	$("#otp_area").hide();
			            	$("#otp_button").hide();
			            	$("#logon_button").show();
			            	$("#sms_code").focus();
			            	sendSMSCode();
						}
            	   }
					else{//不验证，或者有错误。但是没有手机验证的应用应该不允许通过这个登录。
						$("#sms_area").hide();
		            	$("#otp_area").hide();
		            	$("#otp_button").hide();
		            	$("#logon_button").show();
	                }
            	}
            	/*2020-01-09 验证手机不提示错误
            	 * else{
            		if(json.errors){
	                	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.errors.msg);
                    		$("#user_name").select();
                    		if(true==json.showCode){
                    			$("#code_area").show();
                    		}
            		}
	               	else
	               		$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 操作异常，请重试。");
            	}*/
			}
		);
	}
}
/**
 * 2020-01-09 原来在login2OTP.jsp的userName输入框onChange事件和函数focusName2OTP中使用，如果无论成功与否都不提示，似乎可以不用了。
 * @deprecated
 */
function showOrHideSmsCode2OTP(){
	var name=$("#user_name").val();		
	var appId="iaaa";//add 20171023
	//var appId=$("#appid").val();//add 201702 for user/app mobile authen
	if(""==name/* || "学号/职工号/北大邮箱"==name*/){
		//hide
		$("#code_area").hide();
		//$("#otp_area").hide();
	}
	else{
		$.getJSON('/iaaa/isMobileAuthen.do',
			{userName: name,appId: appId,_rand:Math.random()},
			function(data) {
				var json = data;           		
            	$("#msg").text("");
            	if(true===json.success){/*
	            	//add 201705
	            	var isMobileAuthen = json.isMobileAuthen;//modi 201705 String 
	            	var modeAuthen = json.authenMode;//modi 201705 String 
					var isBind = json.isBind;//绑定状态 boolean
					if(true==isMobileAuthen){
						if("OTP"===modeAuthen){
							$("#sms_area").hide();
			            	$("#otp_area").show();
			            	if(false===isBind){
			            		$("#msg").text("请先绑定手机App");
			            		$("#otp_button").show();
			            		$("#logon_button").hide();
			            	}
			            	else{
			            		$("#otp_button").hide();
			            		$("#logon_button").show();
			            	}
						}
						else if("SMS"===modeAuthen){
							$("#sms_area").show();
			            	$("#otp_area").hide();
			            	$("#otp_button").hide();
			            	$("#logon_button").show();
						}
            	   }
					else{//不验证，或者有错误
						$("#sms_area").hide();
		            	$("#otp_area").hide();
		            	$("#otp_button").hide();
		            	$("#logon_button").show();
	                }
            	*/}
            	/*2020-01-09 验证手机不提示错误
            	 * else{
            		if(json.errors){
	                	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.errors.msg);
	                	//if("用户名错误"==json.errors.msg){
                    		$("#user_name").select();
                    		if(true==json.showCode){
                    			$("#code_area").show();
                    		}
                    	//}
            		}
	               	else
	               		$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 操作异常，请重试。");
            	}*/
			}
		);
	}
}

var remainSeconds=60;
var smsCodeItv;
function reEvalSendBtn(){
	remainSeconds--;
	if(remainSeconds<=0){
		clearInterval(smsCodeItv);
		$("#sms_button").val("获取短信验证码");
		$("#sms_button").attr("disabled",false);
		$("#sms_button").css("background-color","#B40605"); 
		$("#sms_button").css("cursor","pointer");
	}
	else{
		$("#sms_button").val("已发送("+remainSeconds+")");
	}
}
function sendSMSCode(){
	var name=$("#user_name").val();
	var appId=$("#appid").val();//登录的应用系统ID
	if(""==name/* || "学号/职工号/北大邮箱"==name*/){
		$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 账号不能为空");
     	$("#user_name").focus();
	}
	else{
		//modi 20180620 一点击按钮就灰显
		$("#sms_button").attr("disabled",true); 
		$("#sms_button").css("background-color","#CCCCCC");
		$("#sms_button").css("cursor","default");
		remainSeconds=60;
		$("#sms_button").val("已发送("+remainSeconds+")");
		smsCodeItv = setInterval(reEvalSendBtn,1000);
		//end modi 20180620
		$.getJSON('/iaaa/sendSMSCode.do',
			{userName: name,appId: appId,_rand:Math.random()},
			function(data) {
				var json = data;
            	if(true == json.success){            		          		
					if($("#mobile").length==0)//ma4proxy中有mobile提示，故不再提示。
            			$("#msg").text("验证码已发至"+json.mobileMask);
                }
                else{
                	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.message);
                }
			}
		);
		/*//add 201702,判断checkAuthenMobile
		$.getJSON('/iaaa/checkAuthenMobile.do',
			//{userName: name,_rand:Math.random()},
		{userName: name,appId: appId,_rand:Math.random()},
			function(data) {
				var json = data;
            	if(true == json.success){//如果满足条件
            		remainSeconds=60;
					$("#sms_button").val("已发送("+remainSeconds+")");
					$("#sms_button").attr("disabled",true); 
					$("#sms_button").css("background-color","#CCCCCC");
					$("#sms_button").css("cursor","default");
					smsCodeItv = setInterval(reEvalSendBtn,1000);
					$.getJSON('/iaaa/sendSMSCode.do',
						//{userName: name,_rand:Math.random()},
					{userName: name,appId: appId,_rand:Math.random()},
						function(data) {
							var json = data;
			            	if(true == json.success){
			            		$("#msg").text("验证码已发至"+json.mobileMask);
			                }
			                else{
			                	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.message);
			                }
						}
					);
                }
                else{
                	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.message);
                }
			}
		);*/	
		/*remainSeconds=60;
		$("#sms_button").val("已发送("+remainSeconds+")");
		$("#sms_button").attr("disabled",true); 
		$("#sms_button").css("background-color","#CCCCCC");
		$("#sms_button").css("cursor","default");
		smsCodeItv = setInterval(reEvalSendBtn,1000);
		$.getJSON('/iaaa/sendSMSCode.do',
			//{userName: name,_rand:Math.random()},
		{userName: name,appId: appId,_rand:Math.random()},
			function(data) {
				var json = data;
            	if(true == json.success){
            		$("#msg").text("验证码已发至"+json.mobileMask);
                }
                else{
                	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.message);
                }
			}
		);*/
	}
}
function sendSMSCodeIaaa(){
	var name=$("#user_name").val();
	if(""==name/* || "学号/职工号/北大邮箱"==name*/){
		$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 账号不能为空");
     	$("#user_name").focus();
	}
	else{		
		var appId = 'iaaa';//登录IAAA系统  
		//add here ,modi 20180620 一点击按钮就变灰
		$("#sms_button").attr("disabled",true); 
		$("#sms_button").css("background-color","#CCCCCC");
		$("#sms_button").css("cursor","default");
		remainSeconds=60;
		$("#sms_button").val("已发送("+remainSeconds+")");
		smsCodeItv = setInterval(reEvalSendBtn,1000);
		//end modi 20180620
		$.getJSON('/iaaa/sendSMSCode.do',
			{userName: name,appId: appId,_rand:Math.random()},
			function(data) {
				var json = data;
            	if(true == json.success){            		          		
            		$("#msg").text("验证码已发至"+json.mobileMask);
                }
                else{
                	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.message);
                }
			}
		);
		/*//add 201702,判断checkAuthenMobile
		var appId = 'iaaa';//登录IAAA系统
		$.getJSON('/iaaa/checkAuthenMobile.do',
			//{userName: name,_rand:Math.random()},
		{userName: name,appId: appId,_rand:Math.random()},
			function(data) {
				var json = data;
            	if(true == json.success){//如果满足条件
            		remainSeconds=60;
					$("#sms_button").val("已发送("+remainSeconds+")");
					$("#sms_button").attr("disabled",true); 
					$("#sms_button").css("background-color","#CCCCCC");
					$("#sms_button").css("cursor","default");
					smsCodeItv = setInterval(reEvalSendBtn,1000);
					$.getJSON('/iaaa/sendSMSCode.do',
						//{userName: name,_rand:Math.random()},
					{userName: name,appId: appId,_rand:Math.random()},
						function(data) {
							var json = data;
			            	if(true == json.success){
			            		$("#msg").text("验证码已发至"+json.mobileMask);
			                }
			                else{
			                	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.message);
			                }
						}
					);
                }
                else{
                	$("#msg").text(json.message);
                	//$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.message);
                }
			}
		);*/
	}
}
function focusSMSCode(){
	var code=$("#sms_code").val();
	if(""!=code && "短信验证码"!=code){
//		$("#sms_code").css("color","#000000");
	}
	$("#sms_code").select();
}
function leaveSMSCode(){
	var code=$("#sms_code").val();
	if(""==code|| "短信验证码"==code){
		$("#sms_code").val("短信验证码");
//		$("#sms_code").css("color","#B7B7B9");
	}
}
function focusOTPCode(){
	var code=$("#otp_code").val();
	if(""!=code && "手机令牌"!=code){
//		$("#otp_code").css("color","#000000");
	}
	$("#otp_code").select();
}
function leaveOTPCode(){
	var code=$("#otp_code").val();
	if(""==code|| "手机令牌"==code){
		$("#otp_code").val("手机令牌");
		$("#otp_code").css("color","#B7B7B9");
	}
}

//公共页面oauth.jsp
//输入用户名密码后，如果启用OTP但没有绑定。add for otp验证短信验证码，如果正确可以完成绑定
function bind (userName,smsCode) {//201704
	   if(userName=="") {
	   		$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 未指定用户");
		   return;
	   }else if(""==smsCode){
	   		$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 请输入短信验证码");
		   return;
	   }else {
	   		$.ajax(	'./userBind.do',
				{
					type:"POST",
					data:{
						userName: userName,
						smsCode: smsCode
					},
					dataType:"json",
					success : function(data,status,xhr) {
						//window.location.href = data;
						var json = data;
						//alert("json:"+json.success);
	                	if(true == json.success){
	                		alert("Bind OK!");
	                    }
	                    else{
	                    	alert("Bind Error!");
	                    }
					},
					error : function(xhr,status,error) {
//						alert("json error:"+json.success);
						$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 系统服务异常");
						//$("#code_img").attr("src","/iaaa/servlet/DrawServlet?Rand="+Math.random());
					}
				});
	   }
}
/**
 * 验证用户名密码登录跳转到otpBind1.jsp
 */
function gotoOTPBind () {
	if($("#user_name").val()==""/* || $("#user_name").val()=="学号/职工号/北大邮箱"*/) { 
     	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 账号不能为空");
     	$("#user_name").focus();
   }else if($("#password").val()==""/* ||$("#password").val()=="密码"*/) { 
   		$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 密码不能为空");
     	$("#password").focus();
   }
   else if($("#code_area:visible").length>0 && 
   	($("#valid_code").val()=="" /* ||	$("#valid_code").val()=="验证码"*/)) { 
     	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 验证码不能为空");
     	$("#valid_code").focus();
   }
   else { 
   		if($("#remember_check")[0].checked==true){
   			setCookie("userName",$("#user_name").val());
   			setCookie("remember","true");
   		}
   		else{
   			delCookie("userName");
   			delCookie("remember");
   		}
   		$("#msg").text("正在验证身份...");
   		$.ajax(	'/iaaa/auth4Bind.do',
			{
				type:"POST",
				data:{
					userName: $("#user_name").val(),
					password: $("#password").val(),
					randCode: $("#valid_code").val()
				},
				dataType:"json",
				success : function(data,status,xhr) {
					var json = data;
                	if(true == json.success)
                    	window.location.href = "./pageFlows/identity/otpBind/otpBindO.jsp";
                    else{
                    	//$("#msg").text(json.errors.msg);
                    	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.errors.msg);
                    	$("#code_img")[0].src="/iaaa/servlet/DrawServlet?Rand="+Math.random();
                    	if("账号未激活"==json.errors.msg){
                    		window.location.href = "https://iaaa.pku.edu.cn/iaaa/activateAccount.jsp?Rand="+Math.random()+"&activeCode="+json.activeCode;
                    	}
                    	/*else if("用户名错误"==json.errors.msg){
                    		$("#user_name").select();
                    	}
                    	else if("密码错误"==json.errors.msg){
                    		$("#password").select();
                    		if(true==json.showCode){
                    			$("#code_area").show();
                    		}
                    	}*/
                    	else if("用户名或密码错误"==json.errors.msg){
                    		$("#user_name").select();
                    		if(true==json.showCode){
                    			$("#code_area").show();
                    		}
                    	}
                    	else if("验证码错误"==json.errors.msg){
                    		$("#code_area").show();
                			$("#valid_code").select();
                    	}
                    }
				},
				error : function(xhr,status,error) {
					//$("#msg").text("查询时出现异常");
					$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 系统服务异常");
					$("#code_img").attr("src","/iaaa/servlet/DrawServlet?Rand="+Math.random());
				}
			});
   }
}
function proxy2OTPBind () {
	if($("#user_name").val()=="" /*|| $("#user_name").val()=="学号/职工号/北大邮箱"*/) { 
     	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 账号不能为空");
     	$("#user_name").focus();
   }else { 
   		if($("#remember_check")[0].checked==true){
   			setCookie("userName",$("#user_name").val());
   			setCookie("remember","true");
   		}
   		else{
   			delCookie("userName");
   			delCookie("remember");
   		}
   		$("#msg").text("正在验证身份...");
   		$.ajax(	'/iaaa/authProxy4Bind.do',
			{
				type:"POST",
				data:{
					userName: $("#user_name").val(),
					proxyAppId: $("#proxyAppId").val(),
					grantToken: $("#grantToken").val(),
					_rand:Math.random()
				},
				dataType:"json",
				success : function(data,status,xhr) {
					var json = data;
                	if(true == json.success)
                    	window.location.href = "./pageFlows/identity/otpBind/otpBindO.jsp";
                    else{
                    	$("#msg").html("<i class=\"fa fa-minus-circle\"></i> "+json.errors.msg);
                    	$("#code_img")[0].src="/iaaa/servlet/DrawServlet?Rand="+Math.random();
                    	if("账号未激活"==json.errors.msg){
                    		window.location.href = "https://iaaa.pku.edu.cn/iaaa/activateAccount.jsp?Rand="+Math.random()+"&activeCode="+json.activeCode;
                    	}
                    	else if("用户名或密码错误"==json.errors.msg){
                    		$("#user_name").select();
                    	}
                    }
				},
				error : function(xhr,status,error) {
					//$("#msg").text("查询时出现异常");
					$("#msg").html("<i class=\"fa fa-minus-circle\"></i> 系统服务异常");
					$("#code_img").attr("src","/iaaa/servlet/DrawServlet?Rand="+Math.random());
				}
			});
   }
}

function resetInput(event){
	var input = $(event.target).parent().prev("input");
	input.val("");
	$(event.target).parent(".i-clear").hide();
	input.focus();
}
function switch2LoginPanel(){
	$("#qrcode_panel_top_bar").removeClass("current");
	$("#login_panel_top_bar").addClass("current");
	$("#qrcode_panel").hide();
	$("#login_panel").show();
	stopCheck();
	if(window.innerWidth<=480){// 处理背景图
		$(".mid").css("height","");
		$(".mid").css("background-position","");
	}
}
function switch2QRPanel(){
	$("#login_panel_top_bar").removeClass("current");
	$("#qrcode_panel_top_bar").addClass("current");
	$("#login_panel").hide();
	$("#qrcode_panel").show();
	$("#qrcode_panel img").attr("src","/iaaa/genQRCode.do?userName=&_rand="+Math.random());
	startCheck();
	if(window.innerWidth<=480){ // 处理背景图
		$(".mid").css("height","490px");
		$(".mid").css("background-position","center 280px");
	}
}
