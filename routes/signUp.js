var express = require('express');
var router = express.Router();
var neo4j = require('node-neo4j');
var mysql = require('mysql');
var pool  = mysql.createPool({
    'host': 'localhost',
    'port': '3306',
    'user': 'root',
    'password': '158728',
    'database': 'eloud',
});
/*登录*/
router.post('/', function(req, res, next) {
    let date = new Date();
    let username = req.body.username;
    let campusCardId = req.body.campusCardId;
    let sex = req.body.sex;
    let email = req.body.email;
    let motto = req.body.motto;
    let telephone = req.body.telephone;
    let IDCard = req.body.IDCard;
    let password = req.body.password;
    let point = 100;
    //连接数据库
    db = new neo4j('http://neo4j:158728@localhost:7474');
    var cypher = `create(n:User{
                    username:"${username}",
                    campusCardId: "${campusCardId}",
                    sex: "${sex}",
                    email: "${email}",
                    motto: "${motto}",
                    telephone: "${telephone}",
                    IDCard: "${IDCard}",
                    password:"${password}",
                    point: ${point},
                    lastLoginDate: '2018-11-11'
                        })`;
    var sql = `insert into opr(id, time, opno, point) values('${username}','${date.toLocaleString()}', 1, 100)`;
    pool.getConnection(function(err, connection) {
        if(err) {
            return console.error(err);
            
        } else {
            connection.query(sql, function(err, result) {
                if(err) {
                    return console.error(err);
                    
                } else {
                    // console.log(result);
                    connection.release();
                }
            })
        }
    })
    var sql1 = `insert into mininfo(id, censusno) values('${username}','${IDCard.substring(0,2)}')`;
    pool.getConnection(function(err, connection) {
        if(err) {
            return console.error(err);
            
        } else {
            connection.query(sql1, function(err, result) {
                if(err) {
                    return console.error(err);
                    
                } else {
                    // console.log(result);
                    connection.release();
                }
            })
        }
    })
    db.cypherQuery(cypher, function (err, result) {
        if (err) {
            res.end(JSON.stringify({status: 'fail'}));
            return console.error(err);
        } else {
            let resData = {
                status: 'success',
                username: username,
                point: 100,
            }
            res.end(JSON.stringify(resData));
        }
    });
});

module.exports = router;
