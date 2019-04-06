var express = require('express'),
    router = express.Router(),
    neo4j = require('node-neo4j'),
    levenshtein = require('../utils/levenshtein'),
    compare = require('../utils/compare'),
    screen = require('../utils/screen')
    mysql = require('mysql'),
    pool  = mysql.createPool({
        'host': 'localhost',
        'port': '3306',
        'user': 'root',
        'password': '158728',
        'database': 'eloud',
    });
var db = new neo4j('http://neo4j:158728@localhost:7474');
var fs = require("fs");

router.get('/pointrecord', function(req, res) {   
    let username = req.query.username;
    var sql = `select time,opno,info,point from opr
                where id='${username}'
                order by time desc`;
    pool.getConnection(function(err, connection) {
        connection.query(sql, function(err, result) {
            if(err) {
                return console.error(err);
                
            } else {
                connection.release();
                res.end(JSON.stringify(result));
            }
            
        });
    });
})

router.get('/source', function(req, res) {
    let key = req.query.key;
    var keylist = key.split('');
    var re = '.*?';
    for(var i = 0; i < keylist.length; i ++) {
        re += keylist[i] + '.*?';
    }
    var cypher = `match(user:User)-[r:Upload]->(n)
                    where n.title=~'(?i)${re}'
                    return user.username,r.time,n,user.sex`;
    db.cypherQuery(cypher, function(err, result) {
        if(err) {
            return console.error(err);
            
        }
        var data = result.data;
        var resultlist = [];
        for(var i = 0; i < data.length; i ++) {
            var obj = {
                user: data[i][0],
                time: data[i][1],
                info: data[i][2],
                sex: data[i][3],
                relevancy: levenshtein(key, data[i][2].title)
            };
            resultlist.push(obj);
        }
        res.end(JSON.stringify({result:resultlist.sort(compare('relevancy'))}));
    });


});

router.get('/docdetail', function(req, res) {
    let id = req.query.id;
    var cypher = `match(user:User)-[r:Upload]->(doc)
                    where id(doc)=${id}
                    return user.username,user.point,user.motto,r.time,doc,user.sex`;
    db.cypherQuery(cypher, function(err, result) {
        if(err) {
            return console.error(err);
            
        }
        res.end(JSON.stringify(result));
    });
});

router.get('/uploadrecord', function(req, res) {
    let username = req.query.username;
    var cypher = `match(user:User{username:'${username}'})-[:Upload]->(doc:Source)
                    return doc`;
    db.cypherQuery(cypher, function(err, result) {
        if(err) {
            return console.error(err);
            
        }
        res.end(JSON.stringify(result.data));
    });
});

router.get('/follow', function(req, res) {
    let username = req.query.username;
    var cypher = `match(from:User)-[:Follow]->(to:User)
                    where from.username='${username}'
                    return to.username, to.motto, to.sex`;
    db.cypherQuery(cypher, function(err, result) {
        if(err) {
            return console.error(err);
            
        }
        res.end(JSON.stringify(result.data));
    })
});

router.get('/info', function(req, res) {
    let username = req.query.username;
    var cypher = `match(user:User)
                    where user.username='${username}'
                    return user`;
    db.cypherQuery(cypher, function(err, result) {
        // console.log(cypher);
        if(err) {
            return console.error(err);
            
        } 
        let resdata = {
            username: result.data[0].username,
            sex: result.data[0].sex,
            point: result.data[0].point,
            campusCardId: result.data[0].campusCardId,
            email : result.data[0].email,
            telephone: result.data[0].telephone,
            motto: result.data[0].motto
        }
        res.end(JSON.stringify(resdata));
    })
});

