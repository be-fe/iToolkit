module.exports = function (gulp, plugin, config) {
	gulp.task('riot_plugins', function () {
	    gulp.src(['src/plugins/**/*'])
	        .pipe(gulp.dest('build/plugins'));
	});
};