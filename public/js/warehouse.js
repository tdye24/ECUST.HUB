function timeConvert(time) {
    var date = new Date(time);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    if(date.getHours() < 10) {
        var hours = '0' + date.getHours();
    } 
    if(date.getMinutes() < 10) {
        var minutes = '0' + date.getMinutes();
    }
    if(date.getSeconds() < 10) {
        var seconds = '0' + date.getSeconds();
    }
    var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + hours + ':' + minutes + ':' + seconds;
    return time;
}


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
				// let warehouse = (window.location.search).split('=')[1];
				// let teamid = (window.location.search).split('=')[2];
				// console.log(window.location.search);
				let temp_params_list_1 = (window.location.search).split('&&')
				// console.log(temp_params_list_1);
				let warehouse = (temp_params_list_1[0]).split("=")[1]
				let teamid = decodeURI((temp_params_list_1[1])).split("=")[1]
				// console.log("warehouse", warehouse);
				// console.log("teamid", teamid);

				let title_str = "仓库名称：" + decodeURI(warehouse);
				$('#warehouse_title').html(title_str);
				$.ajax({
					url: 'http://localhost:3000/query/warehouse_code',
					type: 'get',
					dataType: 'json',
					data: `warehouse=${decodeURI(warehouse)}`,
					success: function(result) {
						console.log("warehouse_code result1", result);
						let innerHtml = `<table border="4">
							  <tr>
							    <th style="width:70px">姓名</th>
							    <th>时间</th>
							    <th>文件名</th>
							    <th>大小</th>
							    <th>下载/上传</th>
							  </tr>`;
						for(var i=0; i<result.length; i++) {
							innerHtml += `<tr>
							    <td><b><a href="otherusercenter.html?username=${result[i].id}">${result[i].id}</b></td>
							    <td><b>${timeConvert(result[i].time)}</b></td>
							    <td><b><button class="code_" id="${result[i].unique_filename}">${result[i].codename}</button></b></td>
							    <td><b>${result[i].codesize.toFixed(2)}K</b></td>
							    <td><b><button style="color:green" class="download" id="${result[i].unique_filename}">Download</button></b></td>
							  </tr>`;
							  
							//innerHtml += `<b>姓名：</b><a href="./otherusercenter.html?username=${result[i].id}">${result[i].id}</a>&nbsp;&nbsp;<b>权限：</b>${result[i].permission}</br>`;
						}
						innerHtml += `</table>`;
						// console.log(innerHtml);
						$('#code_info').html(innerHtml);
						$('button.code_').click(function(e) {

							$('#code_title').html(e.currentTarget.innerText);
							let get_data = {
								teamid: teamid,
								warehouse: decodeURI(warehouse),
								unique_filename: e.currentTarget.id,
								

							}
							console.log("get_data", get_data);
							$.ajax({
								url: 'http://localhost:3000/query/codedetail',
								data: 'get',
								dataType: 'json',
								data: get_data,
								success: function(res) {
									console.log(res);
									$('#code_detail').html(res.data);
								}
							})
						})
						$('.download').click(function(event) {
							let temp_params_list_1 = (window.location.search).split('&&')
							// console.log(temp_params_list_1);
							let warehouse = (temp_params_list_1[0]).split("=")[1]
							let teamid = decodeURI((temp_params_list_1[1])).split("=")[1]
							// let warehouse = decodeURI((window.location.search).split('=')[1]);
							var xhr = new XMLHttpRequest();
								xhr.open("GET", `http://localhost:3000/data/warehouse/${teamid}/${warehouse}/${event.currentTarget.id}`, true);
								xhr.responseType = 'blob';
								xhr.onload=function(e){download(xhr.response, event.currentTarget.id); }
								xhr.send();
						});
						$('#submit_code_btn').click(function() {
							if($('#file').prop('files')[0] == undefined) {
								alert("请选择文件！");
								return;
							}
							alert("上传！");
							var file_data = $('#file').prop('files')[0];
					        var form_data = new FormData();
					        var xhr = new XMLHttpRequest();
					        xhr.onreadystatechange = function() {
					            if(xhr.readyState === 4 && xhr.status === 200) {
					                let state = JSON.parse(xhr.responseText).state;
					                let point = JSON.parse(xhr.responseText).point;
					                if(state === 'success') {
					                    $('#file').val('');
					                }
					            }
					        }
					        xhr.open('post',`http://localhost:3000/uploadcode`,true);
					        xhr.upload.onprogress = function(ev) {
					            if(ev.lengthComputable) {
					                var percent = ev.loaded/ev.total;
					                $('#out_progress').css('display','inline');
					                $('#inner_progress').css('width',percent*550);
					                $('#inner_progress').html((percent*100).toFixed(2) + `%`);
					                if(ev.loaded === ev.total) {
					                    $('#out_progress').css('display','none');
					                    $('#inner_progress').css('width',0);
					                    $('#inner_progress').html(0 + `%`);
					                    $('#code_info').html(``);
					                    $.ajax({
					                    	url: 'http://localhost:3000/query/warehouse_code',
					                    	type: 'get',
					                    	dataType: 'json',
					                    	data: `warehouse=${warehouse}`,
					                    	success: function(result) {
					                    		console.log("warehouse_code result2", result);
					                    		let innerHtml = `<table border="4">
					                    			  <tr>
					                    			    <th style="width:70px">姓名</th>
					                    			    <th>时间</th>
					                    			    <th>文件名</th>
					                    			    <th>大小</th>
					                    			    <th>下载/上传</th>
					                    			  </tr>`;
					                    		for(var i=0; i<result.length; i++) {
					                    			innerHtml += `<tr>
					                    			    <td><b><a href="otherusercenter.html?username=${result[i].id}">${result[i].id}</b></td>
					                    			    <td><b>${timeConvert(result[i].time)}</b></td>
					                    			    <td><b><button class="code_" id="${result[i].unique_filename}">${result[i].codename}</button></b></td>
					                    			    <td><b>${result[i].codesize.toFixed(2)}K</b></td>
					                    			    <td><b><button style="color:green" class="download" id="${result[i].unique_filename}">Download</button></b></td>
					                    			  </tr>`;
					                    			  
					                    			//innerHtml += `<b>姓名：</b><a href="./otherusercenter.html?username=${result[i].id}">${result[i].id}</a>&nbsp;&nbsp;<b>权限：</b>${result[i].permission}</br>`;
					                    		}
					                    		innerHtml += `</table>`;
					                    		// console.log(innerHtml);
					                    		$('#code_info').html(innerHtml);
					                    		window.location.reload()
					                    	}
					                    })
					                }
					            }
					        }
					        let temp_params_list_1 = (window.location.search).split('&&')
					        // console.log(temp_params_list_1);
					        let warehouse = (temp_params_list_1[0]).split("=")[1]
					        let teamid = decodeURI((temp_params_list_1[1])).split("=")[1]

					        form_data.append('username', username);
					        form_data.append('teamid', teamid);
					        form_data.append('warehouse', warehouse);
					        form_data.append('file',file_data);

					        xhr.send(form_data);
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