router.get('/recommend_user', function(req, res) {
    let username = req.query.username;
    var cypher = `match p=(host:User)-[:Follow|:Upload|:Download*1..6]-(fof:User)
                    where host.username = '${username}'
                    and not (host)-[:Follow]->(fof)
                    and host.username <> fof.username
                    return fof.username as username,
                            fof.sex as sex,
                            fof.motto as motto,
                            length(p) as length
                    order by length`;
    db.cypherQuery(cypher, function(err, result) {
        if(err) {
            return console.error(err);
            
        }
        let resdata = screen(result.data);
        
        if(result.data.length == 0) {
            var cypher = `match (user:User)
                            return user.username as username,
                                    user.sex as sex,
                                    user.motto as motto
                                    limit 4`;
            db.cypherQuery(cypher, function(err, result_) {
                

                res.end(JSON.stringify(result_.data))
            })
            return ;

        }
        
        res.end(JSON.stringify(resdata));
    })
});

router.get('/recommend_source', function(req, res) {
    let username = req.query.username;
    var cypher = `match p=(host:User)-[:Follow|:Upload|:Download*1..6]-(ps:Source)
                    where host.username = '${username}'
                    and not (host)-[:Upload|:Download]->(ps)
                    return substring(ps.title, 0, 30) as title,
                            substring(ps.filename, 0, 30) as filename, 
                            id(ps) as id,
                            labels(ps)[1] as type,
                            length(p) as length
                    order by length`;
    db.cypherQuery(cypher, function(err, result) {
        let resdata = screen(result.data);
        console.log(result);
        console.log(resdata);
        
        if(err) {
            return console.error(err);
            
        }
        if(result.data.length == 0) {
            var cypher = `match (source:Source)
                            return
                            substring(source.title, 0, 30) as title,
                            substring(source.filename, 0, 30) as filename, 
                            id(source) as id,
                            labels(source)[1] as type
                                    limit 4`;
            db.cypherQuery(cypher, function(err, result2) {
                console.log(result2);
                

                res.end(JSON.stringify(result2.data))
            })
            return ;

        }
        res.end(JSON.stringify(resdata));
    })
});

router.get('/comment', function(req, res) {
    let src = req.query.id;
    pool.getConnection(function(err, connection) {
        if(err) {
            return console.error(err);
            
        }
        let sql = `select * from like_num where src = ${src} order by like_num desc, time desc`;
        connection.query(sql, function(err, result) {
            if(err) {
                return console.error(err);
                
            }
                // console.log(result);
                connection.release();
                res.end(JSON.stringify(result));
            })
        })
        
});

router.get('/islike', function(req, res) {
    let username = req.query.username;
    pool.getConnection(function(err, connection) {
        if(err) {
            return console.error(err);
            
        } else {
            let sql = `select comment_id from user_like where username = '${username}'`;
            connection.query(sql, function(err, result) {
                if(err) {
                    return console.error(err);
                    
                } else {
                    connection.release();
                    let like_list = [];
                    for(let i = 0; i < result.length; i ++) {
                        like_list.push(result[i].comment_id);
                    }
                    res.end(JSON.stringify(like_list));
                }
            });
        }
    })
});

router.get('/comment4more', function(req, res) {
    let comment_id = req.query.comment_id;
    pool.getConnection(function(err, connection) {
        if(err) {
            return console.error(err);
            
        }
        let sql = `select * from like_num where parentnode = ${comment_id}`;
        connection.query(sql, function(err, result) {
            if(err) {
                return console.error(err);
                
            }
            connection.release();
            res.end(JSON.stringify(result));
        });
    })
});

router.get('/mycomments', function(req, res) {
    let username = req.query.username;
    pool.getConnection(function(err, connection) {
        if(err) {
            return console.error(err);
            
        }
        let sql = `select * from like_num where username = '${username}'`;
        connection.query(sql, function(err, result) {
            if(err) {
                return console.error(err);
                
            }
            connection.release();
            res.end(JSON.stringify(result));
        });
    })
});


router.get('/myteams', function(req, res) {
    let username = req.query.username;
    pool.getConnection(function(err, connection) {
        if(err) {
            return console.error(err);
            
        }
        let sql = `select * from user_team where id = '${username}'`;
        connection.query(sql, function(err, result) {
            if(err) {
                return console.error(err);
                
            }
            connection.release();
            res.end(JSON.stringify(result));
        });
    })

})

