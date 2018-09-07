'use strict';

module.exports = {
	server: {
		gulpConfig: ['gulpfile.js'],
		allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
	},

	client: {
		lib: {
			css: [
			],
			js: [
				//bower:js
				'public/lib/angular/angular.js'
			],
		},
		css: [
			'modules/*/client/css/*.css',
		],
		js: [
			'modules/*/client/*.js',
			'modules/*/client/**/*.js',
		],
		img: [
			'modules/**/*/img/**/*.jpg',
			'modules/**/*/img/**/*.png',
			'modules/**/*/img/**/*.gif',
			'modules/**/*/img/**/*.svg',
		],
	},
};