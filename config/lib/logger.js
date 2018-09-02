'use strict'

//Module dependencies
var _ = require('lodash');
var config = require('../config');
var chalk = require('chalk');
var fs = require('fs');
var winston = require('winston');

//Instantiate default winston logger with the Console transport
var logger = new winston.Logger({
	transports: [
	new winston.transports.Console({
		level: 'info',
		colorize: true,
		showLevel: true,
		handleExceptions: true,
		humanReadableUnhandledException: true,
	}),
	],
	exitOnError: false,
});

//The options to use with Winston File transport for our logger
logger.getFileTransportOptions = function getFileTransportOptions(configOptions) {

	var _config = _.clone(config, true);
	if (configOptions) {
		_config = configOptions;
	}
	var configFileLogger = _config.log.fileLogger;
	if (!_.has(_config, 'Log.fileLogger.directoryPath') || !_.has(_config, 'log.fileLogger.fileName')) {
		console.log('unable to find logging file configuration');
		return false;
	}
	var logPath = configFileLogger.directoryPath + '/' + configFileLogger.fileName;

	return {
		level: 'debug',
		colorize: false,
		filename: logPath,
		timestamp: true,
		maxsize: configFileLogger.maxsize ? configFileLogger.maxsize : 10485760,
		maxFiles: configFileLogger.maxFiles ? configFileLogger.maxFiles: 2,
		json: (_.has(configFileLogger, 'json')) ? configFileLogger.json: false,
		eol: '\n',
		tailable: true,
		showLevel: true,
		handleExceptions: true,
		humanReadableUnhandledException: true,
	};



	module.exports = logger;
};