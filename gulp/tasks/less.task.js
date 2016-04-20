module.exports = function (gulp, plugin, pkg, childProcess) {

    var combiner = require('stream-combiner2');

    gulp.task('less', function () {
        var combined = combiner.obj([
            gulp.src('src/less/*.less'),
            plugin.less(),
            plugin.concat('itoolkit.css'),
            gulp.dest('src/css')
        ]);

        combined.on('error', console.error.bind(console));

        return combined;
    });
};