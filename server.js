var http = require('http');
var port = process.env.PORT || 1337;
var position = "0";

http.createServer(function(req, res) {
  if(req.method == 'POST') {
    console.log("[200] " + req.method + " to " + req.url);
    req.on('data', function(chunk) {
      console.log("Received body data:");
      console.log(chunk.toString());
      var postValue = chunk.toString().split('=');
      position = postValue[1];
      console.log(postValue[1] + " " + position);
    });
    res.writeHead(200, "OK", {'Content-Type': 'text/plain'});
    res.end();
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(position);
  }

}).listen(port)
