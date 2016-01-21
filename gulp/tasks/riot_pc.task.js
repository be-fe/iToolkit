module.exports = function (gulp, plugin, config) {
    gulp.task('riot_pc', function () {
        return gulp.src(['src/pc/*.tag'])
        .pipe(plugin.riot())
        .pipe(plugin.concat('iToolkit_pc.js'))
        .pipe(gulp.dest('src'));
    });
    gulp.task('watch', function () {
        gulp.watch('src/pc/*.tag', ['riot_pc']);
    })
};