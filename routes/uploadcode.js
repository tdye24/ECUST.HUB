var express = require('express'),
    router = express.Router(),
    formidable = require("formidable"),
    fs = require('fs'),
    neo4j = require('node-neo4j'),
    mysql = require('mysql'),
    pool  = mysql.createPool({
        'host': 'localhost',
        'port': '3306',
        'user': 'root',
        'password': '158728',
        'database': 'eloud'
    });

router.post('/', function (req,res) {
    var form = new formidable.IncomingForm();  
    var date = new Date();
    form.uploadDir = './public/data/temp';
    form.encoding = 'utf-8';
    form.keepExtensions = true;
    form.maxFieldsSize = 20 * 1024 * 1024;
    form.maxFileSize = 2 * 1024 * 1024 * 1024; 
    form.multiples = true; 
    form.parse(req, function(err, fields, files) {
        var user = fields.username;
        var warehouse = fields.warehouse;
        var teamid = fields.teamid;
        console.log("teamid", teamid);
        // var uploadTime = date.toLocaleString();
        var filename = files.file.name;//文件的真实名字
        var size = files.file.size/(1024*1024);
        var oldpath = 'D:\\myProjects\\Eloud\\' + files.file.path;
        var newpath = `D:\\myProjects\\Eloud\\public\\data\\warehouse\\${teamid}\\${decodeURI(warehouse)}\\` + files.file.path.split('\\')[3];
        console.log("oldpath", oldpath);
        console.log("newpath", newpath);
        fs.rename(oldpath, newpath, function(err) {
            console.log("开始fs.rename");
            if(err) {
                res.end(JSON.stringify({status: 'fail'})); 
                return console.error(err);
            } else {
                var time_ = date.toLocaleString();
                var sql = `insert into user_upload_warehouse
                            values('${files.file.path.split('\\')[3]}', '${user}','${time_}','${decodeURI(warehouse)}','${filename}',${size})`;
                console.log(sql);
                pool.getConnection(function(err, connection) {
                    if(err) {
                        return console.error(err);
                        
                    } else {
                        connection.query(sql, function(err, result) {
                            if(err) {
                                return console.error(err);
                                
                            } else {
                                res.end(JSON.stringify({status: 'success', unique_filename: files.file.path.split('\\')[3]}));
                                // console.log(result);
                                
                            }
                        })
                    }
                })        
            }
        })
    }); 
    form.on('end', function() {
        console.log('文件接收完毕！'); 
    }); 
});

module.exports = router;
