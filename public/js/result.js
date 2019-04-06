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
                    url: 'http://localhost:3000/query/source',
                    type: 'get',
                    dataType: 'json',
                    data: `key=${key}`,
                    success: function(data) {
                        // console.log(data.result);
                        dynamicAddDocument(data.result);//记录条数
                        DgoPage(1, 3);//每页显示的条数
                        var tempOption = "";
                        for (var i = 1; i <= DtotalPage; i++) {
                            tempOption += '<option value=' + i + '>' + i + '</option>'
                        }
                        $("#DjumpWhere").html(tempOption);
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
            }
        }
    });
})

function dynamicAddDocument(doclist) {
    for (var i = 0; i < doclist.length; i++) {
        var DDiv = document.createElement("div");
        DDiv.style.width = "65%";
        DDiv.style.height = "180px";
        DDiv.style.backgroundColor = "white";
        DDiv.style.borderRadius = "50px";
        DDiv.style.margin = "20px";
        DDiv.style.left = "17%";
        DDiv.style.position = "relative";
        DDiv.style.border = "1px solid black";
        $(DDiv).attr("id", "DBlock");

    

        var Dhead = document.createElement("a");
        $(Dhead).attr("style", "width:90%;font-size:25px;position:relative;left:65px;top:-0px;")
        $(Dhead).html(doclist[i].info.title);
        var DHA = document.createElement("a")
        $(DHA).attr("href", `detail.html?id=${doclist[i].info._id}`);

        var Dline = document.createElement("hr");
        Dline.style.width = "100%";
        Dline.style.position = "relative";
        Dline.style.top = "3px";
        Dline.style.borderWidth = "0.5px";
        $(Dline).attr("color", "black");

        var Dimg = document.createElement("img")
        if(doclist[i].sex == '男') {
            $(Dimg).attr("src", "../images/man.png");
        } else {
            $(Dimg).attr("src", "../images/woman.png");
        }
        Dimg.style.position = "relative";
        Dimg.style.width = "35px";
        Dimg.style.height = "35px";
        Dimg.style.left = "500px";
        Dimg.style.top = "-85px";


        var DLA = document.createElement("a")
        $(DLA).attr("href", `otherusercenter.html?username=${doclist[i].user}`);
        /*
         *文件上传人
         */
        var Dlaucher = document.createElement("p")
        Dlaucher.style.position = "relative";
        Dlaucher.style.left = "190px";
        Dlaucher.style.top = "-52px";
        Dlaucher.style.fontSize = "14px";
        $(Dlaucher).html(doclist[i].user);
        /*
         *文件上传时间
         */
        var Dtime = document.createElement("p")
        Dtime.style.position = "relative";
        Dtime.style.left = "545px";
        Dtime.style.top = "-115px";
        Dtime.style.fontSize = "13px";
        $(Dtime).html(doclist[i].time);
        /*
         *文件描述
         */
        var DDescrip = document.createElement("p");
        $(DDescrip).attr("style", "font-size:15px;width:650px;position:relative;height:80px;left:65px;top:-100px;")
        $(DDescrip).html(doclist[i].info.description)

        /*
         *文件大小
         */
        var size = new Number(doclist[i].info.size).toFixed(2);
        var DSize = document.createElement("p");
        $(DSize).attr("style", "font-size:20px;width:200px;position:relative;top:-97px;left:420px;")
        $(DSize).html('文件大小： ' + size + 'M');
        /*
         *文件积分
         */
        var Dpoint = document.createElement("p");
        $(Dpoint).attr("style", "font-size:20px;width:200px;position:relative;top:-170px;left:65px;")
        $(Dpoint).html('下载所需积分： ' + doclist[i].info.point);

        var DA = document.createElement("a")
        $(DA).attr("href", `detail.html?id=${doclist[i].info._id}`);

        var DCancel = document.createElement("input")
        DCancel.style.width = "100px";
        DCancel.style.height = "30px";
        DCancel.type = "button";
        DCancel.value = "详情";
        DCancel.style.border = "none";
        DCancel.style.borderRadius = "30px";
        DCancel.style.backgroundColor = "#bcbcbc";
        DCancel.style.outline = 'none';
        DCancel.style.position = "relative";
        DCancel.style.top = "-133px";
        DCancel.style.left = "600px";

        DA.appendChild(DCancel);
        DLA.appendChild(Dlaucher);
        DLA.appendChild(Dimg);
        DHA.appendChild(Dhead);

        DDiv.appendChild(DHA);
        DDiv.appendChild(Dline);
        DDiv.appendChild(DLA);
        DDiv.appendChild(Dtime);
        DDiv.appendChild(DDescrip);
        DDiv.appendChild(DSize);
        DDiv.appendChild(DA);
        DDiv.appendChild(Dpoint);

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
    // if(num == 0) {
    // 	alert('未查询到相关信息！');
    // 	window.location.href = '../search.html';
    // }
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