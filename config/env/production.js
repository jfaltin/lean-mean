'use strict';

module.exports = {
	port: process.env.PORT || 8443,

	db: {
		uri: 'mongodb://localhost/lmwam',
		options: {
			user: '',
			pass: '',
		},
		// Enable mongoose debug mode
		debug: process.env.MONGODB_DEBUG || false,
	},
};