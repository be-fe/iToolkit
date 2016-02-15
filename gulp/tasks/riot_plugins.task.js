module.exports = function (gulp, plugin, config) {
	gulp.task('riot_plugins', function () {
	    return gulp.src(['src/plugins/**/*'])
	        .pipe(gulp.dest('build/plugins'));
	});
};