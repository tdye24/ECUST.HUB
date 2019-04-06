$(function() {
	$('#username').focusin(function() {
		$('#username_valid').html('');
	})
	$('#username').focusout(function() {
		let username = $('#username').val();
		let pattern = /(^\s+)|(\s+$)/g
		if(username.length === 0 ) {
			alert('用户名不能为空！');
			$('#username').val('');
			return false;
		} else if(pattern.test(username)||username.indexOf(' ')!=-1) {
			alert('用户名中不能包含空格！');
			$('#username').val('');
			return false;
		} else {
			$.ajax({
				url: `http://localhost:3000/check/name`,
				type: 'get',
				data: `username=${username}`,
				dataType: 'json',
				success: function(result) {
					if(result.valid) {
						$('#username_valid').html('√');
					} else {
						$('#username_valid').html('用户名已存在！');
						$('#username').val('');
					}

				}
			})
		}
		
	})
	$('#IDCard').focusin(function() {
		$('#IDCard').val(``);
	});
	$('#IDCard').blur(function() {
		var IDCard = $('#IDCard').val();
		var isIDCard = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
		if(!isIDCard.test(IDCard)) {
			alert('身份证号的格式不正确，请检查后再输入！');
			$('#IDCard').val('');
			return false;
		}
	});
	$('#telephone').focusin(function() {
		$('#telephone').val('');
	})
	$('#telephone').focusout(function() {
		var tel = $('#telephone').val();
		var isTel = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,3,5-9]))\d{8}$/;
		if(!isTel.test(tel)) {
			alert('手机号的格式不正确，请检查后再输入！');
			$('#telephone').val('');
			return false;
		}
	})
	$('#email').focusout(function() {
		var email = $('#email').val();
		var isemail = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
		if (email.length > 25){
		    alert("长度太长!");
		    $('#email').val('');
		    return false
		}
		if (!isemail.test(email)){
		    alert("不是邮箱");
		    $('#email').val('');
		    return false;
		}
	});

	$('#secondPassword').blur(function() {
		var firstPassword = $('#firstPassword').val();
		var secondPassword = $('#secondPassword').val();
		if(firstPassword != secondPassword) {
			alert('两次输入密码不一致！');
			$('#firstPassword').val('');
			$('#secondPassword').val('');
		}
	});
	$('#signup').click(function() {
		if($('#username').val()&&$('#campusCardId').val()&&$('#email').val()&&$('#telephone').val()&&$('#IDCard').val()&&$('#firstPassword').val()&&$('#secondPassword').val()) {
			let username = $('#username').val();
			let campusCardId = $('#campusCardId').val();
			let sex = $('#sex option:selected').val();
			let email = $('#email').val();
			let motto = $('#motto').val();
			let telephone = $('#telephone').val();
			let IDCard = $('#IDCard').val();
			let password = $('#firstPassword').val();
			let data = {
				username: username,
				campusCardId: campusCardId,
				sex: sex,
				email: email,
				motto: motto,
				telephone: telephone,
				IDCard: IDCard,
				password: password,
			};
			$.ajax({
				url: 'http://localhost:3000/signUp',
				type: 'post',
				dataType: 'json',
				data: data,
				success: function(result) {
					if(result.status == 'success') {
						location.href = '../index.html';
					} else {
						alert('注册发生异常！');
					}
				},
				error: function() {
					alert('异常！');
				},

			});
			alert('注册成功！');
		} else {
			alert('请正确填写注册信息！');
		}
	});
});

