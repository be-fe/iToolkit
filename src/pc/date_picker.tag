<date-picker>

    <script>

    var self = this;
    var EL = self.root;
    var config = self.opts.opts || self.opts;

    var js = document.scripts;

    if (!config.trigger && !config.elem) {
        config.trigger = config.elem = EL;
        config.onlyCb = true;
    }

    if (config.trigger) {
        config.trigger = EL;
        if (!config.elem) {
            throw new Error('config.elem input error');
        }
    }

    if (
        config.buttonText
        && typeof config.buttonText === 'string'
    ) {
        EL.innerHTML = config.buttonText;
    }

    var path = '';

    var jsPath = '';

    if (!config.path) {
        for (var i = 0; i < js.length; i++) {
            if (!js[i].src) {
                continue;
            }
            if (/iToolkit_pc.min.js|iToolkit_pc.js/.test(js[i].src)) {
                jsPath = js[i].src.replace(/iToolkit_pc.min.js|iToolkit_pc.js/, '');
                break;
            }
        }
        path = jsPath + 'plugins/laydate/';
    }
    else {
        path = config.path;
    }

    var theme = config.theme ? config.theme : 'default';

    utils.jsLoader([
        path + 'laydate.min.js',
        path + '/need/' + 'laydate.css',
        path + '/skins/' + theme + '/laydate.css'
    ], function () {

        if (config.trigger) {
            config.trigger.onclick = function () {
                laydate(config);
            };
            return;
        }
        laydate(config);
    });

    </script>

</date-picker>
