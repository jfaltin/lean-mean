'use strict';

var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');

//Unified watch object

var watchFiles = {
    serverJS: ['gulpfile.js', 'server.js'],
};

// Start server.js and watch for changes in all .js files
gulp.task('nodemon', function() {
   return nodemon({
     verbose: true,
     script: 'server.js',
     ext: 'js',
     watch: watchFiles.serverJS,
   });
});

// Watch files for changes 
gulp.task('watch', function() {
   // Add watch rules
   gulp.watch(watchFiles.serverJS, ['jshint']);
});

// Lint tasks
gulp.task('jshint', ['jshint']);

// Default task
gulp.task('default', ['jshint', 'nodemon', 'watch']);

