$(function() {
	$.ajax({
		url: 'http://localhost:3000/code',
		type: 'get',
		dataType: 'json',
		data: '',
		success: function(res) {
			console.log(res.data);
			$('#code').val(res.data);
		}
	})
})