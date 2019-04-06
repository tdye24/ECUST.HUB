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
                    location.href = 'index.html';
                    return false;
                } else {
                    $.ajax({
                        url: 'http://localhost:3000/query/invitation',
                        type: 'get',
                        dataType: 'json',
                        data:  `username=${loginresult.username}`,
                        success: function(invitation_res) {
                            console.log(invitation_res);
                            $('#invitation_num').html(`Invitation(s):&nbsp;` + invitation_res.num)

                        }
                    })
                    $.ajax({
                        url: 'http://localhost:3000/query/info',
                        type: 'get',
                        dataType: 'json',
                        data: `username=${loginresult.username}`,
                        success: function(result) {
                            // console.log(result);
                            var usernameText = '用户名:&emsp;' + result.username;
                            var mottoText = '个性签名：&nbsp;' + result.motto;
                            var pointText = '积&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分:&emsp;' + result.point;
                            $('#header_username').html(usernameText);
                            $('#header_point').html(pointText);
                            $('#header_motto').html(mottoText);
                            $('#username').html(result.username);
                            $('#sex').html(result.sex);
                            $('#sno').html(result.campusCardId);
                            $('#email').html(result.email);
                            $('#tel').html(result.telephone);
                            $('#motto').html(result.motto);
                            if(result.sex == '男') {
                                $('#avatar_1').attr('src', '../images/man.png');
                                $('#avatar_2').attr('src', '../images/man.png');
                            } else {
                                $('#avatar_1').attr('src', '../images/woman.png');
                                $('#avatar_2').attr('src', '../images/woman.png');
                            }
                            $('#submit_file_btn').click(function() {
                                var document_name = $('#set-document-name').val();
                                var document_description = $('#set-description').val();
                                var type = $('#selector').val();
                                var point = $('#point').val();
                                if(point === '') {
                                    point = 0;
                                }
                                var date = new Date();
                                var uploadTime = date.toLocaleString();
                                var file_data = $('#file').prop('files')[0];
                                if($.trim(document_name)==''||$.trim(document_description)==''||!file_data) {
                                    if($.trim(document_name)==''||$.trim(document_description)=='') {
                                        alert('标题和描述均不能为空！');
                                        return false;
                                    } else {
                                        alert('请选择上传文件！');
                                        return false;
                                    }
                                } else {
                                    if(file_data.size > 2*1024*1024*1024) {
                                        alert('文件大小不能超过两个g,请重新选择上传文件！');
                                        return false;
                                    }
                                    var form_data = new FormData();
                                    var xhr = new XMLHttpRequest();
                                    xhr.onreadystatechange = function() {
                                        if(xhr.readyState === 4 && xhr.status === 200) {
                                            let state = JSON.parse(xhr.responseText).state;
                                            let point = JSON.parse(xhr.responseText).point;
                                            if(state === 'success') {
                                                var pointText = '积&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分:&emsp;' + point;
                                                $('#header_point').html(pointText);
                                                $('#info').fadeIn('slow');
                                                setTimeout(function() {
                                                    $('#info').fadeOut('slow');
                                                }, 1000);
                                                $('#set-document-name').val('');
                                                $('#point').val('');
                                                $('#set-description').val('');
                                                $('#file').val('');
                                            }
                                        }
                                    }
                                    xhr.open('post','http://localhost:3000/upload',true);
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
                                    
                                            }
                                        }
                                    }
                                    form_data.append('document_name',document_name);
                                    form_data.append('document_description',document_description);
                                    form_data.append('type',type);
                                    form_data.append('point',point);
                                    form_data.append('uploadTime',uploadTime);
                                    form_data.append('user',result.username);
                                    form_data.append('file',file_data);

                                    xhr.send(form_data);
                                }
                            });
                            $('#old-password').focusout(function() {
                                let data = {
                                    username: result.username,
                                    old_password: $('#old-password').val()
                                };
                                $.ajax({
                                    url: `http://localhost:3000/check/password`,
                                    type: 'post',
                                    dataType: 'json',
                                    data: data,
                                    success: function(result0) {
                                        if(result0.valid) {
                                            $('#password_info').css('display','inline')
                                            $('#password_info').text('√');
                                        } else {
                                            $('#password_info').css('display', 'inline');
                                            $('#password_info').text('原密码输入错误！');
                                            $('#old-password').val('');
                                            $('#old-password').focusin(function() {
                                                $('#password_info').css('display', 'none');
                                            })
                                        }
                                    }

                                })
                            });
                            $('#new-password').focusout(function() {
                                if($('#once-more').val()) {
                                    if($('#new-password').val() != $('#once-more').val()) {
                                        $('#password-check').css('display', 'inline');
                                        $('#password-check').text('两次密码输入不一致！');
                                        $('#new-password').val('');
                                        $('#once-more').val('');
                                        $('#new-password').focusin(function() {
                                            $('#password-check').css('display', 'none');
                                        })
                                        $('#once-more').focusin(function() {
                                            $('#password-check').css('display', 'none');
                                        })
                                    }
                                } 
                            });
                            $('#once-more').focusout(function() {
                                if($('#new-password').val()) {
                                    if($('#new-password').val() != $('#once-more').val()) {
                                        $('#password-check').css('display', 'inline');
                                        $('#password-check').text('两次密码输入不一致！');
                                        $('#new-password').val('');
                                        $('#once-more').val('');
                                        $('#new-password').focusin(function() {
                                            $('#password-check').css('display', 'none');
                                        })
                                        $('#once-more').focusin(function() {
                                            $('#password-check').css('display', 'none');
                                        })
                                    }
                                } 
                            });
                            $('#change_password_Btn').click(function() {
                                if($('#new-password').val() === $('#old-password').val()) {
                                    $('#password-check').css('display', 'inline');
                                    $('#password-check').text('新密码不能与旧密码相同！');
                                    $('#new-password').val('');
                                    $('#once-more').val('');
                                    $('#new-password').focusin(function() {
                                        $('#password-check').css('display', 'none');
                                    });
                                    $('#once-more').focusin(function() {
                                        $('#password-check').css('display', 'none');
                                    });
                                } else {
                                    let passwordData = {
                                        username: result.username,
                                        new_password: $('#new-password').val() 
                                    }
                                    $.ajax({
                                        url: 'http://localhost:3000/update/password',
                                        type: 'post',
                                        dataType: 'json',
                                        data: passwordData,
                                        success: function(result1) {
                                            if(result1.state === 'success') {                                
                                                $.ajax({
                                                    url: 'http://localhost:3000/logout',
                                                    type: 'get',
                                                    dataType: 'json',
                                                    data: '',
                                                    success: function(result2) {
                                                        if(result2.status == 'success') {
                                                            alert('密码修改成功！');
                                                            location.href = 'index.html';
                                                        }
                                                    }
                                                });
                                            } else {
                                                alert('修改密码失败！');
                                            }
                                            
                                        }
                                    })
                                }
                            });
                            $('#pointrecord').click(function() {
                                $.ajax({
                                    url: 'http://localhost:3000/query/pointrecord',
                                    type: 'get',
                                    dataType: 'json',
                                    data: `username=${result.username}`,
                                    success: function(result3) {
                                        dynamicAddUser(result3);//记录条数
                                        goPage(1, 5);//每页显示的条数
                                        var tempOption = "";
                                        for (var i = 1; i <= totalPage; i++) {
                                            tempOption += '<option value=' + i + '>' + i + '</option>'
                                        }
                                        $("#jumpWhere").html(tempOption);
                                    }
                                })
                            });
                            $('#uploadrecord').click(function() {
                                $.ajax({
                                    url: 'http://localhost:3000/query/uploadrecord',
                                    type: 'get',
                                    dataType: 'json',
                                    data: `username=${result.username}`,
                                    success: function(result4) {
                                        console.log("result4", result4);
                                        dynamicAddDocument(result4);//记录条数
                                        DgoPage(1, 3);//每页显示的条数
                                        var tempOption = "";
                                        for (var i = 1; i <= DtotalPage; i++) {
                                            tempOption += '<option value=' + i + '>' + i + '</option>'
                                        }
                                        $("#DjumpWhere").html(tempOption);
                                    }
                                })
                            });
                            $('#submit').click(function() {
                                $('#modify').css('display', 'block');
                                $('#submit').css('display', 'none');
                                $('#datas').css('display', 'none');
                                $('#setdatas').css('display', 'block');
                                if($('#_username').val()&&$('#_sno').val()&&$('#_email').val()&&$('#_tel').val()) {
                                    let new_info = {
                                        old_username: result.username,
                                        username: $('#_username').val(),
                                        sex: $('#_sex option:selected').val(),
                                        campusCardId: $('#_sno').val(),
                                        email: $('#_email').val(),
                                        telephone: $('#_tel').val(),
                                        motto: $('#_motto').val()
                                    };
                                    $.ajax({
                                        url: 'http://localhost:3000/update/info',
                                        type: 'post',
                                        dataType: 'json',
                                        data: new_info,
                                        success: function(result) {
                                            if(result.status == 'success') {
                                                location.href = '../center.html';
                                            }
                                        }
                                    });
                                } else {
                                    alert('请补全个人信息！');
                                    return false;
                                }
                            });
                            $('#follow').click(function() {
                                // console.log(result.username);
                                $.ajax({
                                    url: 'http://localhost:3000/query/follow',
                                    type: 'get',
                                    dataType: 'json',
                                    data: `username=${result.username}`,
                                    success: function(result5) {
                                        // console.log(result5);
                                        dynamicAddOtherUsers(result5, result.username);//记录条数
                                        UgoPage(1, 3);//每页显示的条数
                                        var tempOption = "";
                                        for (var i = 1; i <= UtotalPage; i++) {
                                            tempOption += '<option value=' + i + '>' + i + '</option>'
                                        }
                                        $("#UjumpWhere").html(tempOption);
                                    }
                                });
                            });
                            $('#search').click(function() {
                                let key = $('#search_key').val();
                                location.href = `../result.html?key=${key}`;
                            });
                            $('#myteams').click(function() {
                                
                                $.ajax({
                                    url: 'http://localhost:3000/query/myteams',
                                    type: 'get',
                                    dataType: 'json',
                                    data: `username=${result.username}`,
                                    success: function(result6) {
                                        $("#Teams").html(``);
                                        dynamicAddTeams(result6);//记录条数
                                        MgoPage(1, 3);//每页显示的条数
                                        var tempOption = "";
                                        for (var i = 1; i <= DtotalPage; i++) {
                                            tempOption += '<option value=' + i + '>' + i + '</option>'
                                        }
                                        $("#MjumpWhere").html(tempOption);
                                        console.log(result6);
                                    }
                                })
                            });
                            $('#teammates').click(function() {
                                alert("hhh")
                                $.ajax({
                                    url: 'http://localhost:3000/query/teammates',
                                    type: 'get',
                                    dataType: 'json',
                                    data: `teamno=${teamno}`,
                                    success: function(res) {
                                        console.log(res);
                                    }
                                });
                            })
                        }
                    })
                }

            }
        }
    )
    
    $('#checkout').click(function() {
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
	$('#point').focusout(function() {
		let val = $('#point').val();
		if(val > 50 || val < 0) {
			alert('积分值必须在0-50之间！');
			$('#point').val(0);
		}
	});
    $('#set-document-name').focusin(function() {
        $('#set-document-name').val('');
    });
    $('#set-document-name').focusout(function() {
        var document_name = $('#set-document-name').val();
        var isValid = /(^\s+)|(\s+$)/g;
        if(isValid.test(document_name)||document_name.indexOf(' ')!=-1) {
            alert('文件名中不能包含空格！');
            $('#set-document-name').val('');
            return false;
        }
    });
    $('#modify').css('outline', 'none');
    $('#submit').css('outline', 'none');
    $('#cancel').css('outline', 'none');
    $('#_username').focusin(function() {
        $('#username_valid').html('');
    });
    $('#_username').focusout(function() {
        let username = $('#_username').val();
        let pattern = /(^\s+)|(\s+$)/g
        if(username.length === 0 ) {
            alert('用户名不能为空！');
            $('#_username').val('');
            return false;
        } else if(pattern.test(username)||username.indexOf(' ')!=-1) {
            alert('用户名中不能包含空格！');
            $('#_username').val('');
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
                        $('#_username').val('');
                    }

                }
            })
        }
        
    });
    $('#_tel').focusin(function() {
        $('#_tel').val('');
    });
    $('#_tel').focusout(function() {
        var tel = $('#_tel').val();
        var isTel = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,3,5-9]))\d{8}$/;
        if(!isTel.test(tel)) {
            alert('手机号的格式不正确，请检查后再输入！');
            $('#_tel').val('');
            return false;
        }
    });
    $('#_email').focusout(function() {
        var email = $('#_email').val();
        var isemail = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
        if (email.length > 25){
            alert("长度太长!");
            $('#_email').val('');
            return false
        }
        if (!isemail.test(email)){
            alert("不是邮箱");
            $('#_email').val('');
            return false;
        }
    });
    $('#modify').click(function() {
        $('#modify').css('display', 'none');
        $('#cancel').css('display', 'block');
        $('#submit').css('display', 'block');
        $('#datas').css('display', 'none');
        $('#setdatas').css('display', 'block');
    });
    
    $('#cancel').click(function() {
        $('#submit').css('display', 'none');
        $('#modify').css('display', 'block');
        $('#cancel').css('display', 'none');
        $('#datas').css('display', 'block');
        $('#setdatas').css('display', 'none');
    });
})

