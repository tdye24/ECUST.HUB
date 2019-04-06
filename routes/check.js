var express = require('express'),
    router = express.Router(),
    neo4j = require('node-neo4j');
    db = new neo4j('http://neo4j:158728@localhost:7474'),
    redis = require('redis');

router.get('/name', function (req,res) {
    db = new neo4j('http://neo4j:158728@localhost:7474');
    let username = req.query.username;
    let cypher = `match(n:User{username:'${username}'})
                    return n`;
    db.cypherQuery(cypher, function(err, result) {
        if(result.data[0]) {
            res.end(JSON.stringify({valid:false}));
        } else {
            res.end(JSON.stringify({valid:true}));
        }
    });
});

router.post('/password', function(req, res) {
    db = new neo4j('http://neo4j:158728@localhost:7474');
    let username = req.body.username;
    let password = req.body.old_password;
    let cypher = `match(n:User{username:'${username}'})
                    return n.password`;
    db.cypherQuery(cypher, function(err, result) {
        if(result.data[0] === password) {
            res.end(JSON.stringify({valid:true}));
        } else {
            res.end(JSON.stringify({valid:false}));
        }
    });

});

router.post('/follow', function(req, res) {
    let from = req.body.from;
    let to = req.body.to;
    var cypher = `match p=(from)-[:Follow]->(to)
        where from.username='${from}' and to.username='${to}'
        return p`;
    // console.log(cypher);
    db.cypherQuery(cypher, function(err, result) {
        if(err) {
            return console.error(err);
            
        } 
        // console.log(result);
        if(result.data[0]) {
            res.end(JSON.stringify({have: true}));
        } else {
            res.end(JSON.stringify({have: false}));
        }
    });
});

module.exports = router;
