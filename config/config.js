'use strict';

var path = require('path');
var _ = require('lodash');
var chalk = require('chalk');
var glob = require('glob');

// Validate the existence of NODE_ENV
var validateEnvironmentVariable = function() {
	var environmentFiles = glob.sync('./config/env/' + process.env.NODE_ENV + '.js');
	console.log();
	if (!environmentFiles.length) {
		if (process.env.NODE_ENV) {
			console.error(chalk.red('+ Error: No configuration file found for "' + process.env.NODE_ENV + 
				'" environment using development instead'));
		} else {
			console.error(chalk.red(
				' Error: NODE_ENV is not defined! ' +
				'Using default development environment'));
		}
		process.env.NODE_ENV = 'development';
	}
	console.log(chalk.white(''));
};


// Get files by glob patterns
var getGlobbedPaths = function(globPatterns, excludes) {
	// URL paths regex
	var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');
	// The output array
	var output = [];


	// If glob pattern is array then we use each pattern in a recursive way
	// Otherwise we use glob
	if (_.isArray(globPatterns)) {
		globPatterns.forEach(function(globPattern) {
			output = _.union(output, getGlobbedPaths(globPattern, excludes));
		});
	} else if (_.isString(globPatterns)) {
		if (urlRegex.test(globPatterns)) {
			output.push(globPatterns);
		} else {
			var files = glob.sync(globPatterns);
			if (excludes) {
				files = files.map(function(file) {
					if (_.isArray(excludes)) {
						for (var i in excludes) {
							file = file.replace(excludes[i], '');
						}
					} else {
						file = file.replace(excludes, '');
					}
					return file;
				});
			}
			output = _.union(output, files);
		}
	}
	return output;
};

// Validate Session Secret parameter is not set to default in production
var validateSessionSecret = function(config, testing) {

	if (process.env.NODE_ENV !== 'production') {
		return true;
	}

	if (config.sessionSecret === 'MEAN') {
		if (!testing) {
			console.log(chalk.red('+ WARNING: It is strongly recommended that ' +
				'you change sessionSecret config while running in production!'));
			console.log(chalk.red(' Please add ' +
				'`sessionSecret: process.env.SESSION_SECRET ' +
				'|| \'super amazing secret\'` to '));
			console.log(chalk.red(' `config/env/production.js` ' +
				'or `config/env/locals.js`'));
			console.log();
		}
		return false;
	}
	return true;
};


//Initialize global configuration files
var initGlobalConfigFiles = function(config, assets) {
	// Appending files
	config.files = {
		server : {},
	};

	// Setting Globbed config file
	config.files.server.configs = getGlobbedPaths(assets.server.config);
};


// Initialize global configuration
var initGlobalConfig = function() {

	// Validate the existence of NODE_ENV
	validateEnvironmentVariable();

	// Get default config
	var defaultConfig = require(path.join(process.cwd(),'config/env/default'));
	
	// Get the applicable evironment config
	var environmentConfig = require(path.join(process.cwd(), 'config/env', process.env.NODE_ENV)) || {};

	// Merge config files
	var config = _.merge(defaultConfig, environmentConfig);

	// Read package.json for MEAN.JS project information
	var pkg = require(path.resolve('./package.json'));
	config.packageJson = pkg;

	// Validate session secret
	validateSessionSecret(config);

	//Expose configuration utilities
	config.utils = { 
		getGlobbedPaths: getGlobbedPaths,
		validateSessionSecret: validateSessionSecret,
	 };

	// Get the default assets
	var defaultAssets = require(path.join(process.cwd(),
		'config/assets/default'));

	var environmentAssets = require(path.join(process.cwd(),
		'config/assets', process.env.NODE_ENV)) || {};

	// Merge assets
	var assets = _.merge(defaultAssets, environmentAssets);

	// Initialize global globbed files
	initGlobalConfigFiles(config, assets);

	return config;

};

//Set configuration object
module.exports = initGlobalConfig();
