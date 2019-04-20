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
        var user = fields.user;
        var title = fields.document_name;//上传时的标题名
        var document_description = fields.document_description;
        var type = fields.type;
        var point = fields.point;
        var uploadTime = fields.uploadTime;
        var filename = files.file.name;//文件title
        var size = files.file.size/(1024*1024);
        var oldpath = 'D:\\myProjects\\ECUSTHUB\\' + files.file.path;
        var newpath = '';
        switch(type) {
            case 'courseware': 
                newpath = 'D:\\myProjects\\ECUSTHUB\\public\\data\\courseware\\' + files.file.path.split('\\')[3];
                break;
            case 'book': 
                newpath = 'D:\\myProjects\\ECUSTHUB\\public\\data\\book\\' + files.file.path.split('\\')[3];
                break;
            case 'software': 
                newpath = 'D:\\myProjects\\ECUSTHUB\\public\\data\\software\\' + files.file.path.split('\\')[3];
                break;
            case 'game': 
                newpath = 'D:\\myProjects\\ECUSTHUB\\public\\data\\game\\' + files.file.path.split('\\')[3];
                break;
            case 'music': 
                newpath = 'D:\\myProjects\\ECUSTHUB\\public\\data\\music\\' + files.file.path.split('\\')[3];
                break;
            case 'video': 
                newpath = 'D:\\myProjects\\ECUSTHUB\\public\\data\\video\\' + files.file.path.split('\\')[3];
                break;
            case 'picture': 
                newpath = 'D:\\myProjects\\ECUSTHUB\\public\\data\\picture\\' + files.file.path.split('\\')[3];
                break;
            case 'other': 
                newpath = 'D:\\myProjects\\ECUSTHUB\\public\\data\\other\\' + files.file.path.split('\\')[3];
                break;
        }
        fs.rename(oldpath, newpath, function(err) {
            if(err) {
                return console.error(err);
                res.end(JSON.stringify({status: 'fail'})); 
            } else {
                db = new neo4j('http://neo4j:158728@localhost:7474');
                var sql = `insert into opr
                            values('${user}','${date.toLocaleString()}',3,'${filename}',10)`;
                console.log(sql);
                pool.getConnection(function(err, connection) {
                    if(err) {
                        return console.error(err);
                        
                    } else {
                        connection.query(sql, function(err, result) {
                            if(err) {
                                return console.error(err);                                
                            } else {
                                connection.release();
                            }
                        })
                    }
                })        
                let label = type.toUpperCase().split('')[0] + type.substr(1,)
                var cypher = `match(user:User{username:'${user}'})
                                with user
                                set user.point = user.point + 10
                                create (user)-[r:Upload{time:'${date.toLocaleString()}'}]->(source:Source:${label}{
                                        description: '${document_description}',
                                        point: ${point},
                                        size: ${size},
                                        title: '${title}',
                                        filename: '${filename}',
                                        path: '\\\\data\\\\' + '${type}'+  '\\\\${files.file.path.split('\\')[3]}',
                                        viewCount: 0,
                                        downloadCount: 0})
                                        return user`;
                db.cypherQuery(cypher, function (err, result) {
                    console.log(cypher);
                    if (err) {
                        res.end(JSON.stringify({status: 'fail'}));
                        return console.error(err);
                    } else {
                        res.end(JSON.stringify({state:'success', point:result.data[0].point}));
                    }
                });
            }
        })
    }); 
    form.on('end', function() {
        console.log('文件接收完毕！'); 
    }); 
});

module.exports = router;
