<itk-editor>
    <textarea rows="10" cols="80" style="display:none;"></textarea>
    <script>
        var self = this;
        var EL = self.root;
        var config = self.opts.opts || self.opts;
        var js = document.scripts;
        var path = '';
        var jsPath = '';
        var type = config.type || 'standard';
        var filebrowserImageUploadUrl = config.filebrowserImageUploadUrl;
        var editorConfig = config.editorConfig;

        var topConfig = {};

        // 先将两个必须配置写进去
        topConfig.image_previewText = '';
        topConfig.filebrowserImageUploadUrl = filebrowserImageUploadUrl;

        // 然后将editorConfig逐一拷贝到topConfig中去

        for (x in editorConfig) {
            topConfig[x] = editorConfig[x];
        }

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
            path = jsPath + 'plugins/ckeditor/';
        }
        else {
            path = config.path;
        }

        self.on('mount', function () {

            var textarea = EL.getElementsByTagName('textarea')[0];

            // 如果没有写 id 呢?这里要随机生成,name 也是这个道理. 哦,id 是必须的,不然无法挂载,那 name 呢,去掉也没有关系,那么哪里使用了?
            var id = EL.getAttribute('id');
            // textarea.setAttribute('name', EL.getAttribute('name'));
            textarea.setAttribute('id', EL.getAttribute('id'));
            EL.removeAttribute('id');

            utils.jsLoader([
                path + type + '/ckeditor.js'
            ], function () {

//                CKEDITOR.replace(id, {
//                    image_previewText: '',
//                    // 注意,这里的 url 需要可处理 php 文件并且需要和页面同域, 测试这个组件的时候,建议使用:php -S localhost:8080开启服务,因为默认的 doc 页面的server 无法处理PHP 代码.
//                    filebrowserImageUploadUrl: filebrowserImageUploadUrl
//                });

                CKEDITOR.replace(id, topConfig);

                self.update();

            });
        })


    </script>
</itk-editor>