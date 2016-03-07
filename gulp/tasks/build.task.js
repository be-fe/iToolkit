module.exports = function (gulp, plugin, pkg) {
    function setHeader() {
        var date = new Date();
        var time = [
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        ];

        time = time.map(function (d) {
            return d > 10 ? d : '0' + d;
        });

        var dateStr = time.slice(0, 3);
        var timeStr = time.slice(3, 6);

        time = dateStr.join('-') + ' ' + timeStr.join(':');

        var banner = [
            '/**',
            ' * <%= pkg.name %> v<%= pkg.version %>',
            ' * Revised in <%= date %>',
            ' * Released under the <%= pkg.license %> License.',
            ' */',
            '\n'
        ].join('\n');

        return plugin.header(banner, {pkg: pkg, date: time});
    }
    gulp.task('build', ['theme_css', 'css', 'essential_js']);


    gulp.task('theme_css', ['less'], function() {
        return gulp.src(['src/css/themes/*.css'])
            .pipe(plugin.minifyCss())
            .pipe(plugin.rename({ suffix: '.min' }))
            .pipe(gulp.dest('build/themes'));
    });

    gulp.task('css', ['less'], function() {
        gulp.src(['src/css/*.css'])
            .pipe(plugin.minifyCss())
            .pipe(plugin.rename({ suffix: '.min' }))
            .pipe(gulp.dest('build'));
    });

    gulp.task('essential_js',  function() {
        return gulp.src(['src/lib/riot.js', 'src/lib/common.js', 'src/itoolkit.js', 'src/lib/keyboard.js'])
            .pipe(plugin.concat('itoolkit.js'))
            .pipe(gulp.dest('build'))
            // .pipe(jshint())
            // .pipe(jshint.reporter('default'))
            .pipe(plugin.uglify())
            .pipe(plugin.rename({ suffix: '.min' }))
            .pipe(setHeader())
            .pipe(gulp.dest('build'));
    });
};
