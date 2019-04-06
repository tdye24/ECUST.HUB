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
				let teamid = (window.location.search).split('=')[1];

				let title_str = "团队名称：" + decodeURI(teamid);
				$('#team_title').html(title_str);
				$.ajax({
					url: 'http://localhost:3000/query/teammates',
					type: 'get',
					dataType: 'json',
					data: `teamid=${teamid}`,
					success: function(result) {
						console.log(result);
						let teammates = [];
						for(let i=0; i<result.length; i++) {
							teammates.push(result[i].id);
						}
						let innerHtml = `<table border="4">
							  <tr>
							    <th>Name</th>
							    <th>Permission</th>
							    <th>Upload</th>
							  </tr>`;
						for(var i=0; i<result.length; i++) {
							innerHtml += `<tr>
							    <td><b><a href="./otherusercenter.html?username=${result[i].id}">${result[i].id}</a></b></td>
							    <td><b>${result[i].permission}</b></td>
							    <td><b>0</b></td></tr>`;
							  
							//innerHtml += `<b>姓名：</b><a href="./otherusercenter.html?username=${result[i].id}">${result[i].id}</a>&nbsp;&nbsp;<b>权限：</b>${result[i].permission}</br>`;
						}
						innerHtml += `<tr>
								<td><b><input style="width:124px;" id="new_member_name"></input></b></td>
							    <td><b><select style="width:124px;" id="new_member_permission">
									    	<option value ="甲">甲</option>
									      	<option value ="乙">乙</option>
									      	<option value="丙">丙</option>
							    		</select>
							    	</b>
							    </td>
							    <td><b><button style="color:green" id="invite">邀请成员</button></b></td>
							  </tr></table>`;
						// console.log(innerHtml);
						$('#members_info').html(innerHtml);
						$('#invite').click(function() {
							let new_member_name = $('#new_member_name').val();
							let new_member_permission = $('#new_member_permission').val();
							let post_data = {
								new_member_name: new_member_name,
								teamid: decodeURI(teamid),
								new_member_permission: new_member_permission
							}
							if($.inArray(new_member_name, teammates) == -1) {
								if($('#new_member_name').val() == "") {
									alert("请输入用户名！")
									return;
								}
								$.ajax({
									url: 'http://localhost:3000/query/isnamevalid',
									type: 'get',
									dataType: 'json',
									data: `username=${new_member_name}`,
									success: function(data) {
										if(!data.valid) {
											alert(data.message);
										} else {
											$.ajax({
												url: 'http://localhost:3000/update/team',
												type: 'post',
												dataType: 'json',
												data: post_data,
												success: function(res) {
													if(res.status == "success") {
														alert("邀请成功！");
													} else {
														alert("请勿重复邀请！");
													}
												}
											})
										}
										$('#new_member_name').val('');
									}
								});
							} else {
								alert("该用户已经在您的团队中！");
								return;
							}
							
						});
					}
				});



				

				$.ajax({
					url: 'http://localhost:3000/query/warehouses',
					type: 'get',
					dataType: 'json',
					data: `teamid=${teamid}`,
					success: function(result) {
						console.log(result);
						let innerHtml = `<table border="4" id="warehouse_table">
							  <tr>
							    <th>Name</th>
							    <th>Scripts</th>
							  </tr>`;
						for(var i=0; i<result.length; i++) {
							innerHtml += `<tr>
							    <td><b><a href="./warehouse.html?warehouse=${result[i].warehouse}&&teamid=${teamid}">${result[i].warehouse}</a></b></td>
							    <td><b>1</b></td>
							  </tr>`;
							  
							//innerHtml += `<b>姓名：</b><a href="./otherusercenter.html?username=${result[i].id}">${result[i].id}</a>&nbsp;&nbsp;<b>权限：</b>${result[i].permission}</br>`;
						}
						innerHtml += 
							`<tr>
							    <td><b><input style="width:380px;" id="new_warehouse_name"></input></b></td>
							    <td><b><button id="new_warehouse" style="color:green">NEW</button></b></td>
							 </tr>
							 </table>`;
						// console.log(innerHtml);
						$('#warehouses_info').html(innerHtml);
						$('#new_warehouse').click(function() {
							let permission_data_params = {
								username: username,
								teamid: teamid
							}
							$.ajax({
								url: 'http://localhost:3000/query/permission',
								type: 'get',
								dataType: 'json',
								data: permission_data_params,
								success: function(permission_data) {
									console.log(permission_data);
									if(permission_data[0].permission != '甲') {
										alert("对不起，权限不够，甲以上方可创建仓库！");
									} else {
										let new_warehouse_name = $('#new_warehouse_name').val();
										if(new_warehouse_name == "") {

											alert("仓库名不能为空！");
						
										} else {
											let new_warehouse_post_data = {
												teamid: teamid,
												warehouse_name:new_warehouse_name
											}
											$.ajax({
												url: 'http://localhost:3000/update/warehouse',
												type: 'post',
												dataType: 'json',
												data: new_warehouse_post_data,
												success: function(new_warehouse_res) {
													console.log(new_warehouse_res);
													if(new_warehouse_res.status == "success") {
														$('#warehouse_table tbody tr').eq(-2).after(`
															<tr>
															    <td><b><a href="./warehouse.html?warehouse=${new_warehouse_name}">${new_warehouse_name}</a></b></td>
															    <td><b>0</b></td>
															</tr>`)
														
													}
													
													alert(new_warehouse_res.message);
												}
											})
										}

									}
									$('#new_warehouse_name').val(``);
								}
							})
						})
					
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