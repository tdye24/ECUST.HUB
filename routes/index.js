var express = require('express');
var router = express.Router();
var neo4j = require('node-neo4j');
var mysql = require('mysql');
var session = require('express-session');
var pool  = mysql.createPool({
    'host': 'localhost',
    'port': '3306',
    'user': 'root',
    'password': '158728',
    'database': 'eloud',
});
var date = new Date();


/*session验证*/
router.get('/checklogin', function(req, res, next) {
	// console.log('session验证', req.session);
	if(req.session.username) {
		// console.log('该用户在三十分钟内登录过！');
		let username = req.session.username;
		db = new neo4j('http://neo4j:158728@localhost:7474');
		var cypher = `match(n:User{username:"${username}"}) return n`;
		db.cypherQuery(cypher, function (err, result) {
			if (err) {
				return console.error(err);
			} else {
				if(result.data[0]) {
					// console.log('二次登录成功！');
					if(result.data[0].lastLoginDate != date.toLocaleDateString()) {
						cypher = `match(user:User{username:"${username}"})
									with user
									set user.lastLoginDate = '${date.toLocaleDateString()}', user.point = user.point + 5
									return user`;
						var sql = `insert into opr(id, time, opno, point) values('${username}','${date.toLocaleString()}',2,5)`;
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
						db.cypherQuery(cypher, function(err, result) {
							if(err) {
								return console.error(err);
								
							}
							// let resultObj = result.data[0];
							// let obj = {
							// 	status: 'success',
							// 	username: resultObj.username,
							// 	sex: resultObj.sex,
							// 	motto: resultObj.motto,
							// 	telephone: resultObj.telephone,
							// 	email: resultObj.email,
							// 	campusCardId: resultObj.campusCardId,
							// 	point: resultObj.point
							// }
							// res.end(JSON.stringify(obj));
						})

					} //else {
						// let resultObj = result.data[0];
						// let obj = {
						// 	status: 'success',
						// 	username: resultObj.username,
						// 	sex: resultObj.sex,
						// 	motto: resultObj.motto,
						// 	telephone: resultObj.telephone,
						// 	email: resultObj.email,
						// 	campusCardId: resultObj.campusCardId,
						// 	point: resultObj.point
						// }
						// res.end(JSON.stringify(obj));
					//}			
					res.end(JSON.stringify({havelogan: true, username: req.session.username}));
				} else {
					console.log('登录失败！');
					// let result_ = {
					// 	status: 'fail',
					// };
					// res.end(JSON.stringify(result_));
					// res.end(JSON.stringify({havelogan: true, username: req.session.username}));
				}
			}
		});
	} else {
		res.end(JSON.stringify({havelogan: false}));
	}
});
/*登录*/
router.post('/', function(req, res, next) {
	let date = new Date();
    let username = req.body.username;
    let password = req.body.password;
    //连接数据库
    db = new neo4j('http://neo4j:158728@localhost:7474');
	var cypher = `match(n:User{username:"${username}",password:"${password}"}) return n`;
	db.cypherQuery(cypher, function (err, result) {
		if (err) {
			return console.error(err);
		} else {
			if(result.data[0]) {
				// console.log('登录成功！');
				req.session.username = req.body.username;
				res.end(JSON.stringify({status: 'success'}));
				// console.log('上次登录日期', result.data[0].lastLoginDate);
				// console.log('本次登陆日期', date.toLocaleDateString());
				if(result.data[0].lastLoginDate != date.toLocaleDateString()) {
					cypher = `match(user:User{username:"${username}"})
								with user
								set user.lastLoginDate = '${date.toLocaleDateString()}', user.point = user.point + 5
								return user`;
					var sql = `insert into opr(id, time, opno, point) values('${username}','${date.toLocaleString()}',2,5)`;
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
					db.cypherQuery(cypher, function(err, result) {
						if(err) {
							return console.error(err);
						}
						let resultObj = result.data[0];
						let obj = {
							status: 'success',
							username: resultObj.username,
							sex: resultObj.sex,
							motto: resultObj.motto,
							telephone: resultObj.telephone,
							email: resultObj.email,
							campusCardId: resultObj.campusCardId,
							point: resultObj.point
						}
						res.end(JSON.stringify(obj));
					})

				} else {
					let resultObj = result.data[0];
					let obj = {
						status: 'success',
						username: resultObj.username,
						sex: resultObj.sex,
						motto: resultObj.motto,
						telephone: resultObj.telephone,
						email: resultObj.email,
						campusCardId: resultObj.campusCardId,
						point: resultObj.point
					}
					res.end(JSON.stringify(obj));
				}			
				
			} else {
				// console.log('登录失败！');
				result = {
					status: 'fail',
				};
				res.end(JSON.stringify(result));
			}
		}
	});
});

module.exports = router;
