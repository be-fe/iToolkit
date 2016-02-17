var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('release', function () {
	gulp.src('laydate.dev.js')
		.pipe(uglify())
		.pipe(rename('laydate.min.js'))
		.pipe(gulp.dest(''));
})