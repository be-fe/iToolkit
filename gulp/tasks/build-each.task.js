module.exports = function (gulp, plugin, pkg, fs) {

    gulp.task('build-each', function () {
        return gulp.src(['src/pc/*.tag'])
        .pipe(plugin.riot())
        .pipe(gulp.dest('build/tag'))
        .pipe(plugin.uglify())
        .pipe(plugin.rename({ suffix: '.min' }))
        .pipe(gulp.dest('build/tag'));
    });
};