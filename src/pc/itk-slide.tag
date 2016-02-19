<itk-slide>

    <!--详细配置文档:http://kenwheeler.github.io/slick/-->

    <yield>

    <script>

        var self = this;
        var EL = self.root;
        var config = self.opts.opts || self.opts;
        var js = document.scripts;
        var path = '';
        var jsPath = '';


        for (var i = 0; i < js.length; i++) {
            if (!js[i].src) {
                continue;
            }
            if (/itoolkit.min.js|itoolkit.js/.test(js[i].src)) {
                jsPath = js[i].src.replace(/itoolkit.min.js|itoolkit.js/, '');
                break;
            }
        }

        path = jsPath + 'plugins/';

        if (typeof jQuery == 'undefined') {
            (function () {
                utils.jsLoader([
                    path + 'jquery/jquery-1.12.0.min.js',
                ], function () {
                    // $.noConflict();
                    jQuery(document).ready(function ($) {
                        utils.jsLoader([
                            path + 'slick/slick.css',
                            path + 'slick/slick-theme.css',
                            path + 'slick/slick.js',
                        ], function () {
                            $(document).ready(function () {
                                $(EL).slick(config);
                            });
                        });
                    });
                });
            })();
        } else {
            jQuery(document).ready(function ($) {
                utils.jsLoader([
                    path + 'slick/slick.css',
                    path + 'slick/slick-theme.css',
                    path + 'slick/slick.js'
                ], function () {
                    $(document).ready(function () {
                        $(EL).slick(config);
                    });
                });
            });
        }

        self.on('mount', function() {
            self.root.style.display = 'block';
        })
    </script>

</itk-slide>