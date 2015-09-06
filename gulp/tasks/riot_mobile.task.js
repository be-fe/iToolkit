module.exports = function (gulp, plugin, config) {
    gulp.task('riot_mobile', function () {
        return gulp.src(['src/mobile/*.tag'])
        .pipe(plugin.riot())
        .pipe(plugin.concat('iToolkit_mobile.js'))
        .pipe(gulp.dest('src'));
    });
};