$(function() {
    $.ajax({
        url: 'http://localhost:3000/checklogin',
        type: 'get',
        dataType: 'json',
        data: '',
        success: function(result) {
            // console.log(result);
            if(!result.havelogan) {
                location.href = './index.html';
            } else {
                let username = result.username;
                $.ajax({
                    url: 'http://localhost:3000/query/info',
                    type: 'get',
                    dataType: 'json',
                    data: `username=${username}`,
                    success: function(result) {
                        // console.log(result);
                        var usernameText = '用&nbsp;户&nbsp;名:&emsp;' + result.username;
                        var pointText = '积&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分:&emsp;' + result.point;
                        if(result.sex == '男') {
                            $('#avatar').attr('src', '../images/man.png');
                        } else {
                            $('#avatar').attr('src', '../images/woman.png');
                        }
                        $('#username').html(usernameText);
                        $('#point').html(pointText);
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
                        $('#queryBtn').click(function() {
                            let key = $('#key').val();
                            let pattern = /(^\s+)|(\s+$)/g
                            if(key.length === 0 ) {
                                alert('查询关键词不能为空！');
                                $('#key').val('');
                                return false;
                            } else if(pattern.test(key)) {
                                alert('查询关键词前后不能有空格！');
                                $('#key').val('');
                                return false;
                            } else {
                                location.href = `../result.html?key=${key}`;
                            }
                            
                        });
                        $.ajax({
                            url: 'http://localhost:3000/query/recommend_user',
                            type: 'get',
                            dataType: 'json',
                            data: `username=${username}`,
                            success: function(result) {
                                dynamicuser(result);//记录条数
                                DgoPage(1, 4);//每页显示的条数
                                var tempOption = "";
                                for (var i = 1; i <= DtotalPage; i++) {
                                    tempOption += '<option value=' + i + '>' + i + '</option>'
                                }
                                $("#DjumpWhere").html(tempOption);
                            }
                        });
                        $('#recommend_source').click(function() {
                            $.ajax({
                                url: `http://localhost:3000/query/recommend_source`,
                                type: 'get',
                                dataType: 'json',
                                data: `username=${username}`,
                                success: function(result) {
                                    // console.log(result);
                                }
                            })
                        });
                        $('#recommend_source').click(function() {
                            $.ajax({
                                url: 'http://localhost:3000/query/recommend_source',
                                type: 'get',
                                dataType: 'json',
                                data: `username=${username}`,
                                success: function(result) {
                                    // console.log(result);
                                    dynamicdocument(result);//记录条数
                                    UgoPage(1, 2);//每页显示的条数
                                    var tempOption = "";
                                    for (var i = 1; i <= UtotalPage; i++) {
                                        tempOption += '<option value=' + i + '>' + i + '</option>'
                                    }
                                    $("#UjumpWhere").html(tempOption);

                                }
                            });
                        });
                        $('#search_friend').click(function() {
                            let username = $('#friend_username').val();
                            location.href = `../otherusercenter.html?username=${username}`;
                        });
                    }
                });
                
                
            }
        }
    })
});
//添加用户
function dynamicuser(userlist) {
    for (var i = 0; i < userlist.length; i++) {
        var DDiv = document.createElement("div");
        if (i % 4 == 0) {
            $(DDiv).attr("class", "user1");
        } else if (i % 4 == 1) {
            var DDiv = document.createElement("div");
            $(DDiv).attr("class", "user3");
        } else if (i % 4 == 2) {
            var DDiv = document.createElement("div");
            $(DDiv).attr("class", "user2");
        } else {
            var DDiv = document.createElement("div");
            $(DDiv).attr("class", "user4");
        }
        var divusera = document.createElement("a");
        divusera.id = "usera";
        $(divusera).attr("href", `otherusercenter.html?username=${userlist[i][0]}`);

        var userimg = document.createElement("img");
        userimg.id = "userimg";
        if(userlist[i][1] == '男') {
            $(userimg).attr("src", "../images/man.png");
        } else {
            $(userimg).attr("src", "../images/woman.png");
        }
        
        $(userimg).attr("class", "userimage");

        var username = document.createElement("p");
        $(username).attr("class", "username");
        username.id = "username";
        $(username).html(userlist[i][0]);

        var usermotto = document.createElement("p");
        $(usermotto).attr("class", "usermotto");
        usermotto.id = "usermotto";
        $(usermotto).html('hhh');

        DDiv.appendChild(divusera);
        divusera.appendChild(userimg);
        divusera.appendChild(username);
        divusera.appendChild(usermotto);

        $("#DadminTbody")[0].appendChild(DDiv);

    }
}
var DpageSize = 0;//每页显示行数
var DcurrentPage_ = 1;//当前页全局变量，用于跳转时判断是否在相同页，在就不跳，否则跳转。
var DtotalPage;//总页数
function DgoPage(pno, psize) {
    var itable = document.getElementById("DadminTbody").getElementsByTagName("a");
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
var classify = ['Courseware','Book','Software','Game','Other','Music','Video','Picture'];//获取文件类别
//推荐文件
function dynamicdocument(doclist) {
    for (var i = 0; i < doclist.length; i++) {

        var UDiv = document.createElement("div");
        UDiv.id = "source";
        $(UDiv).attr("class", "source");

        var ua = document.createElement("a");
        $(ua).attr("href", `detail.html?id=${doclist[i][2]}`);

        var uimg = document.createElement("img");
        $(uimg).attr("class", "sourcelogo")
        uimg.id = "sourcelogo"+i;
        switch (doclist[i][3]) {
            case classify[0]: {;
                uimg.src = "images/logo/1.png";
                break;
            }
            case classify[1]: {
                uimg.src = "images/logo/2.png";
                break;
            }
            case classify[2]: {
                uimg.src = "images/logo/3.png";
                break;
            }
            case classify[3]: {
                uimg.src = "images/logo/4.png";
                break;
            }
            case classify[4]: {
                uimg.src = "images/logo/5.png";
                break;
            }
            case classify[5]: {
                uimg.src = "images/logo/6.png";
                break;
            }
            case classify[6]: {
                uimg.src = "images/logo/7.png";
                break;
            }
            case classify[7]: {
                uimg.src = "images/logo/8.png";
                break;
            }
        }
       

        var up = document.createElement("p");
        $(up).attr("class", "sourcename");
        up.id = "sourcename";
        $(up).html(doclist[i][0]);

        var ud = document.createElement("p");
        $(ud).attr("class", "description");
        $(ud).html(doclist[i][1]);
        ud.id = "documentdescription";

        UDiv.appendChild(ua);
        UDiv.appendChild(ud);
        ua.appendChild(uimg);
        ua.appendChild(up);


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
