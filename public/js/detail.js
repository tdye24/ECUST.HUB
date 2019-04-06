$(function() {
	$.ajax({
		url: 'http://localhost:3000/checklogin',
		type: 'get',
		dataType: 'json',
		data: '',
		success: function(loginresult) {
			if(!loginresult.havelogan) {
				location.href = '../index.html';
			} else {
				let username = loginresult.username;
				$.ajax({
					url: 'http://localhost:3000/query/info',
					type: 'get',
					dataType: 'json',
					data: `username=${username}`,
					success: function(info) {
						$('#username').html('用户名：' + info.username);
						$('#point').html('积&emsp;分：' + info.point);
						if(info.sex == '男') {
							$('#myavatar').css('src', '../images/man.png');
						} else {
							$('#myavatar').css('src', '../images/woman.png');
						}
						let id = (window.location.search).split('=')[1];
						$.ajax({
							url: `http://localhost:3000/query/comment`,
							type: 'get',
							dataType: 'json',
							data: `id=${id}`,
							success: function(commentdata) {
								let background_svg_height = 700 + commentdata.length*124;
								if(background_svg_height <= 1700) {
									background_svg_height = 1700;
									footer_height = 1680;
								} else {
									footer_height = background_svg_height + 60;
								}
								$('#background').css("height", `${background_svg_height}px`);
								$('.footer').css("top", `${footer_height}px`);
								$.ajax({
									url: `http://localhost:3000/query/islike`,
									type: 'get',
									dataType: 'json',
									data: `username=${info.username}`,
									success: function(like_list) {
										let html = ``;
										for(let i = 0; i < commentdata.length; i ++) {
											if($.inArray(commentdata[i].id, like_list) < 0) {
												html += `<div style="position:relative;over-flow:hidden;font-size:20px; font-family:KaiTi;height:100px;width:1000px;background-color:white;border-radius:30px;border: 2px solid #a1a1a1"><p style="position:relative; margin: 5px 15px 5px 15px">${commentdata[i].text}</p><a href="./comment4more.html?parentnode=${commentdata[i].id}"><img id="${commentdata[i].id}" class="more" src="./images/more.png" style="width:33px;height:33px;position:absolute;right:160px; top:72px;" /></a><img id="${commentdata[i].id}" class="response" src="./images/response.png" style="width:20px;height:20px;position:absolute;right:120px; top:78px;" /><img id="${commentdata[i].id}" class="like" src="./images/like.png" style="width:20px;height:20px;position:absolute;right:75px; top:75px;" /><b style="position:absolute;right:25px; top:75px;">${commentdata[i].like_num}</b><b style="position:absolute;right:210px; top:75px;">${timeConvert(commentdata[i].time)}</b><a href="http://localhost:3000/otherusercenter.html?username=${commentdata[i].username}" style="text-decoration: none;position:absolute;right:435px; top:75px;">${commentdata[i].username}</a></div><div style="height:20px;"></div>`;
											} else {
												html += `<div style="position:relative;over-flow:hidden;font-size:20px; font-family:KaiTi;height:100px;width:1000px;background-color:white;border-radius:30px;border: 2px solid #a1a1a1"><p style="position:relative; margin: 5px 15px 5px 15px">${commentdata[i].text}</p><a href="./comment4more.html?parentnode=${commentdata[i].id}"><img id="${commentdata[i].id}" class="more" src="./images/more.png" style="width:33px;height:33px;position:absolute;right:160px; top:72px;" /></a><img id="${commentdata[i].id}" class="response" src="./images/response.png" style="width:20px;height:20px;position:absolute;right:120px; top:78px;" /><img id="${commentdata[i].id}" class="like" src="./images/liked.png" style="width:20px;height:20px;position:absolute;right:75px; top:75px;" /><b style="position:absolute;right:25px; top:75px;">${commentdata[i].like_num}</b><b style="position:absolute;right:210px; top:75px;">${timeConvert(commentdata[i].time)}</b><a href="http://localhost:3000/otherusercenter.html?username=${commentdata[i].username}" style="text-decoration: none;position:absolute;right:435px; top:75px;">${commentdata[i].username}</a></div><div style="height:20px;"></div>`;
											}
											$('#comment_area').html(html);
										}
										$("img.like").click(function(e) {
											let comment_id = $(e.target).attr("id");
											if($(e.target).attr("src") == "./images/like.png") {
												$(e.target).attr("src", "./images/liked.png");
												$(e.target).next().text(parseInt($(e.target).next().text()) + 1);				
												$.ajax({
													url: `http://localhost:3000/update/likeplus`,
													type: 'get',
													dataType: 'json',
													data: `username=${info.username}&&id=${comment_id}`,
													success: function(res) {

													}
												});
											} else {
												$(e.target).attr("src", "./images/like.png");
												$(e.target).next().text(parseInt($(e.target).next().text()) - 1);
												$.ajax({
													url: `http://localhost:3000/update/likeminus`,
													type: 'get',
													dataType: 'json',
													data: `username=${info.username}&&id=${comment_id}`,
													success: function(res) {

													}
												});			
											}
										});
										$('img.response').click(function(e) {
											let comment_id = $(e.target).attr("id");
											$('#reply_area').css('display', 'block');
											$('#reply_area_submit').off().on('click', function() {
												$.ajax({
													url: 'http://localhost:3000/update/reply',
													type: 'post',
													dataType: 'json',
													data: {pone: info.username, parentnode: comment_id, src: id,text: '&emsp;&emsp;' + $('#reply_text').val()},
													success: function(res) {
														if(res.status == "success") {
															alert("回复成功！");
															$('#reply_text').val('');
															$('#reply_area').css('display', 'none');
														}
													}
												});
											});
											$('#reply_area_cancel').off().on('click', function() {
												$('#reply_text').val('');
												$('#reply_area').css('display', 'none');
											})
										});
										// $('img.more').off().on('click', function(e) {
										// 	let comment_id = $(e.target).attr("id");
										// 	$.ajax({
										// 		url: 'http://localhost:3000/query/comment4more',
										// 		type: 'get',
										// 		dataType: 'json',
										// 		data: `comment_id=${comment_id}`,
										// 		success: function(commentdata) {
										// 			if(commentdata[0] == undefined) {
										// 				alert('无更多回复！');
										// 			} 
										// 		}
										// 	});
										// });
									}
								});	
							}
						});
						$('#comment_btn').click(function() {
							$('#comment_editor').css("display", "block");
							$('#comment_editor_submit').click(function() {
								let comment_text = "&emsp;&emsp;" +  $('#comment_text').val();
								let post_data = {
									pone: info.username,
									src: id,
									text: comment_text
								}
								$('#comment_text').val("");
								$('#comment_editor').css("display", "none");
								$.ajax({
									url: 'http://localhost:3000/update/comment',
									type: 'post',
									dataType: 'json',
									data: post_data,
									success: function(res) {
										if (res.state == "success") {
											$(".comment").prepend(`<div style="position:relative;over-flow:hidden;font-size:20px; font-family:KaiTi;height:100px;width:1000px;background-color:white;border-radius:30px;border: 2px solid #a1a1a1"><p style="position:relative; margin: 5px 15px 5px 15px">${comment_text}</p><a href="./comment4more.html?parentnode=${res.id}"><img id="${res.id}" class="more" src="./images/more.png" style="width:33px;height:33px;position:absolute;right:160px; top:72px;" /></a><img id="${res.id}" class="response" src="./images/response.png" style="width:20px;height:20px;position:absolute;right:120px; top:78px;" /><img id="${res.id}" class="like" src="./images/like.png" style="width:20px;height:20px;position:absolute;right:75px; top:75px;" /><b style="position:absolute;right:25px; top:75px;">0</b><b style="position:absolute;right:210px; top:75px;">${timeConvert2((new Date()).toLocaleString())}</b><a href="http://localhost:3000/otherusercenter.html?username=${info.username}" style="text-decoration: none;position:absolute;right:435px; top:75px;">${info.username}</a></div><div style="height:20px;"></div>`);
											window.scroll(0,500);
											// $('img.more').off().on('click', function(e) {
											// 	let comment_id = $(e.target).attr("id");
											// 	$.ajax({
											// 		url: 'http://localhost:3000/query/comment4more',
											// 		type: 'get',
											// 		dataType: 'json',
											// 		data: `comment_id=${comment_id}`,
											// 		success: function(res) {
											// 			if(res[0] == undefined) {
											// 				alert("无更多回复！");
											// 			} else {
											// 				alert("展开！");
											// 			}
											// 			console.log(res);
											// 		}
											// 	});
											// });
											$("img.like").click(function(e) {
												let comment_id = $(e.target).attr("id");
												if($(e.target).attr("src") == "./images/like.png") {
													$(e.target).attr("src", "./images/liked.png");
													$(e.target).next().text(parseInt($(e.target).next().text()) + 1);				
													$.ajax({
														url: `http://localhost:3000/update/likeplus`,
														type: 'get',
														dataType: 'json',
														data: `username=${info.username}&&id=${comment_id}`,
														success: function(res) {

														}
													});
												} else {
													$(e.target).attr("src", "./images/like.png");
													$(e.target).next().text(parseInt($(e.target).next().text()) - 1);
													$.ajax({
														url: `http://localhost:3000/update/likeminus`,
														type: 'get',
														dataType: 'json',
														data: `username=${info.username}&&id=${comment_id}`,
														success: function(res) {

														}
													});			
												}
											});
											let height = parseInt($('#background').css("height").replace('px','')) + 124;
											$('#background').css("height", `${height}px`);
											$('.footer').css("top", `${height + 60}px`);
										} else {
											alert("数据获取失败！");
										}
									}
								});						
							});
							$('#comment_editor_cancel').click(function() {
								$('#comment_text').val("");
								$('#comment_editor').css("display", "none");
							});
						});
						$.ajax({
							url: 'http://localhost:3000/query/docdetail',
							type: 'get',
							dataType: 'json',
							data: `id=${id}`,
							success: function(result) {
								var dataset = result.data[0];
								$('#title').html(dataset[4].title);
								let desc = `文件名：${dataset[4].filename}</br>
											文件描述：${dataset[4].description}`;
								$('#description').html(desc);
								$('#time').html(dataset[3]);
								$('#file_point').html('所需积分：' +dataset[4].point);
								let size = new Number(dataset[4].size).toFixed(2);
								$('#size').html('大小：' + size + 'M');
								$('#uploader_username').html('上传者：' + dataset[0]);
								if(dataset[5] == '男') {
									$('#other_avatar').attr('src', '../images/man.png');
								} else {
									$('#other_avatar').attr('src', '../images/woman.png');
								}
								if(dataset[0] == username) {
									$('#download').css('display','none');
								}
								$('#uploader_point').html('积&emsp;分：' + dataset[1]);
								$('#uploader_motto').html('签&emsp;名：' +dataset[2]);
								$('#download').click(function() {
									var xhr = new XMLHttpRequest();
										xhr.open("GET", "http://localhost:3000" + dataset[4].path, true);
										xhr.responseType = 'blob';
										xhr.onload=function(e){download(xhr.response, dataset[4].filename); }
										xhr.send();
									let post_data = {
										uploader: dataset[0],
										downloader: username,
										point: dataset[4].point,
										filename: dataset[4].filename,
										id: dataset[4]._id
									}
									$.ajax({
										url: 'http://localhost:3000/update/point_opr',
										type: 'post',
										dataType: 'json',
										data: post_data,
										success: function(point_result) {
											$('#point').html('积&emsp;分：' + point_result[0]);
										}
									});
								});
							}
						});
					} 
				});
				$('#search').click(function() {
					let key = $('#search_key').val();
					location.href = `../result.html?key=${key}`;
				});
			}
		}
	});
})

function timeConvert(s) {
	// if(parseInt(s.substring(11,13)) + 8 > 24) {
	// 	return s.substring(0,8) + (parseInt(s.substring(8,10) + 1)) + s.substring(13,19);
	// }
	return s.substring(0,10) + " " +(parseInt(s.substring(11,13)) + 8) + s.substring(13,19);
}

function timeConvert2(s) {
	if(s.substring(11,13) == "上午") {
		return s.substring(0,4) + '-' + s.substring(5,7) + '-' + s.substring(8,10) + ' ' + parseInt(s.substring(13,14)) + ":" + s.substring(15,20);
	}
	return s.substring(0,4) + '-' + s.substring(5,7) + '-' + s.substring(8,10) + ' ' + (parseInt(s.substring(13,14)) + 12) + ":" + s.substring(15,20);
}

$(function() {
	$('#backtotop').click(function() {
		window.scroll(0,0);
	});
});