module.exports = function (gulp, plugin, pkg, childProcess) {
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
            ' * <%= pkg.name %>-lite v<%= pkg.version %>',
            ' * Revised in <%= date %>',
            ' * Released under the <%= pkg.license %> License.',
            ' */',
            '\n'
        ].join('\n');

        return plugin.header(banner, {pkg: pkg, date: time});
    }

    var status = 0;
    gulp.task('build-lite', ['build-each'],function () {
		process.stdin.setEncoding('utf8');
		process.stdin.on('readable', function(chunk) {
		  	var chunk = process.stdin.read();
		  	if (chunk) {
		  		console.log(__dirname + '/../shell/build.sh ' + chunk);
			    childProcess.exec(
		           	__dirname + '/../shell/build.sh ' + chunk,
		            function (error, stdout, stderr) {
		                if (error || stderr) {
		                  	console.log('exec error: ' + error + '\n');
                            console.log('stderror:' + stderr + '\n');
		                }
                        else {
                            status = 1;
                        }
                        process.stdin.emit("end");
		            }
		        );
		  	}
		});

		process.stdin.on('end', function() {
		    if (status) {
                gulp.src('build/iToolkit_lite.js')
                    .pipe(plugin.uglify())
                    .pipe(plugin.rename({ suffix: '.min' }))
                    .pipe(setHeader())
                    .pipe(gulp.dest('build'));
                console.log('success!');
            }
		});
	});
};