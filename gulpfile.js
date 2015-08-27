var gulp = require('gulp');
var load = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});
var pkg = require('./package.json');
var childProcess = require('child_process');
var config = require('./gulp/gulp.config');
var fs = require('fs');
var taskList = fs.readdirSync('./gulp/tasks/');

taskList.forEach(function (fileName) {
	require('./gulp/tasks/' + fileName)(gulp, load, pkg, childProcess);
});