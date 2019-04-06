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

router.get('/', function(req, res) {
	req.session.destroy(function(err) {
		if(err) {
			return console.error(err);
		}
		// console.log('退出成功！');
		res.end(JSON.stringify({status: 'success'}));
	});
});

module.exports = router;