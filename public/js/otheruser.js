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
                        $('#myusername').html('用户名：' + info.username);
                        $('#mypoint').html('积&emsp;分：' + info.point);
                        if(info.sex == '男') {
                            $('#myavatar').attr('src', '../images/man.png');
                        } else {
                            $('#myavatar').attr('src', '../images/woman.png');
                        }
                        let otherusername = (window.location.search).split('=')[1];
                        $.ajax({
                            url: 'http://localhost:3000/query/info',
                            type: 'get',
                            dataType: 'json',
                            data: `username=${otherusername}`,
                            success: function(result) {
                                $('#o_username').html('用户名:&emsp;' + result.username);
                                $('#o_point').html('积&nbsp;&nbsp;&nbsp分:&emsp;' + result.point);
                                $('#o_motto').html('个性签名：&nbsp;' + result.motto);
                                $('#username').html(result.username);
                                $('#sex').html(result.sex);
                                if(result.sex == '男') {
                                    $('#other_avatar1').attr('src', '../images/man.png');
                                    $('#other_avatar2').attr('src', '../images/man.png');
                                } else {
                                    $('#other_avatar1').attr('src', '../images/woman.png');
                                    $('#other_avatar2').attr('src', '../images/woman.png');
                                }
                                $('#campusCardId').html(result.campusCardId);
                                $('#email').html(result.email);
                                $('#telephone').html(result.telephone);
                                $('#motto').html(result.motto);
                            }
                        });
                        let post_data = {
                                from: username,
                                to: decodeURI(otherusername)
                            }
                        $.ajax({
                            url: 'http://localhost:3000/check/follow',
                            type: 'post',
                            dataType: 'json',
                            data: post_data,
                            success: function(result) {
                                // console.log(result);
                                if(result.have) {
                                    $('#follow').css('display', 'none');
                                }
                            }
                        });
                        $('#search').click(function() {
                            let key = $('#search_key').val();
                            location.href = `../result.html?key=${key}`;
                        });
                        $('#follow').click(function() {
                            let postdata = {
                                from: username,
                                to: decodeURI(otherusername)
                            }
                            // console.log(postdata);
                            $.ajax({
                                url: 'http://localhost:3000/update/follow',
                                type: 'post',
                                dataType: 'json',
                                data: postdata,
                                success: function(result) {
                                    if(result.status == 'success') {
                                        $('#follow').css('display', 'none');
                                        alert('关注成功！');
                                    }
                                }
                            });
                        });
                        $('#uploadrecord').click(function() {
                            $.ajax({
                                url: 'http://localhost:3000/query/uploadrecord',
                                type: 'get',
                                dataType: 'json',
                                data: `username=${otherusername}`,
                                success: function(result) {
                                    // console.log(result);
                                    dynamicAddDocument(result);//记录条数
                                    DgoPage(1, 3);//每页显示的条数
                                    var tempOption = "";
                                    for (var i = 1; i <= DtotalPage; i++) {
                                        tempOption += '<option value=' + i + '>' + i + '</option>'
                                    }
                                    $("#DjumpWhere").html(tempOption);
                                }
                            })
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
                    }
                });
            }
        }
    });	
})

function dynamicAddDocument(doclist) {
    for (var i = 0; i < doclist.length; i++) {
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
        $(Dhead).attr('href', `detail.html?id=${doclist[i]._id}`);
        $(Dhead).attr("style", "width:90%;font-size:20px;position:relative;left:50px;top:-66px;")
        $(Dhead).html(doclist[i].title);
        //分割线
        var Dline = document.createElement("hr");
        Dline.style.width = "100%";
        Dline.style.position = "relative";
        Dline.style.top = "-80px";
        $(Dline).attr("color", "black");
        //文件描述
        var DDescrip = document.createElement("p");
        $(DDescrip).attr("style", "font-size:15px;width:508px;position:relative;height:60px;left:20px;top:-95px;")
        $(DDescrip).html(doclist[i].description)
        //文件大小

        var DSize = document.createElement("p");
        $(DSize).attr("style", "font-size:20px;width:200px;position:relative;top:-100px;left:400px;")
        $(DSize).html((new Number(doclist[i].size)).toFixed(2) + 'M');

        DDiv.appendChild(tdNodeNum);
        DDiv.appendChild(Dhead);
        DDiv.appendChild(Dline);
        DDiv.appendChild(DDescrip);
        DDiv.appendChild(DSize);

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