'use strict';

//Module dependencies
var express = require('express');
var config = require('../config');
var compress = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var morgan = require('morgan');
var logger = require('./logger');
var _ = require('lodash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var lusca = require('lusca');
var helmet = require('helmet');
var path = require('path');

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

	app.locals.jsFiles = config.files.client.js;
	app.locals.cssFiles = config.files.client.css;

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

	// Enable logger (morgan) if enabled in the configuration file
	if (_.has(config, 'log.format')) {
		app.use(morgan(logger.getLogFormat(), logger.getMorganOptions()));
	}

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

// Configure Express session
module.exports.initSession = function(app, db) {
	app.use(session({
		resave: true,
		secret: config.sessionSecret,
		cookie: {
			maxAge: config.sessionCookie.maxAge,
			httpOnly: config.sessionCookie.httpOnly,
			secure: config.sessionCookie.secure && config.secure.ssl
		},
		name: config.sessionCookieKey,
		store: new MongoStore({
			url: 'mongodb://localhost/local',
			mongooseConnection: db.connection,
			collection: config.sessionCollection
		}),
		saveUninitialized: true,
	}));

	app.use(lusca(config.lusca));

};

// Configure Helmet header settings
module.exports.initHelmetHeaders = function (app) {
  // Use helmet to secure Express headers
  var SIX_MONTHS = 15778476000;
  app.use(helmet.frameguard());
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubdomains: true,
    force: true
  }));
  app.disable('x-powered-by');
};

// Configure the modules static routes
module.exports.initModulesClientRoutes = function(app) {
  // Set the app router and static folder
  app.use('/', express.static(path.resolve('./public'), { maxAge: 86400000 }));

  // Glob static routing
  config.directories.client.forEach(function(staticPath) {
    app.use(staticPath, express.static(path.resolve('./' + staticPath)));
  });
};

// Initialize the express application
module.exports.init = function (db) {
	// Initialize express app
	var app = express();

	//Initialize local variables
	this.initLocalVariables(app);

	//Initialize express middleware
	this.initMiddleware(app);

	// Initialize Express session
	this.initSession(app, db);

	// Initialize helmet security headers
	this.initHelmetHeaders(app);

	// Initialize modules static client routes, before session!
    this.initModulesClientRoutes(app);

	// Temporary helloworld placeholder
	app.get('/', function(req,res) {
		res.send('Hello World!');
	});

	return app;
};
