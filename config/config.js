'use strict';

var path = require('path');

// Initialize global configuration
var initGlobalConfig = function() {
	// Get default config
	var defaultConfig = require(path.join(process.cwd(),'config/env/default'));
	// Use the default config
	var config = defaultConfig;

	return config;

};

//Set configuration object
module.exports = initGlobalConfig();