//文件管理部分

/*动态生成用户函数
num为生成的用户数量
*/

function dynamicAddDocument(list) {
    for (var i = 0; i < list.length; i++)
    {
        //生成一块
        var DDiv = document.createElement("div");
        DDiv.style.width = "80%";
        DDiv.style.height = "130px";
        DDiv.style.backgroundColor = "white";
        DDiv.style.borderRadius = "50px";
        DDiv.style.margin = "20px";
        DDiv.style.left = "5%";
        DDiv.style.position = "relative";
        $(DDiv).attr("id", "DBlock", "class", "block");
        //序号
        var tdNodeNum = document.createElement("p");
        $(tdNodeNum).html(i + 1 + ".");
        $(tdNodeNum).attr("style", "font-size:20px;position:relative;left:-10px;top:-5px;")
        //文件标题
        var Dhead = document.createElement("a");
        $(Dhead).attr("style", "width:90%;font-size:20px;position:relative;left:50px;top:-66px;")
        $(Dhead).html(list[i].title);
        $(Dhead).attr('href', `detail.html?id=${list[i]._id}`);
        //分割线
        var Dline = document.createElement("hr");
        Dline.style.width = "100%";
        Dline.style.position = "relative";
        Dline.style.top = "-80px";
        $(Dline).attr("color", "black");
        //文件描述
        var DDescrip = document.createElement("p");
        $(DDescrip).attr("style", "font-size:15px;width:508px;position:relative;height:60px;left:20px;top:-95px;")
        if(list[i].filename.length < 10) {
            if(list[i].description.length < 16) {
                $(DDescrip).html(`文件名：${list[i].filename}&emsp;` + `文件描述：${list[i].description}`); 
            } else {
                $(DDescrip).html(`文件名：${list[i].filename}&emsp;` + `文件描述：${list[i].description.substr(0,16)}<abbr title='${list[i].description}'>...</abbr>`);
            }
            
        } else {
            if(list[i].description.length < 16) {
                $(DDescrip).html(`文件名：${list[i].filename.substr(0,10)}<abbr title='${list[i].filename}'></abbr>&emsp;` + `文件描述：${list[i].description}`); 
            } else {
                $(DDescrip).html(`文件名：${list[i].filename.substr(0,10)}<abbr title='${list[i].filename}'></abbr>&emsp;` + `文件描述：${list[i].description.substr(0,16)}<abbr title='${list[i].description}'>...</abbr>`);
            }
        }
        //文件大小
        let size = (new Number(list[i].size)).toFixed(2);
        var DSize = document.createElement("p");
        $(DSize).attr("style", "font-size:20px;width:200px;position:relative;top:-100px;left:250px;")
        $(DSize).html(size + 'M');
        //撤销按钮
        var DCancel = document.createElement("input")
        DCancel.style.width = "100px";
        DCancel.style.height = "30px";
        DCancel.type = "button";
        DCancel.value = "撤销";
        DCancel.style.border = "none";
        DCancel.style.borderRadius = "30px";
        DCancel.style.backgroundColor = "#bcbcbc";
        DCancel.style.position = "relative";
        DCancel.style.top = "-158px";
        DCancel.style.left = "400px";
        DCancel.style.outline = 'none';
        DCancel.id = list[i]._id;
        DCancel.onclick = function() {
            $.ajax({
                url: 'http://localhost:3000/update/delete',
                type: 'get',
                dataType: 'json',
                data: `id=${this.id}`,
                success: function(result) {
                    $('#DadminTbody').html(``);
                    dynamicAddDocument(result);//记录条数
                    DgoPage(1, 3);//每页显示的条数
                    var tempOption = "";
                    for (var i = 1; i <= DtotalPage; i++) {
                        tempOption += '<option value=' + i + '>' + i + '</option>'
                    }
                    $("#DjumpWhere").html(tempOption);
                }   
            });
        }
        DDiv.appendChild(tdNodeNum);
        DDiv.appendChild(Dhead);
        DDiv.appendChild(Dline);
        DDiv.appendChild(DDescrip);
        DDiv.appendChild(DSize);
        DDiv.appendChild(DCancel);

        $("#DadminTbody")[0].appendChild(DDiv);
    }
}
/**
 * 分页函数
 * pno--页数
 * psize--每页显示记录数
 * 分页部分是从真实数据行开始，因而存在加减某个常数，以确定真正的记录数
 * 纯js分页实质是数据行全部加载，通过是否显示属性完成分页功能
**/
var DpageSize = 0;//每页显示行数
var DcurrentPage_ = 1;//当前页全局变量，用于跳转时判断是否在相同页，在就不跳，否则跳转。
var DtotalPage;//总页数
function DgoPage(pno, psize) {
    var itable = document.getElementById("DadminTbody").getElementsByTagName("hr");
    var num = itable.length;//表格所有行数(所有记录数)
    DpageSize = psize;//每页显示行数
    //总共分几页
    if (num / DpageSize > parseInt(num / DpageSize)) {
        DtotalPage = parseInt(num / DpageSize) + 1;
    } else {
        DtotalPage = parseInt(num / DpageSize);
    }
    var currentPage = pno;//当前页数
    DcurrentPage_ = currentPage;
    var startRow = (currentPage - 1) * DpageSize + 1;
    var endRow = currentPage * DpageSize;
    endRow = (endRow > num) ? num : endRow;
    $("#DadminTbody div").hide();
    for (var i = startRow - 1; i < endRow; i++) {
        $("#DadminTbody div").eq(i).show();
    }
    var tempStr = "共" + num + "条记录 分" + DtotalPage + "页 当前第" + currentPage + "页";
    // console.log(tempStr);
    document.getElementById("DDbarcon1").innerHTML = tempStr;

    if (currentPage > 1) {
        $("#DfirstPage").on("click", function () {
            DgoPage(1, psize);
        }).removeClass("ban");
        $("#DprePage").on("click", function () {
            DgoPage(currentPage - 1, psize);
        }).removeClass("ban");
    } else {
        $("#DfirstPage").off("click").addClass("ban");
        $("#DprePage").off("click").addClass("ban");
    }

    if (currentPage < DtotalPage) {
        $("#DnextPage").on("click", function () {
            DgoPage(currentPage + 1, psize);
        }).removeClass("ban")
        $("#DlastPage").on("click", function () {
            DgoPage(DtotalPage, psize);
        }).removeClass("ban")
    } else {
        $("#DnextPage").off("click").addClass("ban");
        $("#DlastPage").off("click").addClass("ban");
    }

    $("#DjumpWhere").val(currentPage);
}
function DjumpPage() {
    var num = parseInt($("#DjumpWhere").val());
    if (num != DcurrentPage_) {
        DgoPage(num, DpageSize);
    }
}

