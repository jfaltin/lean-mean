'use strict';

var express = require('express');
var app = express();

app.get('/', function(req,res) {
   res.send('Hello World! How be you?? ANSWER ME!!!');
  });

var server = app.listen(3000, function() {
   var port = server.address().port;
   console.log('Example app listening on port %s', port);
  });

