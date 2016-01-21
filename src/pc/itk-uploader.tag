<itk-uploader>

    <style>

        #progressOuter {
            border: 1px solid #ccc;
            border-radius: 4px;
            height: 32px;
            margin: 0;
            background: white;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            display: none;
        }

    </style>


    <div class="btn btn-large btn-primary" name="uploadBtn" id="uploadBtn">上传</div>

    <script>

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
            if (/iToolkit_pc.min.js|iToolkit_pc.js/.test(js[i].src)) {
                jsPath = js[i].src.replace(/iToolkit_pc.min.js|iToolkit_pc.js/, '');
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

            console.log(btn);

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
