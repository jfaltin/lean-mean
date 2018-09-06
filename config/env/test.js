'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
	app: {
		title: defaultEnvConfig.app.title + ' - Test Environment',
	},
	port: process.env.PORT || 3001,

	db: {
		uri: 'mongodb://localhost:27017/lmwam-test',
		options: {
			user: '',
			pass: '',
			useNewUrlParser: true,
		},
		url: 'mongodb://localhost:27017/lmwam-test',
		// Enable mongoose debug mode
		debug: process.env.MONGODB_DEBUG || false,
	},

	log: {
		fileLogger: {
			directoryPath: process.cwd(),
			fileName: 'app.log',
			maxsize: 10485760,
			maxFiles: 2,
			json: false,
			format: 'test',
		},
	},
};