router.get('/teammates', function(req, res) {
    let teamid = req.query.teamid;
    pool.getConnection(function(err, connection) {
        if(err) {
            return console.error(err);
            
        }
        let sql = `select * from user_team where teamid = '${teamid}'`;
        connection.query(sql, function(err, result) {
            if(err) {
                return console.error(err);
                
            }
            connection.release();
            res.end(JSON.stringify(result));
        });
    })

})

router.get('/warehouses', function(req, res) {
    let teamid = req.query.teamid;
    pool.getConnection(function(err, connection) {
        if(err) {
            return console.error(err);
            
        }
        let sql = `select warehouse from team_warehouse where teamid = '${teamid}'`;
        connection.query(sql, function(err, result) {
            if(err) {
                return console.error(err);
                
            }
            connection.release();
            res.end(JSON.stringify(result));
        });
    })

})


router.get('/warehouse_code', function(req, res) {
    let warehouse = req.query.warehouse;
    pool.getConnection(function(err, connection) {
        if(err) {
            return console.error(err);
            
        }
        let sql = `select unique_filename, id, time, warehouse, codename,codesize from user_upload_warehouse where warehouse = '${warehouse}'`;
        connection.query(sql, function(err, result) {
            if(err) {
                return console.error(err);
                
            }
            connection.release();
            console.log(result);
            // console.log(result[0].path);
            // let code_path = "D:/MyProjects/Eloud/public/" + result[0].path;
            // console.log(code_path);
            // fs.readdir(code_path, function(err, data) {
            //     if(err) {
            //         console.log(err);
            //         
            //     }
            //     console.log(data);
            //     res.end(JSON.stringify(data));
            // });
            res.end(JSON.stringify(result));
        });
    })

})


router.get('/codedetail', function(req, res) {
    let teamid = req.query.teamid;
    let warehouse = req.query.warehouse;
    let unique_filename = req.query.unique_filename;
    
    pool.getConnection(function(err, connection) {
        if(err) {
            return console.error(err);
            
        }
        console.log(warehouse);
        let code_path = `D:/MyProjects/Eloud/public/data/warehouse/${teamid}/${warehouse}/${unique_filename}`;
        fs.readFile(code_path, 'utf-8', function(err, data) {
            if(err) {
                return console.error(err);
                
            }
            res.end(JSON.stringify({status: 'success', data: data}));
        });

    })
})


router.get('/isnamevalid', function(req, res) {
    let username = req.query.username;
    var cypher = `match(n:User{username:"${username}"})
                    return n`;
    db.cypherQuery(cypher, function(err, result) {
        if(err) {
            return console.error(err);
            
        }
        if(result.data[0]) {
            res.end(JSON.stringify({valid: true, message: '存在该用户！'}));
        } else {
            res.end(JSON.stringify({valid: false, message: '不存在该用户，请确认用户名！'}));
        }
    })
})


router.get('/permission', function(req, res) {
    let username = req.query.username;
    let teamid = decodeURI(req.query.teamid);
    pool.getConnection(function(err, connection) {
        if(err) {
            return console.error(err);
            
        }
        let sql = `select permission from user_team where id = '${username}' and teamid = '${teamid}'`;
        connection.query(sql, function(err, result) {
            if(err) {
                return console.error(err);
                
            }
            connection.release();
            res.end(JSON.stringify(result));
        });
    })
})


router.get('/invitation', function(req, res) {
    let id = req.query.username;
    let sql = `select count(*) as num from invitation where id = '${id}'`;
    pool.getConnection(function(err, connection) {
        if(err) {
            return console.error(err);
            
        }
        connection.query(sql, function(err, result) {
            if(err) {
                return console.error(err);
                
            }
            connection.release();
            res.end(JSON.stringify(result[0]));
        });
    })
    
})


router.get('/invitation_teams', function(req, res) {
    let id = req.query.username;
    let sql = `select * from invitation where id = '${id}'`;
    pool.getConnection(function(err, connection) {
        if(err) {
            return console.error(err);
            
        }
        connection.query(sql, function(err, result) {
            if(err) {
                return console.error(err);
                
            }
            connection.release();
            res.end(JSON.stringify(result));
        });
    })
    
})

module.exports = router;
