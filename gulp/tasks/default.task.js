module.exports = function (gulp, plugin, pkg) {

    gulp.task(
        'default',
        ['riot_pc', 'riot_mobile', 'riot_plugins', 'build', 'demo_server'],
        function () {
            gulp.watch([
                'src/*/*.tag',
                'src/**/*.less'
            ], ['build_and_reload']);
        }
    );
};