function base64_decode(str)
{
    var base64DecodeChars = [
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
            52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
            -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
            15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
            -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
            41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
        ];
    var c1, c2, c3, c4;
    var i, j, len, r, l, out;
 
    len = str.length;
    if (len % 4 != 0) {
        return '';
    }
    if (/[^ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\+\/\=]/.test(str)) {
        return '';
    }
    if (str.charAt(len - 2) == '=') {
        r = 1;
    }
    else if (str.charAt(len - 1) == '=') {
        r = 2;
    }
    else {
        r = 0;
    }
    l = len;
    if (r > 0) {
        l -= 4;
    }
    l = (l >> 2) * 3 + r;
    out = new Array(l);
 
    i = j = 0;
    while (i < len) {
        // c1
        c1 = base64DecodeChars[str.charCodeAt(i++)];
        if (c1 == -1) break;
 
        // c2
        c2 = base64DecodeChars[str.charCodeAt(i++)];
        if (c2 == -1) break;
 
        out[j++] = String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
 
        // c3
        c3 = base64DecodeChars[str.charCodeAt(i++)];
        if (c3 == -1) break;
 
        out[j++] = String.fromCharCode(((c2 & 0x0f) << 4) | ((c3 & 0x3c) >> 2));
 
        // c4
        c4 = base64DecodeChars[str.charCodeAt(i++)];
        if (c4 == -1) break;
 
        out[j++] = String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return toUTF16(out.join(''));
}
 
function toUTF8(str)
{
    if (str.match(/^[\x00-\x7f]*$/) != null) {
        return str.toString();
    }
    var out, i, j, len, c, c2;
    out = [];
    len = str.length;
    for (i = 0, j = 0; i < len; i++, j++) {
        c = str.charCodeAt(i);
        if (c <= 0x7f) {
            out[j] = str.charAt(i);
        }
        else if (c <= 0x7ff) {
            out[j] = String.fromCharCode(0xc0 | (c >>> 6),
                                         0x80 | (c & 0x3f));
        }
        else if (c < 0xd800 || c > 0xdfff) {
            out[j] = String.fromCharCode(0xe0 | (c >>> 12),
                                         0x80 | ((c >>> 6) & 0x3f),
                                         0x80 | (c & 0x3f));
        }
        else {
            if (++i < len) {
                c2 = str.charCodeAt(i);
                if (c <= 0xdbff && 0xdc00 <= c2 && c2 <= 0xdfff) {
                    c = ((c & 0x03ff) << 10 | (c2 & 0x03ff)) + 0x010000;
                    if (0x010000 <= c && c <= 0x10ffff) {
                        out[j] = String.fromCharCode(0xf0 | ((c >>> 18) & 0x3f),
                                                     0x80 | ((c >>> 12) & 0x3f),
                                                     0x80 | ((c >>> 6) & 0x3f),
                                                     0x80 | (c & 0x3f));
                    }
                    else {
                       out[j] = '?';
                    }
                }
                else {
                    i--;
                    out[j] = '?';
                }
            }
            else {
                i--;
                out[j] = '?';
            }
        }
    }
    return out.join('');
}
 
function toUTF16(str)
{
    if ((str.match(/^[\x00-\x7f]*$/) != null) ||
        (str.match(/^[\x00-\xff]*$/) == null)) {
        return str.toString();
    }
    var out, i, j, len, c, c2, c3, c4, s;
 
    out = [];
    len = str.length;
    i = j = 0;
    while (i < len) {
        c = str.charCodeAt(i++);
        switch (c >> 4) {
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
            // 0xxx xxxx
            out[j++] = str.charAt(i - 1);
            break;
            case 12: case 13:
            // 110x xxxx   10xx xxxx
            c2 = str.charCodeAt(i++);
            out[j++] = String.fromCharCode(((c  & 0x1f) << 6) |
                                            (c2 & 0x3f));
            break;
            case 14:
            // 1110 xxxx  10xx xxxx  10xx xxxx
            c2 = str.charCodeAt(i++);
            c3 = str.charCodeAt(i++);
            out[j++] = String.fromCharCode(((c  & 0x0f) << 12) |
                                           ((c2 & 0x3f) <<  6) |
                                            (c3 & 0x3f));
            break;
            case 15:
            switch (c & 0xf) {
                case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                // 1111 0xxx  10xx xxxx  10xx xxxx  10xx xxxx
                c2 = str.charCodeAt(i++);
                c3 = str.charCodeAt(i++);
                c4 = str.charCodeAt(i++);
                s = ((c  & 0x07) << 18) |
                    ((c2 & 0x3f) << 12) |
                    ((c3 & 0x3f) <<  6) |
                     (c4 & 0x3f) - 0x10000;
                if (0 <= s && s <= 0xfffff) {
                    out[j++] = String.fromCharCode(((s >>> 10) & 0x03ff) | 0xd800,
                                                  (s         & 0x03ff) | 0xdc00);
                }
                else {
                    out[j++] = '?';
                }
                break;
                case 8: case 9: case 10: case 11:
                // 1111 10xx  10xx xxxx  10xx xxxx  10xx xxxx  10xx xxxx
                i+=4;
                out[j++] = '?';
                break;
                case 12: case 13:
                // 1111 110x  10xx xxxx  10xx xxxx  10xx xxxx  10xx xxxx  10xx xxxx
                i+=5;
                out[j++] = '?';
                break;
            }
        }
    }
    return out.join('');
}



function showRealName(userInfoString){
	
	layer.msg('账号已授权，请完成实名后游戏',{icon:1,tips:[2,'#C30F0B']});
	
	try{
		var userInfo = JSON.parse(base64_decode(userInfoString));
	}catch(e){
		return;
	}
	
	$('#login-tab').hide();
	$(".login-box-type").hide();
	$(".login-submit").hide();
	$(".registerCheckName").show();	
	UserInfo.data = userInfo;
	
}

$(document).on("submit","#subform",function(){
	var postUrl=$(this).prop("action");
	var dataParam=$(this).serialize();
	var thisForm=$(this);
	dataParam.redirect = redirect;
	ajaxRequestData(postUrl,dataParam,"json",function(respData){
		if(thisForm.find("#checkCodeImg").length>0){
			thisForm.find("#checkCodeImg").click();
		}
		
		if(typeof(respData.data.data) != "undefined"){
			if(typeof(respData.data.data.needActive) != "undefined"){
				if(respData.status==true && respData.data.data.needActive==1){
					$('#login-tab').hide();
					$('.login-box-type').hide();
					$(".login-submit").hide();
					$('.inviteCodePanel').show();	
					UserInfo.data = respData.data.data;
					layer.msg(respData.data.data.activeTips,{icon:2});
					return false;
				}
			}
		}
		
		if(respData.status==false){
			getLocalStorageCleanPwd();
			window.localStorage.clear();
			layer.msg(respData.message,{icon:2});
			return false;
		}else{
			try{
				if(openSNSObject.userBindPhone == true){
					if(typeof(respData.data.data.userData.mobile) != "undefined"){
						if(respData.data.data.userData.mobile==""){
							$(".box-back").hide();
							$('#login-tab').hide();
							$(".login-box-type").hide();
							$(".registerBindPhone").show();
							UserInfo.data = respData.data.data.userData;
							return false;		
						}	
					}
				}
			}catch(e){}
			try{
				if(respData.data.data.checkRealName!=undefined && respData.data.data.checkRealName!=0){
					$('#login-tab').hide();
					$(".login-box-type").hide();
					$(".login-submit").hide();
					$(".registerCheckName").show();	
					UserInfo.data = respData.data.data.userData;
					return false;
				}
				if(respData.data.data.id=="40040" && respData.data.data.checkRealName==2){
					$('#login-tab').hide();
					$(".login-box-type").hide();
					$(".login-submit").hide();
					$(".registerCheckName").show();	
					UserInfo.data = respData.data.data.userData;
					return false;
				}
			}catch(e){}
			
			if(respData.data.message!="" && respData.data.message!=undefined){
							
				if(respData.data.tourl!="" && respData.data.tourl!=undefined){
					//parent.closeFrame(respData.data.message,'2','1',respData.data.tourl,0);
					window.parent.postMessage({action:"closeFrame",s1:respData.data.message,s2:"2",s3:"1",s4:respData.data.tourl,s5:0},'*');
				}else if(respData.data.needReload == "1"){
					//parent.closeFrame(respData.data.message,'2','1',"reload",0);
					window.parent.postMessage({action:"closeFrame",s1:respData.data.message,s2:"2",s3:"1",s4:"reload",s5:0},'*');
				}
				return false;
			}else{
				//parent.closeFrame("操作成功",'2','1','',1);
				var postParams = {action:"closeFrame",s1:"操作成功",s2:"2",s3:"1",s4:"",s5:1};
				if(respData.data.data.successUrl!="" && respData.data.data.successUrl!=undefined){
					postParams.successUrl = respData.data.data.successUrl;
				}
				window.parent.postMessage(postParams,'*');
				mobile=respData.data.data.userData.mobile;
				userphone=respData.data.data.userData.username;
				CALL_DATASET_USERSESSION(respData.data.data.userData.uid,respData.data.data.userData.username);
				setLocalStorage("localUserPhone", (mobile.length==userphone.length)?userphone:mobile);
				setLocalStorage("localUserName", respData.data.data.userData.username);
				setLocalStorage("localAuthToken", respData.data.data.authToken);
				if(respData.data.data.successUrl!="" && respData.data.data.successUrl!=undefined){
					layer.load(2);
					var toUrl = respData.data.data.successUrl;
					setTimeout(function(){
						location.href = toUrl;
					},100)
					
				}
				
			}
		}
	});
	return false;
});
function ajaxRequestData(url,params,dataType,callback){
	var rebackObj=new Object();
	rebackObj.status=false;
	rebackObj.data='';
	rebackObj.message="";
	if(url=='' || url==undefined){
		rebackObj.msg="请求接口地址为空";
		return callback(rebackObj);
	}
	if(dataType=="" || dataType==undefined){
		dataType="json";
	}
	//验证token不显示load
	if(url.indexOf('ckTokenLogin') != -1){
	}else{
		layer.load(2);
	}
	$.ajax({
		type:"POST",
		url:url,
		data:params,
		dataType:dataType,
		success:function(respData){
			layer.closeAll();
			if(dataType=="html" || dataType=="text"){
				rebackObj.data = respData;
				rebackObj.status = true;
				return callback(rebackObj);
			}
			if(!respData.hasOwnProperty('status') || respData.status == false ){
				if(rebackObj.message==undefined || respData.message=='' || !respData.hasOwnProperty('message')){
					rebackObj.message = '请求接口失败';
				}else{
					rebackObj.message=respData.message;
				}
				return callback(rebackObj);
			}
			rebackObj.data = respData;
			rebackObj.status = true;
			return callback(rebackObj);
		},
		error:function(){
			layer.closeAll();
			rebackObj.status=false;
			rebackObj.message="接口请求失败";
			return callback(rebackObj);
		}
		
	});
}
function checkPassword(pwdinput) {
	var maths, smalls, bigs, corps, cat, num;
	var str = $(pwdinput).val();
	var len = str.length;

	if (len == 0) return 0;
	cat = /.*[\u4e00-\u9fa5]+.*$|\s/;
	if (cat.test(str)) {
		return -1;
	}
	cat = /\d/;
	var maths = cat.test(str);
	cat = /[a-z]|[A-Z]/;
	var smalls = cat.test(str);
	cat=/\W/;
	var strongs=cat.test(str);
	var num = maths + smalls + strongs;
	if (len < 6) { return 0; }

	if (len >= 6) {
		if (num == 1) return 1;
		if (num == 2) return 2;
		if (num == 3) return 4;
	}
}
//手机号码检测
function checkPhone(phone){
	var reg = /^1[3-9]\d{9}$/;
	var rebackResult=new Object();
	rebackResult.status=false;
	rebackResult.msg="";
	if((!reg.test(phone)) || phone.length!=11){
		rebackResult.msg="手机号码格式错误";
		return rebackResult;
	}
	rebackResult.status=true;
	return rebackResult;
}
//发送验证码
function sendSMSCode(o,obj,classname){
	if($(o).hasClass("noclick")){
		return false;
	}
	var obj=$(o).parent().parent().find("#"+obj);
	var phone=obj.val();
	var checkUPhone=checkPhone(phone);
	var sendType = obj.data("sendtype");
	if(checkUPhone.status==false){
		layer.msg(checkUPhone.msg,{icon:2});
		$(".getcode-btn").addClass('noclick');
		return false;
	}
	if (!$(o).hasClass('dis_rActcode')) {
		$(o).addClass('dis_rActcode '+classname);
		get_verify_code(obj,classname,function(){
			ResetsendPhoneCode(o,classname,60);
		});
	}
}
var resetSpcThread = null;
function ResetsendPhoneCode(obj,classname,times){
	clearTimeout(resetSpcThread);
	if(times > 0){
		times -- ;
		$(obj).addClass("dis_rActcode "+classname);
		$(obj).val("还剩"+times+"秒");
		resetSpcThread = setTimeout(function(){ResetsendPhoneCode(obj,classname,times);},1000);
	}
	else{
		$(obj).removeClass("dis_rActcode "+classname);
		$(obj).val("发送验证码");
	}
}

function get_verify_code(obj,classname,func)
{
	var phone = $.trim(obj.val());
	if (func != null) {
		func.call(this);
	}
	var url=obj.data("url");
	var sendType=obj.data("sendtype");
	var urlData={phone:phone,sendType:sendType};
	ajaxRequestData(url,urlData,"json",function(rebackData){
		if(rebackData.status==false){
			layer.msg(rebackData.message,{icon:2});
		}
	});
}
var scode_interval = null;
$(document).on("click",".change-login",function(){
	var todom=$(this).data("todom");
	var logintype=$(this).data("logintype");
	$("input[name='loginType']").val(logintype);
	$('.login-box-type').hide();
	$(".login-box-type."+todom).show();
	$(".login-submit").show();
	localStorage.setItem('lastLoginType',logintype);
	try{clearInterval(scode_interval)}catch(e){console.log(e.message)};
});
$(document).on("click",".change-login-code",function(){
	var todom=$(this).data("todom");
	var logintype=$(this).data("logintype");
	$("input[name='loginType']").val(logintype);
	$('.login-box-type').hide();
	$(".login-box-type."+todom).show();
	$(".login-submit").hide();
	localStorage.setItem('lastLoginType',3);
	createQRCode();
	
});
//生成二维码图片
function createQRCode(){
	try{clearInterval(scode_interval)}catch(e){}
	var url="/open/qrUrlcreate";
	var timestap = new Date().getTime();
	
	var productCode = '';
	if($(".productCode").length > 0){
		productCode= $(".productCode").val();
	};
	
	var urlData={logintype:3,productCode:productCode,t_s:timestap,referrer:pageconfig.referrer};
	ajaxRequestData(url,urlData,"json",function(rebackData){
		if(rebackData.status==false){
			layer.msg(rebackData.message,{icon:2});
		}else{
			var qrurl = rebackData.data.data.qrurl;
			var token = rebackData.data.data.token;
			if(qrurl=="" || qrurl== undefined || token=="" || token == undefined){
				layer.msg("获取登录二维码失败",{icon:2});
				return false;
			}else{
				var imgUrl ='/open/qrImgCreate?data='+qrurl;
				$(".qrbox").show();
				$("#qrbox #qrimg").prop("src",imgUrl);
				$(".qr-fail-box").hide();
				$(".qr-success-box").hide();
				scode_interval = setInterval(function(){checkTokenLogin(token);},1000);
			}
		}
	});
}
function checkTokenLogin(token){
	var url="/open/ckTokenLogin";
	var timestap = new Date().getTime();
	var urlData={logintype:3,t_s:timestap,token:token,redirect:redirect,successUrl:redirect};
	ajaxRequestData(url,urlData,"json",function(rebackData){
		if(rebackData.status==true){
			if(rebackData.data.data.code==101){
				$(".qr-fail-box .qr-fail-p").html(rebackData.data.data.message);
				$(".qr-fail-box").show();
				$(".qr-success-box").hide();
				try{clearInterval(scode_interval)}catch(e){}
			}else if(rebackData.data.data.code==200){
				$(".qr-success-box .qr-success-user").html(rebackData.data.data.username);
				$(".qr-fail-box").hide();
				$(".qr-success-box").show();
				$(".qrimg-box").hide();
				try{clearInterval(scode_interval)}catch(e){}
				setTimeout(function(){
									
					var redirecAction = redirect == '' || redirect == 'undefined' ? 'reload': redirect;
					window.parent.postMessage({action:"closeFrame",s1:"操作成功",s2:"2",s3:"1",s4:redirecAction,s5:1},'*');

					if(rebackData.data.data.successUrl!="" && rebackData.data.data.successUrl!=undefined){
						layer.load(2);
						location.href = rebackData.data.data.successUrl;
					}
					
				},2000)
			}
		}
	});
}
$(document).on('keyup','#dataphone',function(){
	var val = $(this).val();
	var checkUPhone=checkPhone(val);
	if(checkUPhone.status==false){
		$(".getcode-btn").addClass('noclick');
	}else{
		$(".getcode-btn").removeClass('noclick');
	}
});
$(document).on('blur','#dataphone',function(){
	var val = $(this).val();
	var checkUPhone=checkPhone(val);
	if(checkUPhone.status==false){
		$(".getcode-btn").addClass('noclick');
	}else{
		$(".getcode-btn").removeClass('noclick');
	}
});
$(document).on("click",".box-close",function(){
	try{clearInterval(scode_interval)}catch(e){}
	//parent.closeFrame('关闭弹框','2','1','',1);
	window.parent.postMessage({action:"closeFrame",s1:"关闭弹框",s2:"2",s3:"1",s4:"",s5:1},'*');
});
$(document).on("focus blur",".form-item-input",function(e){
	if(e.type == "focusin"){
		$(this).parent().addClass("focus");
		return false;
	}
	if(e.type == "focusout"){
		$(this).parent().removeClass("focus");
		return false;
	}
});
$(document).on("click",".qr-fail-link",function(){
	createQRCode();
});
function setUrlParam(url, param, value) {
	var query = url.split('?')

	var p = new RegExp("(^|)" + param + "=([^&]*)(|$)");
	if (p.test(query[1])) {
		var firstParam = query[1].split(param)[0];
		var secondParam = query[1].split(param)[1];
		if (secondParam.indexOf("&") > -1) {
			var lastPraam = secondParam.substring(secondParam.indexOf('&')+1);
			return query[0] + '?' + firstParam + param + '=' + value + '&' + lastPraam;
		} else {
			if (firstParam) {
				return query[0] + '?' + firstParam + param + '=' + value;
			} else {
				return query[0] + '?' + param + '=' + value;
			}
		}
	} else {
		if (query[1] == undefined || query[1] == '') {
			return query[0] + '?' + param + '=' + value;
		} else {
			return query[0] + '?' + query[1] + '&' + param + '=' + value;
		}
	}
}
//iframe弹框
$(document).on("click",".openDialogIframe",function(){
	var url=$(this).attr('url');
	var title="页面弹框";
	if(url==''){
		layer.alert('访问地址错误',{icon:2});
		return false;
	}
	var height='600px';
	var width='900px';
	if($(this).attr('height')){
		if($(this).attr("height")=="auto"){
			var windowHeight=$(window).height();
			height=windowHeight*0.8;
			height=height+"px";
		}else{
			height=$(this).attr('height');
		}
	}
	if($(this).attr('width')){
		width=$(this).attr('width');
	}
	if($(this).attr('title')){
		title=$(this).attr('title');
	}
	var classname="";
	if($(this).data("classname")){
		classname=$(this).data("classname");
	}
	globalLayerIndex=layer.open({
	    type: 2,
	    area: [width,height],
	    fix: false, //不固定
	    title:false,
	    maxmin:false,
	    closeBtn: false,
	    shadeClose: true,
	    skin:classname,
	    content: setUrlParam(url, 'isFrame', 1)
	});
	if(typeof($(this).attr('layer-full')) != 'undefined'){
		layer.full(globalLayerIndex)
	}
});

//var authLocalName='';
jQuery(document).ready(function(e) {
	
	if(typeof(openSNSObject) == "object"){
		if(openSNSObject.signParams == "fd509be38063bb98b1726ec2650a0c9b"){
			return false;	
		}	
	}
	
	var startUpLayer = layer.load(2);
	
    console.log("jQuery.docoment.ready");
	var loginTypePhone = $('div.login-type-phone').css("display");
	var loginTypeAccount = $('div.login-type-account').css("display");
	console.log("loginTypePhone=",loginTypePhone);
	console.log("loginTypeAccount=",loginTypeAccount); 
	var localUserPhone = window.localStorage.getItem("localUserPhone");
	var localUserName = window.localStorage.getItem("localUserName");
	var localAuthToken = window.localStorage.getItem("localAuthToken");
	console.log("localUserPhone", localUserPhone);
	console.log("localUserName=", localUserName);
	console.log("localAuthToken=", localAuthToken);
	
	if(loginTypeAccount == "block"){
		if(typeof(localUserName)=="string"){
			if(localUserName.length > 3){
				$("input[name=account]").val(localUserName);
				$("input[name=password]").val("******");
			}
			if(localUserName.length > 3){
				//authLocalName = localUserName;
				loadAutoLoginLayer(localUserName,3);	
			}
		}
	}else if(loginTypePhone == "block"){
		if(typeof(localUserPhone)=="string"){
			if(localUserPhone.length >= 10){
				$("input[name=phone]").val(localUserPhone);
				$("input[name=pcode]").val("******");
			}
			if(localUserPhone.length >= 10){
				//authLocalName = localUserPhone;
				loadAutoLoginLayer(localUserPhone,3);	
			}
		}		
	}
	if(typeof(localAuthToken)=="string"){
		if(localAuthToken.length > 100){
			$('form#subform').append('<input type="hidden" name="localAuthToken">');
			$('input[name=localAuthToken]').val(localAuthToken);
		}
	}
	
	layer.close(startUpLayer);
});

function loadAutoLoginFormSubmit(){
	jQuery("form#subform").submit();
}

function loadAutoLoginLayer(authLocalName,seconds){
	var autoLoginLayer = layer.open({
		closeBtn: false,
		skin: "auto-login",		
		content: '<div class="tipsArea"><i></i>账号：'+authLocalName+'</div><div class="tipsFont"><span class="authIcon"></span>自动登录中 <span id="seconds">'+seconds+'</span>秒</div>',
		btn:["切换账号"],
		area:['240px','150px'],
		title:'',
		yes: function(e){
			layer.close(autoLoginLayer);
			window.clearInterval(seconds_timer);
			getLocalStorageClean();
		},
		success: function(e){
			console.log("layer.open.success");
			$('div.layui-layer-title').css({backgroundColor: "white"});	
			$('div.layui-layer-btn').children('a').removeClass("layui-layer-btn0").addClass('cancalAutoLogin');
		}
	});
	var seconds_timer = window.setInterval(function(){
		seconds -= 1;
		if(seconds < 1){
			window.clearInterval(seconds_timer);
			loadAutoLoginFormSubmit();
		}
		document.getElementById('seconds').innerHTML=seconds;	
	}, 1000);
}

function getLocalStorageClean(){
	try{
		$("input[name=account]").val("");
		$("input[name=password]").val("");
		$("input[name=phone]").val("");
		$("input[name=pcode]").val("");
	}catch(e){
		console.log(e);	
	}
	
	try{
		window.localStorage.removeItem("localUserPhone");
		window.localStorage.removeItem("localUserName");
		window.localStorage.removeItem("localAuthToken");
	}catch(e){}
}

function getLocalStorageCleanPwd(){
	try{
		//$("input[name=account]").val("");
		$("input[name=password]").val("");
		//$("input[name=phone]").val("");
		$("input[name=pcode]").val("");
	}catch(e){
		console.log(e);	
	}
}

function setLocalStorage(key, value){
	try{
		window.localStorage.setItem(key, value);
	}catch(e){
		console.log(e);	
	}
}

function CALL_DATASET_USERSESSION(uid, username){
	console.log(uid);
	
	console.log(username);
}


function show_web_agreement(agreement){
	var obj = jQuery(agreement);

	console.log(obj.data('href'));
	
	layer.open({
		title:"",
		skin:"agreementOpen",
		area:["100%","100%"],
		type: 2,
		content: obj.data('href'),
	})	
}



function doAction(action,data){
	var params = new Object();
	params.action = action;
	params.data = data;
	try{
		window.bridge.callback(JSON.stringify(params));
	}catch(e){
		console.log(e);	
	}
	console.log(action);
	console.log(data);
}

$(document).on('mousedown','.moveWindow',function(){
	try{
		doAction('moveWindow',{});
	}catch(e){
		console.log(e);	
	}
})



$(document).on('keyup','input[name=pwd]',function(res){
	text=($(this).val());
	regex=new RegExp(/[\u4e00-\u9fa5]+/g);
    rrr=text.match(regex);
	console.log(rrr);
	if(rrr){
		layer.msg('密码不能使用中文',{icon:2,tips:[2,'#C30F0B']});	
		$(this).val(text.replace(regex, ''));
	}
})