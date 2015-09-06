module.exports = function (gulp, plugin, pkg) {
    gulp.task(
        'default',
        ['riot_pc', 'riot_mobile', 'riot_plugins', 'build'],
        function () {
            gulp.watch([
                'src/*/*.tag',
                'src/**/*.css'
            ], ['riot_pc', 'riot_mobile', 'build']);
        }
    );
};