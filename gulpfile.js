var gulp = require('gulp');
var riot = require('gulp-riot');
var concat = require('gulp-concat');

gulp.task('riot_pc', function () {
    return gulp.src(['src/pc/*.tag'])
    .pipe(riot())
    .pipe(concat('iToolkit_pc.js'))
    .pipe(gulp.dest('src'));
});

gulp.task('riot_mobile', function () {
    return gulp.src(['src/mobile/*.tag'])
    .pipe(riot())
    .pipe(concat('iToolkit_mobile.js'))
    .pipe(gulp.dest('src'));
});

gulp.task('default', ['riot_pc', 'riot_mobile'], function () {
    gulp.watch(['src/*/*.tag', 'src/*.tag'], ['riot_pc', 'riot_mobile']);
});

