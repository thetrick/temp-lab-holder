var http = require('http');
http.createServer(function (req, res) {  
  console.log(new Date().toUTCString() + " - " + req.url);

  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Greetings, Docker!\n');
}).listen(3030);

console.log('Server running at http://0.0.0.0:3030/');
