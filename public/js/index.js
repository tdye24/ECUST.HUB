var code;
function createCode(){
	code = '';
	var codeLength = 4;
	var checkCode = document.getElementById("code"); 
	var random = new Array(0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R',
	 'S','T','U','V','W','X','Y','Z');
	for(var i = 0; i < codeLength; i++) {
		var index = Math.floor(Math.random()*62);
		code += random[index];
	}
	checkCode.innerHTML = code;
}


function validate() {
	let username = $('#username').val();
	let password = $('#password').val();

	var inputCode = $('#identifyingCode').val().toUpperCase();   		
	    code = code.toUpperCase();
	if(username.length <= 0 || password.length <= 0) {
		alert('请输入用户名和密码！');
		return false;
	} else if(inputCode.length <= 0) {
		alert("请输入验证码！"); 
	} else if(inputCode != code ) { 
		alert("验证码输入错误！"); 
		createCode();
		$("#identifyingCode").val('');
	} else {
		return true;
	}      
}


function login(){
	var username = $('#username').val();
	var password = $('#password').val();

	var data = { 
		'username': username, 
		'password':password,
	};

	if(validate()) {
		$.ajax({
			url: 'http://localhost:3000',
			type: 'post',
			dataType: 'json',
			data: data,
			success: function(result) {
				if(result.status == 'success') {
					// let info = JSON.stringify(result);
					// localStorage.setItem('info', info);
					location.href = `../search.html?username=${username}`;
				} else {
					alert('用户名或密码错误！');
					$('#username').val('');
					$('#password').val('');
					$("#identifyingCode").val('');
					createCode();
				}
			},
			error: function() {
				alert('异常！');
			},
		})
	}
}


var curIndex = 0;
var timeInterval = 3000; //时间间隔 单位毫秒 1000毫秒=1秒
var arr = new Array(); //播出图片的文件名
arr[0] = "images/logo/banner1.png";
arr[1] = "images/logo/banner2.png";
arr[2] = "images/logo/banner3.png";
setInterval(changeImg, timeInterval);
function changeImg() {
    var obj = document.getElementById("pic");
    if (curIndex == arr.length - 1) {
        curIndex = 0;
    } else
    {
        curIndex += 1;
    }
    obj.src = arr[curIndex];
}

$(function() {
	$.ajax({
		url: 'http://localhost:3000/checklogin',
		type: 'get',
		dataType: 'json',
		data: '',
		success: function(result) {
			// console.log(result);
			if(result.havelogan) {
				location.href = `./search.html?username=${result.username}`;
			}
		}
	})
});
