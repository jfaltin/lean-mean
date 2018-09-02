'use strict';

//Module dependencies
var express = require('express');
var config = require('../config');
var compress = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');

//Initialize local variables
module.exports.initLocalVariables = function(app) {

	//Environment dependent view caching
if (process.env.NODE_ENV === 'development') {
	//Disable views cache
	app.set('view cache', false);
} else if (process.env.NODE_ENV === 'production') {
	app.locals.cache = 'memory';
}
	app.locals.title = config.app.title;
	app.locals.livereload = config.livereload;

	//Pass the request host and url to environment locals
	app.use(function(req, res, next) {
		res.locals.host = req.protocol + '://' + req.hostname;
		res.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
		next();
	});
};

//Initialize application middleware
module.exports.initMiddleware = function(app) {
	//Enable max compression - should be at the start of the middleware stack
	app.use(compress({
		filter: function(req, res) {
			return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
		},
		level: 9,
	}));

	// Request body parsing middleware
	app.use(bodyParser.urlencoded({
		extended: true,
	}));
	app.use(bodyParser.json());

	//Method override middleware
	app.use(methodOverride());

	//Cookie parser middleware
	app.use(cookieParser());

	//Flash message middleware
	app.use(flash());
};


// Initialize the express application
module.exports.init = function (db) {
	// Initialize express app
	var app = express();

	//Initialize local variables
	this.initLocalVariables(app);

	//Initialize express middleware
	this.initMiddleware(app);

	// Temporary helloworld placeholder
	app.get('/', function(req,res) {
		res.send('Hello World!');
	});

	return app;
};