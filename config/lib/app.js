'use strict';

var express = require('express');
var config = require('../config');
var chalk = require('chalk');
var mongoose = require('./mongoose');
var express = require('./express');

module.exports.init = function init(callback) {

  // Establish the database connection
  mongoose.connect(function(db) {

  // Initialize express
  var app = express.init(db);

  if (callback) {
    callback(app,db,config);
   }
  });
 };

module.exports.start = function start() {
   var _this = this;

   _this.init(function(app) {
         var server = app.listen(config.port, function() {
          console.log('--');
          console.log(chalk.green(config.app.title));
          console.log();
          console.log('Listening on port %s', config.port);
          console.log();
          console.log(chalk.green('Environment:     ' + process.env.NODE_ENV));
          console.log('--');
          console.log(chalk.green('App Version:    ' + config.packageJson.version));
          console.log('--');
          console.log(chalk.green('Database:   ' + config.db.uri));
         });
     });
 };

