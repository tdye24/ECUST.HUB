$(function () {
    $('#username').focusin(function() {
        $('#username_valid').html('');
    })
    $('#username').focusout(function() {
        let username = $('#username').val();
        let pattern = /(^\s+)|(\s+$)/g
        if(username.length === 0 ) {
            alert('用户名不能为空！');
            $('#username').val('');
            return false;
        } else if(pattern.test(username)||username.indexOf(' ')!=-1) {
            alert('用户名中不能包含空格！');
            $('#username').val('');
            return false;
        } else {
            $.ajax({
                url: `http://localhost:3000/check/name`,
                type: 'get',
                data: `username=${username}`,
                dataType: 'json',
                success: function(result) {
                    if(result.valid) {
                        $('#username_valid').html('用户名不存在！');
                        $('#username').val('');
                    } else {
                        $('#username_valid').html('√');   
                    }

                }
            })
        } 
    })
    $('#submit1').click(function() {
        let obj = {
            username: $('#username').val(),
        }
        $.ajax({
            url: 'http://localhost:3000/update/retrieve',
            type: 'post',
            dataType: 'json',
            data: obj,
            success: function(result) {
                // console.log(result);
                if(result.status == 'success') {
                    $('#usernamein').css('display', 'none');
                    $('#sendusername').css('display', 'block');
                    $('#action1').css('font-weight','normal');
                    $('#action2').css('font-weight','bold');
                    $('#button').css('display', 'none');
                    $('#amail').html(result.email);
                    $(".mail").each(function () {
                        var url = $(this).text().split('@')[1];
                        for (var j in hash) {
                            $(this).attr("href", hash[url]);
                        }
                    });
                }
            }
        });
    });
});

var hash = {
    'qq.com': 'http://mail.qq.com',
    'gmail.com': 'http://mail.google.com',
    'sina.com': 'http://mail.sina.com.cn',
    '163.com': 'http://mail.163.com',
    '126.com': 'http://mail.126.com',
    'yeah.net': 'http://www.yeah.net/',
    'sohu.com': 'http://mail.sohu.com/',
    'tom.com': 'http://mail.tom.com/',
    'sogou.com': 'http://mail.sogou.com/',
    '139.com': 'http://mail.10086.cn/',
    'hotmail.com': 'http://www.hotmail.com',
    'live.com': 'http://login.live.com/',
    'live.cn': 'http://login.live.cn/',
    'live.com.cn': 'http://login.live.com.cn',
    '189.com': 'http://webmail16.189.cn/webmail/',
    'yahoo.com.cn': 'http://mail.cn.yahoo.com/',
    'yahoo.cn': 'http://mail.cn.yahoo.com/',
    'eyou.com': 'http://www.eyou.com/',
    '21cn.com': 'http://mail.21cn.com/',
    '188.com': 'http://www.188.com/',
    'foxmail.com': 'http://www.foxmail.com'
};


