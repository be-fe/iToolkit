module.exports = function (gulp, plugin, config) {
    'use strict';
    var connect = require('gulp-connect');
    var open = require('open');

    var port = 8009;
    var liveReloadPort = 33999;

    gulp.task('demo_server', function () {
        connect.server({
            root: '.',
            livereload: {
                port: liveReloadPort,
                src: 'http://localhost:' + liveReloadPort + '/livereload.js?snipver=1'
            },
            port: port
        });

        open('http://localhost:' + port + '/demos');
    });

    gulp.task('build_and_reload',
        ['less', 'riot_pc', 'riot_mobile', 'build'],
        function () {
            return gulp.src('.')
                .pipe(connect.reload());
        });
};