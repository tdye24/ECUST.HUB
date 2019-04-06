$(function() {
	// console.log(window.location.search);
	let username = decodeURI(window.location.search.split('=')[1].split('&&')[0]);
	let token = (window.location.search).split('=')[2];
	$('#firstPassword').blur(function() {
		var firstPassword = $('#firstPassword').val();
		var secondPassword = $('#secondPassword').val();
		if(firstPassword != '' && secondPassword != '') {
			if(firstPassword != secondPassword) {
				alert('两次输入密码不一致！');
				$('#firstPassword').val('');
				$('#secondPassword').val('');
			}
		}
		
	});
	$('#secondPassword').blur(function() {
		var firstPassword = $('#firstPassword').val();
		var secondPassword = $('#secondPassword').val();
		if(firstPassword != '' && secondPassword != '') {
			if(firstPassword != secondPassword) {
				alert('两次输入密码不一致！');
				$('#firstPassword').val('');
				$('#secondPassword').val('');
			}
		}
	});
	$('#submit1').click(function() {
		if($('#firstPassword').val() == ''||$('#secondPassword').val() == '') {
			alert('请输入新密码！');
			return false;
		} else {
			let new_password = $('#firstPassword').val();
			let obj = {
				username: username,
				new_password: new_password,
				token: token
			}
			$.ajax({
				url: 'http://localhost:3000/update/reset',
				type: 'post',
				dataType: 'json',
				data: obj,
				success: function(result) {
					if(result.state == 'success') {
						$('#resetpassword').css('display', 'none');
						$('#submit1').css('display', 'none');
						$('#complete').css('display', 'block');
						setTimeout(function() {
							window.location.href = '../index.html';
						}, 2000);
					} else if(result.state == 'fail') {
						$('#resetpassword').css('display', 'none');
						$('#submit1').css('display', 'none');
						$('#fail').css('display', 'block');
						setTimeout(function() {
							window.location.href = '../index.html';
						}, 2000);
					}
				}
			})
		}
	});		
});
