var express = require('express'),
    router = express.Router(),
    neo4j = require('node-neo4j'),
    mysql = require('mysql'),
    pool  = mysql.createPool({
        'host': 'localhost',
        'port': '3306',
        'user': 'root',
        'password': '158728',
        'database': 'eloud'
    });

router.post('/', function(req, res) {
	let adminame = req.body.adminame;
	let password = req.body.password;
	let cypher = `match(admin:Admin)
					where admin.adminame='${adminame}' and admin.password='${password}'
					return admin`;
	db.cypherQuery(cypher, function(err, result) {
		if(err) {
			return console.error(err);
			
		}
        console.log("hhhhhh");
        console.log(result);
		if(result.data[0]) {
			res.end(JSON.stringify({state: 'success'}));
		}
	});
});

router.get('/user', function(req, res) {
	db = new neo4j('http://neo4j:158728@localhost:7474');
	var cypher1 = `match(user:User)
					return substring(user.IDCard, 0, 2) , count(*)`;
	db.cypherQuery(cypher1, function(err, result1) {
		if(err) {
			return console.error(err);
			
		}
		var cypher2 = `match(user:User)
		                    return user.sex, count(*)`;
        db.cypherQuery(cypher2, function(err, result2) {
            if(err) {
                return console.error(err);
                
            }
            var cypher3 = `match(user:User)
                            return substring(user.IDCard,6,4) + '-' + 
                            substring(user.IDCard,10,2) + '-' + 
                            substring(user.IDCard,12,2)`;
            db.cypherQuery(cypher3, function(err, result3) {
                if(err) {
                    return console.error(err);
                    
                }
                var censusobj = {
                	'11': '北京',
                	'12': '天津',
                	'13': '河北',
                	'14': '山西',
                	'15': '内蒙古',
                	'21': '辽宁',
                	'22': '吉林',
                	'23': '黑龙江',
                	'31': '上海',
                	'32': '江苏',
                	'33': '浙江',
                	'34': '安徽',
                	'35': '福建',
                	'36': '江西',
                	'37': '山东',
                	'41': '河南',
                	'42': '湖北',
                	'43': '湖南',
                	'44': '广东',
                	'45': '广西',
                	'46': '海南',
                	'50': '重庆',
                	'51': '四川',
                	'52': '贵州',
                	'53': '云南',
                	'54': '西藏',
                	'61': '陕西',
                	'62': '甘肃',
                	'63': '青海',
                	'64': '宁夏',
                	'65': '新疆',
                	'71': '台湾',
                	'81': '香港',
                    '82': '澳门'
                }
                let usercensus = [];
                for (var i = 0; i < result1.data.length; i ++) {
                	var o = {
                		name: censusobj[result1.data[i][0]],
                		value: result1.data[i][1] 
                	}
                	usercensus.push(o);        
                }
                let usersex = [];
                for(var i = 0; i < 2; i ++) {
                	if(result2.data[i][0] == '男') {
                		usersex[0] = result2.data[i][1];
                	} else {
                		usersex[1] = result2.data[i][1];
                	}
                }
                let userage = {};
                var now = new Date();
                for(var i = 0; i < result3.data.length; i ++) {
                	let age = parseInt((now - new Date(result3.data[i]))/1000/60/60/24/365);               	
                	if(age in userage) {
                		userage[age] = userage[age] + 1;
                	} else {
                		userage[age] = 1;
                	}
                }
                let x = Object.keys(userage);
                var y = [];
                for(var i = 0; i < Object.keys(userage).length; i++) {
                	y[i] = userage[Object.keys(userage)[i]];
                }
                let data = {
                	census: usercensus,//户籍分布
                	sex: usersex,//性别分布
                	x_data: x,//年龄段分布
                	y_data: y
                }
                res.end(JSON.stringify(data));
            });
        });
	});
});
router.get('/resource/geoCoord', function(req, res) {
    var sql = `select distinct censusname, longitude, latitude 
                from opr a, mininfo b, census c
                where a.id = b.id and b.censusno = c.censusno`;
	pool.getConnection(function(err, connection) {
	    if(err) {
	        return console.error(err);
	        
	    } else {
	        connection.query(sql, function(err, result) {
	            if(err) {
	                return console.error(err);
	                
	            } else {
	                connection.release();
                    let geoCoord = {

                    };
                    for(var i = 0; i < result.length; i ++) {
                        geoCoord[result[i].censusname] = [result[i].longitude, result[i].latitude];
                    }
                    // console.log(geoCoord);
	                res.end(JSON.stringify(geoCoord));
	            }
	        })
	    }
	});
});
/*上传*/
router.get('/resource/line/upload', function(req, res) {
    var sql = `select censusname, opno, count(*) as num 
                from opr a, mininfo b, census c
                where a.id = b.id and b.censusno = c.censusno and opno = 3 
                group by censusname`;
    pool.getConnection(function(err, connection) {
        if(err) {
            return console.error(err);
            
        } else {
            connection.query(sql, function(err, result) {
                if(err) {
                    return console.error(err);
                    
                } else {
                    connection.release();
                    let line = [];
                    for(var i = 0; i < result.length; i ++) {
                        line.push([{name: result[i].censusname}, {name: 'ECloud', value: result[i].num}]);     
                    }
                    // console.log(line);
                    res.end(JSON.stringify(line));
                }
            })
        }
    });
});
/*下载*/
router.get('/resource/line/download', function(req, res) {
    var sql = `select censusname, opno, count(*) as num 
                from opr a, mininfo b, census c
                where a.id = b.id and b.censusno = c.censusno and opno = 4 
                group by censusname`;
    pool.getConnection(function(err, connection) {
        if(err) {
            return console.error(err);
            
        } else {
            connection.query(sql, function(err, result) {
                if(err) {
                    return console.error(err);
                    
                } else {
                    connection.release();
                    let line = [];
                    for(var i = 0; i < result.length; i ++) {                        
                        line.push([{name: 'ECloud'}, {name: result[i].censusname, value: result[i].num}]);                        
                    }
                    // console.log(line);
                    res.end(JSON.stringify(line));
                }
            })
        }
    });
});
router.get('/resource/mark', function(req, res) {
    let mark = [];
    var sql = `select censusname as name, count(*) as value 
                from opr a, mininfo b, census c
                where a.id = b.id and b.censusno = c.censusno and opno = 2
                group by censusname`;
    pool.getConnection(function(err, connection) {
        if(err) {
            return console.error(err);
            
        } else {
            connection.query(sql, function(err, result) {
                if(err) {
                    return console.error(err);
                    
                } else {
                    connection.release();
                    // console.log(result);
                    res.end(JSON.stringify(result));
                }
            })
        }
    });
});

router.get('/amounts', function(req, res) {
    var cypher = `match(doc:Source)
                    return labels(doc)[1] as class,count(doc)`;
    db.cypherQuery(cypher, function(err, result) {
        if(err) {
            return console.error(err);
            
        }
        // console.log(result);
        res.end(JSON.stringify(result.data));
    });
});
module.exports = router;
