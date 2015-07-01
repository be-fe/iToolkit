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

gulp.task('build', function () {
    gulp.src(['src/css/themes/*.css'])
    .pipe(gulp.dest('build/themes'));

    gulp.src(['src/lib/riot.js', 'src/lib/common.js', 'src/iToolkit_pc.js'])
    .pipe(concat('iToolkit_pc.js'))
    .pipe(gulp.dest('build'));
    
});

gulp.task('default', ['riot_pc', 'riot_mobile', 'build'], function () {
    gulp.watch(['src/*/*.tag', 'src/*.tag', 'src/themes/*.css'], ['riot_pc', 'riot_mobile', 'build']);
});

