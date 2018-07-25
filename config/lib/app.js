'use strict';

var express = require('express');
var config = require('../config');

module.exports.init = function init(callback) {

  // Initialize express
  var app = express();
  app.get('/', function(req,res) {
   res.send('Hello World! How be you?? ANSWER ME!!!');
  });
  if (callback) {
    callback(app);
   }
 };

module.exports.start = function start() {
   var _this = this;

   _this.init(function(app) {
         var server = app.listen(config.port, function() {
             var port = server.address().port;
             console.log('Example app listening on port %s', port);
         });
     });
 };

