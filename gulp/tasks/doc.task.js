module.exports = function (gulp, plugin, pkg) {
    gulp.task('docs', function () {
        process.exec(
            'gitbook build ./' ,
            { cwd : (__dirname + '/docs')},
            function (error, stdout, stderr) {
                if (error !== null) {
                  console.log('exec error: ' + error);
                }
            }
        );
    });
};