//关注的人
/*动态生成用户函数
num为生成的用户数量
*/
function dynamicAddOtherUsers(userlist, myusername) {
    for (var i = 0; i < userlist.length; i++) {
        var UDiv = document.createElement("div");
        UDiv.style.width = "85%";
        UDiv.style.height = "100px";
        UDiv.style.backgroundColor = "white";
        UDiv.style.borderRadius = "50px";
        UDiv.style.margin = "30px";

        $(UDiv).attr("id", "DBlock", "class", "block", "style", "position: relative;");

        var UImg = document.createElement("img");
        if(userlist[i][2] == '男') {
            $(UImg).attr('src', '../images/man.png');
        } else {
            $(UImg).attr('src', '../images/woman.png');
        }
        UImg.style.width = "50px";
        UImg.style.height = "50px";
        UImg.style.position = "relative";
        UImg.style.top = "25px";
        UImg.style.left = "40px";
        // UImg.onclick = function jump() {
        //     window.location.href = "otherusercenter.html";
        // }

        var Uname = document.createElement("a");
        Uname.onclick = function jump() {
            window.location.href = `otherusercenter.html?username=${this.innerText}`;
        }
        Uname.style.position = "relative";
        Uname.style.top = "-8px";
        Uname.style.left = "60px";
        Uname.style.fontSize = "20px";
        $(Uname).html(userlist[i][0]);

        var UDescript = document.createElement("p");
        UDescript.style.position = "relative";
        UDescript.style.width = "60%";
        UDescript.style.top = "-36px";
        UDescript.style.left = "110px";
        UDescript.style.fontSize = "15px";
        $(UDescript).html(userlist[i][1]);

        var UCancel = document.createElement("input");
        UCancel.style.width = "100px";
        UCancel.style.height = "30px";
        UCancel.type = "button";
        UCancel.style.border = "none";
        UCancel.value = "取消关注";
        UCancel.class = "blockbottom";
        UCancel.style.outline = "none";
        UCancel.style.position = "relative";
        UCancel.style.top = "-125px";
        UCancel.style.left = "400px";
        UCancel.style.borderRadius = "30px";
        UCancel.style.backgroundColor = "#bcbcbc";
        UCancel.id = userlist[i][0];
        UCancel.onclick = function() {
            let postdata = {
                from: myusername,
                to: this.id
            }
            $.ajax({
                url: 'http://localhost:3000/update/unfollow',
                type: 'post',
                dataType: 'json',
                data: postdata,
                success: function(result) {
                    // console.log(result);
                    $('#UadminTbody').html(``);
                    dynamicAddOtherUsers(result);//记录条数
                    UgoPage(1, 3);//每页显示的条数
                    var tempOption = "";
                    for (var i = 1; i <= UtotalPage; i++) {
                        tempOption += '<option value=' + i + '>' + i + '</option>'
                    }
                    $("#UjumpWhere").html(tempOption);
                }   
            });
        }
        UDiv.appendChild(UImg);
        UDiv.appendChild(Uname);
        UDiv.appendChild(UDescript);
        UDiv.appendChild(UCancel);


        $("#UadminTbody")[0].appendChild(UDiv);
    }
}
/**
 * 分页函数
 * pno--页数
 * psize--每页显示记录数
 * 分页部分是从真实数据行开始，因而存在加减某个常数，以确定真正的记录数
 * 纯js分页实质是数据行全部加载，通过是否显示属性完成分页功能
**/
var UpageSize = 0;//每页显示行数
var UcurrentPage_ = 1;//当前页全局变量，用于跳转时判断是否在相同页，在就不跳，否则跳转。
var UtotalPage;//总页数
function UgoPage(pno, psize) {
    var itable = document.getElementById("UadminTbody").getElementsByTagName("img");
    var num = itable.length;//表格所有行数(所有记录数)
    UpageSize = psize;//每页显示行数
    //总共分几页
    if (num / UpageSize > parseInt(num / UpageSize)) {
        UtotalPage = parseInt(num / UpageSize) + 1;
    } else {
        UtotalPage = parseInt(num / UpageSize);
    }
    var currentPage = pno;//当前页数
    UcurrentPage_ = currentPage;
    var startRow = (currentPage - 1) * UpageSize + 1;
    var endRow = currentPage * UpageSize;
    endRow = (endRow > num) ? num : endRow;
    $("#UadminTbody div").hide();
    for (var i = startRow - 1; i < endRow; i++) {
        $("#UadminTbody div").eq(i).show();
    }
    var tempStr = "共" + num + "条记录 分" + UtotalPage + "页 当前第" + currentPage + "页";
    document.getElementById("Ubarcon1").innerHTML = tempStr;

    if (currentPage > 1) {
        $("#UfirstPage").on("click", function () {
            UgoPage(1, psize);
        }).removeClass("ban");
        $("#UprePage").on("click", function () {
            UgoPage(currentPage - 1, psize);
        }).removeClass("ban");
    } else {
        $("#UfirstPage").off("click").addClass("ban");
        $("#UprePage").off("click").addClass("ban");
    }

    if (currentPage < UtotalPage) {
        $("#UnextPage").on("click", function () {
            UgoPage(currentPage + 1, psize);
        }).removeClass("ban")
        $("#UlastPage").on("click", function () {
            UgoPage(UtotalPage, psize);
        }).removeClass("ban")
    } else {
        $("#UnextPage").off("click").addClass("ban");
        $("#UlastPage").off("click").addClass("ban");
    }

    $("#UjumpWhere").val(currentPage);
}
function UjumpPage() {
    var num = parseInt($("#UjumpWhere").val());
    if (num != UcurrentPage_) {
        UgoPage(num, UpageSize);
    }
}
//积分记录部分
/*动态生成函数
num为生成数量
 */
