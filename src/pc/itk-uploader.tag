<itk-uploader>

    <style>

    </style>


    <div class="btn btn-large btn-primary" name="uploadBtn" id="uploadBtn">上传</div>

    <script>

        // 本组件来源于 https://github.com/LPology/Simple-Ajax-Uploader,不明白的地方可以参考此文档.

        // 初始化设置
        var self = this;
        var EL = self.root;
        var config = self.opts.opts || self.opts;

        // 通过随机数,构造 btn ID, 防止重复.
        var randomNumber = function (min, max) {
            return Math.floor(min + Math.random() * (max - min));
        };
        self['uploadBtn'].id = randomNumber(10000, 99999);


        // 获取脚本路径,load 组件
        var js = document.scripts;
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
        path = jsPath + 'plugins/uploader/';
        var sourceArr = [
            path + 'SimpleAjaxUploader.min.js',
        ];

        // 调用组件
        utils.jsLoader(sourceArr, function () {

            var btn = document.getElementById(self['uploadBtn'].id);

            // 更新设置
            var json = {};
            json.button = btn;

            // 这些选项来源于配置
            json.url = config.url;
            json.name = config.name ? config.name : "";
            json.multipart = config.multipart ? config.multipart : true;
            json.responseType = config.responseType ? config.responseType : "";
            json.startXHR = config.startXHR ? config.startXHR : null;
            json.onSubmit = config.onSubmit ? config.onSubmit : null;
            json.onComplete = config.onComplete ? config.onComplete : null;
            json.onError = config.onError ? config.onError : null;


            var uploader = new ss.SimpleUpload(json);
        });

    </script>

</itk-uploader>
