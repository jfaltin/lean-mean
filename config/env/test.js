'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
	app: {
		title: defaultEnvConfig.app.title + ' - Test Environment',
	},
	port: process.env.PORT || 3001,

	db: {
		uri: 'mongodb://localhost/lmwam-test',
		options: {
			user: '',
			pass: '',
		},
		// Enable mongoose debug mode
		debug: process.env.MONGODB_DEBUG || false,
	},
};