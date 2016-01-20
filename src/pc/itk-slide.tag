<itk-slide>

    <!--详细配置文档:http://kenwheeler.github.io/slick/-->

    <!--简单默认样式,请根据需要在使用 slick-slide的时候覆盖掉-->
    <style>

    </style>

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
                if (/iToolkit_pc.min.js|iToolkit_pc.js/.test(js[i].src)) {
                    jsPath = js[i].src.replace(/iToolkit_pc.min.js|iToolkit_pc.js/, '');
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
        </script>

</itk-slide>