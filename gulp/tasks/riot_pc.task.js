module.exports = function (gulp, plugin, config) {
    gulp.task('riot_pc', function () {
        return gulp.src(['src/pc/*.tag'])
        .pipe(plugin.riot())
        .pipe(plugin.concat('itoolkit.js'))
        .pipe(gulp.dest('src'));
    });
};