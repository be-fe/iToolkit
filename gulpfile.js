var gulp = require('gulp');
var riot = require('gulp-riot');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var pkg = require('./package.json');

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

gulp.task('riot_light', function () {
    return gulp.src(['src/pc/supe_div.tag'])
    .pipe(riot())
    .pipe(concat('iToolkit_light.js'))
    .pipe(gulp.dest('src'));
});

gulp.task('build', function () {
    
    gulp.src(['src/css/themes/*.css'])
    .pipe(gulp.dest('build/themes'))
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('build/themes'));

    gulp.src(['src/lib/riot.js', 'src/lib/common.js', 'src/iToolkit_pc.js'])
    .pipe(concat('iToolkit_pc.js'))
    .pipe(gulp.dest('build'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(setHeader())
    .pipe(gulp.dest('build'));
});

gulp.task('default', ['riot_pc', 'riot_mobile', 'build'], function () {
    gulp.watch(['src/*/*.tag', 'src/*.tag', 'src/themes/*.css'], ['riot_pc', 'riot_mobile', 'build']);
});

function setHeader() {
    var date = new Date();
    date = date.toDateString();

    var banner = [
        '/**',
        ' * <%= pkg.name %> v<%= pkg.version %>',
        ' * Revised in <%= date %>',
        ' * Released under the <%= pkg.license %> License.',
        ' */',
        '\n'
    ].join('\n');

    return header(banner, {pkg: pkg, date: date});
}

