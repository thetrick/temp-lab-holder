var redis = require ('node-redis')
var http = require('http');

var redis_host = "redis";
var redis_port = 6379;
var http_port = 4040;

var client = redis.createClient({port: redis_port, host:redis_host});

http.createServer(function (req, res) {  
  console.log(new Date().toUTCString() + " - " + req.url);

	var val = client.incr("simplecount", function(err, val) {
	  console.log("simplecount: "+ val);
	  res.writeHead(200, {'Content-Type': 'text/plain'});
	  res.end('simplecount: '+val+'\n');
	});

}).listen(http_port);
