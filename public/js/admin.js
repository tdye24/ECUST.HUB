$(function() {
	var code = createcode();
	$('#vert-code').html(code);
	$('#login').click(function() {
		let adminame = $('#adminame').val();
		let password = $('#password').val();

		var input_code = $('#input-code').val().toUpperCase();   		
		var vert_code = code.toUpperCase();
		if(adminame.length <= 0 || password.length <= 0) {
			alert('请输入用户名和密码！');
			return false;
		} else if(input_code.length <= 0) {
			alert("请输入验证码！"); 
		} else if(input_code != vert_code ) { 
			alert("验证码输入错误！"); 
			code = createcode()
			$('#vert-code').html(code);
			$("#input-code").val('');
		} else {
			let data = { 
				'adminame': adminame, 
				'password': password,
			};
			$.ajax({
				url: 'http://localhost:3000/admin',
				type: 'post',
				dataType: 'json',
				data: data,
				success: function(result) {
					if(result.state == 'success') {
						location.href = '../data.html'
					} else {
						alert('用户名或密码错误！');
						$('#adminame').val('');
						$('#password').val('');
						$('#input-code').val('');
						code = createcode()
						$('#vert-code').html(code);
						$("#input-code").val('');
					}
				}
			});
		}      
	});
})

function createcode() {
	var code = '';
	var random = new Array(0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R',
 'S','T','U','V','W','X','Y','Z');
	for(var i = 0; i < 4; i++) {
		var index = Math.floor(Math.random()*62);
		code += random[index];
	}
	return code;
}