function dynamicAddUser(recordlist) {
    for (var i = 0; i < recordlist.length; i++) {
        var trNode = document.createElement("tr");
        $(trNode).attr("align", "center", "style", "border-radius:15px;border:none;");
        //生成一条
        if (i % 5 == 2 || i % 5 == 4 || i % 5 == 0) {
            $(trNode).attr("style", "background-color:#dddbdb;")
        } else {
            $(trNode).attr("style", "background-color:white;")
        }
        //颜色变化
        var tdNodeNum = document.createElement("td");
        $(tdNodeNum).html(i + 1);
        tdNodeNum.style.width = "98px";
        tdNodeNum.style.height = "50px";
        tdNodeNum.className = "td2";

        //序号
        var tdNodeDate = document.createElement("td");
        $(tdNodeDate).html(`${timeConvert(recordlist[i].time)}`);
        tdNodeDate.style.width = "100px";
        tdNodeDate.className = "td2";
        $(tdNodeDate).css('overflow','hidden');
        $(tdNodeDate).css('text-overflow','ellipsis');
        $(tdNodeDate).css('white-space','nowrap')
        
        //日期
        var tdNodeOPCode = document.createElement("td");
        var pointHtml = ``;
        var opHtml = ``;
        if(recordlist[i].opno === 3) {
            pointHtml = `+` + 10;
            opHtml = `上传 ` + recordlist[i].info.substr(0,14);
        } else if(recordlist[i].opno === 4) {
            pointHtml = `-` + recordlist[i].point;
            opHtml = `下载 ` + recordlist[i].info.substr(0,14);
        } else if(recordlist[i].opno === 2) {        
            pointHtml = `+` + 5;
            opHtml = `登录`;
        } else if(recordlist[i].opno === 5) {
            pointHtml = `+` + recordlist[i].point;
            opHtml = `他人下载 ` + recordlist[i].info.substr(0,12);
        }
        else {        
            pointHtml = `+` + 100;
            opHtml = `注册`;
        }
            
        
        $(tdNodeOPCode).html(pointHtml);
        tdNodeOPCode.style.width = "200px";
        tdNodeOPCode.className = "td2";
        //积分变化
        var tdNodeOperation = document.createElement("td");
        $(tdNodeOperation).html(opHtml);
        tdNodeOperation.style.width = "220px";
        $(tdNodeOperation).css('overflow','hidden');
        $(tdNodeOperation).css('text-overflow','ellipsis');
        $(tdNodeOperation).css('white-space','nowrap');
        tdNodeOperation.className = "td2";
        //操作名称
        trNode.appendChild(tdNodeNum);
        trNode.appendChild(tdNodeDate);
        trNode.appendChild(tdNodeOPCode);
        trNode.appendChild(tdNodeOperation)

        $("#adminTbody")[0].appendChild(trNode);
    }
}
/**
 * 分页函数
 * pno--页数
 * psize--每页显示记录数
 * 分页部分是从真实数据行开始，因而存在加减某个常数，以确定真正的记录数
 * 纯js分页实质是数据行全部加载，通过是否显示属性完成分页功能
**/
var pageSize = 0;//每页显示行数
var currentPage_ = 1;//当前页全局变量，用于跳转时判断是否在相同页，在就不跳，否则跳转。
var totalPage;//总页数
function goPage(pno, psize) {
    var itable = document.getElementById("adminTbody");
    var num = itable.rows.length;//表格所有行数(所有记录数)

    pageSize = psize;//每页显示行数
    //总共分几页
    if (num / pageSize > parseInt(num / pageSize)) {
        totalPage = parseInt(num / pageSize) + 1;
    } else {
        totalPage = parseInt(num / pageSize);
    }
    var currentPage = pno;//当前页数
    currentPage_ = currentPage;
    var startRow = (currentPage - 1) * pageSize + 1;
    var endRow = currentPage * pageSize;
    endRow = (endRow > num) ? num : endRow;
    $("#adminTbody tr").hide();
    for (var i = startRow - 1; i < endRow; i++) {
        $("#adminTbody tr").eq(i).show();
    }
    var tempStr = "共" + num + "条记录 分" + totalPage + "页 当前第" + currentPage + "页";
    document.getElementById("barcon1").innerHTML = tempStr;

    if (currentPage > 1) {
        $("#firstPage").on("click", function () {
            goPage(1, psize);
        }).removeClass("ban");
        $("#prePage").on("click", function () {
            goPage(currentPage - 1, psize);
        }).removeClass("ban");
    } else {
        $("#firstPage").off("click").addClass("ban");
        $("#prePage").off("click").addClass("ban");
    }

    if (currentPage < totalPage) {
        $("#nextPage").on("click", function () {
            goPage(currentPage + 1, psize);
        }).removeClass("ban")
        $("#lastPage").on("click", function () {
            goPage(totalPage, psize);
        }).removeClass("ban")
    } else {
        $("#nextPage").off("click").addClass("ban");
        $("#lastPage").off("click").addClass("ban");
    }

    $("#jumpWhere").val(currentPage);
}
function jumpPage() {
    var num = parseInt($("#jumpWhere").val());
    if (num != currentPage_) {
        goPage(num, pageSize);
    }
}



