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
                    success: function(result) {
                        let username = result.username;
                        let point = result.point;
                        $('#username').html('用户名：' + username);
                        $('#point').html('积分：' + point);
                    }
                });
                let key = (window.location.search).split('=')[1];
                $.ajax({
                    url: 'http://localhost:3000/query/invitation_teams',
                    type: 'get',
                    dataType: 'json',
                    data: `username=${username}`,
                    success: function(teams_data) {
                        console.log(teams_data);
                        let innerHtml = `<table border="4" id="warehouse_table">
                              <tr>
                                <th>团队名称</th>
                                <th>给予我的权限</th>
                                <th>接受/拒绝</th>
                              </tr>`;
                        for(var i=0; i<teams_data.length; i++) {
                            innerHtml += `<tr>
                                <td><b><a href="./warehouse.html?warehouse=${teams_data[i].teamid}">${teams_data[i].teamid}</a></b></td>
                                <td style="text-align:center"><b>${teams_data[i].permission}</b></td>
                                <td><b><button style="color:green" class="accept" id="${teams_data[i].teamid}">接受</button>/<button style="color:red" class="decline" id="${teams_data[i].teamid}">拒绝</button></b></td>
                              </tr>`;
                  
                            //innerHtml += `<b>姓名：</b><a href="./otherusercenter.html?username=${result[i].id}">${result[i].id}</a>&nbsp;&nbsp;<b>权限：</b>${result[i].permission}</br>`;
                        }
                        $('#invitation_teams').html(innerHtml);
                        $('.accept').click(function(e) {
                            //console.log($(this).parent().parent().siblings()[1].innerText);
                            let post_data = {
                                teamid: e.currentTarget.id,
                                id: username,
                                permission: $(this).parent().parent().siblings()[1].innerText
                            }
                            $.ajax({
                                url: 'http://localhost:3000/update/accept',
                                type: 'post',
                                dataType:'json',
                                data: post_data,
                                success: function(res) {
                                    if(res.status == "success") {

                                        alert("您已经加入该团队！");
                                    }
                                }

                            })   
                        })
                        $('.decline').click(function(e) { 
                            

                            

                            let post_data = {
                                teamid: e.currentTarget.id,
                                id: username,
                               
                            }
                            $.ajax({
                                url: 'http://localhost:3000/update/decline',
                                type: 'post',
                                dataType:'json',
                                data: post_data,
                                success: function(res) {
                                    if(res.status == "success") {
                                        

                                        alert("已经拒绝！");
                                
                                    }
                                }

                            })
                            $(this).parents()[2].remove();


                        })
                    }
                })
                $('#search').click(function() {
                    let filename = $('#search_key').val();
                    location.href = `../result.html?key=${filename}`;
                });
                $('#logout').click(function() {
                    $.ajax({
                        url: 'http://localhost:3000/logout',
                        type: 'get',
                        dataType: 'json',
                        data: '',
                        success: function(result) {
                            if(result.status == 'success') {
                                location.href = './index.html';
                            } 
                        }
                    })
                });
                $('#new_team_btn').click(function() {
                    let new_team_name = $('#new_team_name').val();
                    if(new_team_name == "") {
                        alert("请输入团队名称！");
                        return ;
                    }
                    $.ajax({
                        url:'http://localhost:3000/update/new_team',
                        type: 'get',
                        dataType: 'json',
                        data: `new_team_name=${new_team_name}&&id=${username}`,
                        success: function(res) {
                            if(res.status == "success") {
                                $('#new_team_name').val(``); 
                            } else {
                                $('#new_team_name').val(``);   
                            }
                            alert(res.message);
                        }
                    })
                });
            }
        }
    });
})