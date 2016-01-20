module.exports = function (gulp, plugin, pkg, childProcess) {
    gulp.task('less', function () {
        gulp.src('src/less/*.less')
        .pipe(plugin.less())
        .pipe(plugin.concat('itoolkit.css'))
        .pipe(gulp.dest('src/css/'));
    });
};