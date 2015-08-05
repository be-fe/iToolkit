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

gulp.task('default', ['riot_pc', 'riot_mobile', 'riot_plugins', 'build'], function () {
    gulp.watch(['src/*/*.tag', 'src/css/*.css', 'src/css/themes/*.css'], ['riot_pc', 'riot_mobile', 'build']);
});

gulp.task('riot_plugins', function () {
    gulp.src(['src/plugins/**/*'])
        .pipe(gulp.dest('build/plugins'));
})

function setHeader() {
    var date = new Date();
    var time = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
    ];

    time = time.map(function (d) {
        return d > 10 ? d : '0' + d;
    });

    var dateStr = time.slice(0, 3);
    var timeStr = time.slice(3, 6);

    time = dateStr.join('-') + ' ' + timeStr.join(':');

    var banner = [
        '/**',
        ' * <%= pkg.name %> v<%= pkg.version %>',
        ' * Revised in <%= date %>',
        ' * Released under the <%= pkg.license %> License.',
        ' */',
        '\n'
    ].join('\n');

    return header(banner, {pkg: pkg, date: time});
}