/*
**动态加载团队数量
*/
function dynamicAddTeams(list) {
    for (var i = 0; i < list.length; i++)
    {
        //生成一块
        var DDiv = document.createElement("div");
        DDiv.style.width = "80%";
        DDiv.style.height = "130px";
        DDiv.style.backgroundColor = "white";
        DDiv.style.borderRadius = "50px";
        DDiv.style.margin = "20px";
        DDiv.style.left = "5%";
        DDiv.style.position = "relative";
        $(DDiv).attr("id", "DBlock", "class", "block");
        //序号
        var tdNodeNum = document.createElement("p");
        $(tdNodeNum).html(i + 1 + ".");
        $(tdNodeNum).attr("style", "font-size:20px;position:relative;left:-10px;top:-5px;")
        //团队标号
        var Dhead = document.createElement("a");
        $(Dhead).attr("style", "width:90%;font-size:20px;position:relative;left:50px;top:-66px;")
        $(Dhead).html(list[i].teamid);
        $(Dhead).attr('href', `team.html?teamid=${list[i].teamid}`);
        //分割线
        var Dline = document.createElement("hr");
        Dline.style.width = "100%";
        Dline.style.position = "relative";
        Dline.style.top = "-80px";
        $(Dline).attr("color", "black");
        // //文件描述
        // var DDescrip = document.createElement("p");
        // $(DDescrip).attr("style", "font-size:15px;width:508px;position:relative;height:60px;left:20px;top:-95px;")
        // if(list[i].filename.length < 10) {
        //     if(list[i].description.length < 16) {
        //         $(DDescrip).html(`文件名：${list[i].filename}&emsp;` + `文件描述：${list[i].description}`); 
        //     } else {
        //         $(DDescrip).html(`文件名：${list[i].filename}&emsp;` + `文件描述：${list[i].description.substr(0,16)}<abbr title='${list[i].description}'>...</abbr>`);
        //     }
            
        // } else {
        //     if(list[i].description.length < 16) {
        //         $(DDescrip).html(`文件名：${list[i].filename.substr(0,10)}<abbr title='${list[i].filename}'></abbr>&emsp;` + `文件描述：${list[i].description}`); 
        //     } else {
        //         $(DDescrip).html(`文件名：${list[i].filename.substr(0,10)}<abbr title='${list[i].filename}'></abbr>&emsp;` + `文件描述：${list[i].description.substr(0,16)}<abbr title='${list[i].description}'>...</abbr>`);
        //     }
        // }
        // //文件大小
        // let size = (new Number(list[i].size)).toFixed(2);
        // var DSize = document.createElement("p");
        // $(DSize).attr("style", "font-size:20px;width:200px;position:relative;top:-100px;left:250px;")
        // $(DSize).html(size + 'M');
        //撤销按钮
        var DCancel = document.createElement("a")
        DCancel.innerHTML = "进入团队"
        DCancel.style.width = "100px";
        DCancel.style.height = "30px";
        //DCancel.type = "button";
        DCancel.style.border = "none";
        DCancel.style.borderRadius = "30px";
        DCancel.style.backgroundColor = "#bcbcbc";
        DCancel.style.position = "relative";
        DCancel.style.top = "-40px";
        DCancel.style.left = "400px";
        DCancel.style.outline = 'none';
        DCancel.id = list[i].teamid;
        DCancel.href = `team.html?teamid=${list[i].teamid}`;
        // DCancel.onclick = function() {

        //     $.ajax({
        //         url: 'http://localhost:3000/query/teammates',
        //         type: 'get',
        //         dataType: 'json',
        //         data: `teamid=${this.id}`,
        //         success: function(result) {
        //             // $('#DadminTbody').html(``);
        //             // dynamicAddDocument(result);//记录条数
        //             // DgoPage(1, 3);//每页显示的条数
        //             // var tempOption = "";
        //             // for (var i = 1; i <= DtotalPage; i++) {
        //             //     tempOption += '<option value=' + i + '>' + i + '</option>'
        //             // }
        //             // $("#DjumpWhere").html(tempOption);
        //             console.log(result)
        //         }   
        //     });
        // }
        DDiv.appendChild(tdNodeNum);
        DDiv.appendChild(Dhead);
        DDiv.appendChild(Dline);
        // DDiv.appendChild(DDescrip);
        // DDiv.appendChild(DSize);
        DDiv.appendChild(DCancel);

        $("#Teams")[0].appendChild(DDiv);
    }
}
/**
 * 分页函数
 * pno--页数
 * psize--每页显示记录数
 * 分页部分是从真实数据行开始，因而存在加减某个常数，以确定真正的记录数
 * 纯js分页实质是数据行全部加载，通过是否显示属性完成分页功能
**/
var DpageSize = 0;//每页显示行数
var DcurrentPage_ = 1;//当前页全局变量，用于跳转时判断是否在相同页，在就不跳，否则跳转。
var DtotalPage;//总页数
function MgoPage(pno, psize) {
    var itable = document.getElementById("Teams").getElementsByTagName("hr");
    var num = itable.length;//表格所有行数(所有记录数)
    DpageSize = psize;//每页显示行数
    //总共分几页
    if (num / DpageSize > parseInt(num / DpageSize)) {
        DtotalPage = parseInt(num / DpageSize) + 1;
    } else {
        DtotalPage = parseInt(num / DpageSize);
    }
    var currentPage = pno;//当前页数
    DcurrentPage_ = currentPage;
    var startRow = (currentPage - 1) * DpageSize + 1;
    var endRow = currentPage * DpageSize;
    endRow = (endRow > num) ? num : endRow;
    $("#Teams div").hide();
    for (var i = startRow - 1; i < endRow; i++) {
        $("#Teams div").eq(i).show();
    }
    var tempStr = "共" + num + "条记录 分" + DtotalPage + "页 当前第" + currentPage + "页";
    document.getElementById("DDbarcon3").innerHTML = tempStr;
    console.log(tempStr);

    if (currentPage > 1) {
        $("#MfirstPage").on("click", function () {
            MgoPage(1, psize);
        }).removeClass("ban");
        $("#MprePage").on("click", function () {
            MgoPage(currentPage - 1, psize);
        }).removeClass("ban");
    } else {
        $("#MfirstPage").off("click").addClass("ban");
        $("#MprePage").off("click").addClass("ban");
    }

    if (currentPage < DtotalPage) {
        $("#MnextPage").on("click", function () {
            MgoPage(currentPage + 1, psize);
        }).removeClass("ban")
        $("#MlastPage").on("click", function () {
            MgoPage(DtotalPage, psize);
        }).removeClass("ban")
    } else {
        $("#MnextPage").off("click").addClass("ban");
        $("#MlastPage").off("click").addClass("ban");
    }

    $("#MjumpWhere").val(currentPage);
}
function MjumpPage() {
    var num = parseInt($("#MjumpWhere").val());
    if (num != DcurrentPage_) {
        MgoPage(num, DpageSize);
    }
}