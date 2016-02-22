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


        // 可能存在的用户并不需要这个功能的情况,注意判断
        if (config.initContent) {
            var initContent = config.initContent;
        }

        var editorConfig = config.editorConfig;

        var topConfig = {};

        // 先将两个必须配置写进去
        topConfig.image_previewText = '';
        topConfig.filebrowserImageUploadUrl = filebrowserImageUploadUrl;

        // 然后将editorConfig逐一拷贝到topConfig中去

        for (x in editorConfig) {
            // 不能是这两个配置,否则可能会覆盖
            if (x != 'image_previewText' && x != 'filebrowserImageUploadUrl') {
                topConfig[x] = editorConfig[x];
            }
        }

        if (!config.path) {
            for (var i = 0; i < js.length; i++) {
                if (!js[i].src) {
                    continue;
                }
                if (/itoolkit.min.js|itoolkit.js/.test(js[i].src)) {
                    jsPath = js[i].src.replace(/itoolkit.min.js|itoolkit.js/, '');
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

                var editor = CKEDITOR.replace(id, topConfig);

                self.update();

                if (initContent) {
                    editor.setData(initContent);
                }

                if (self.opts) {
                    self.opts.editor = editor;
                    console.log(self.opts.editor);
                } else {
                    self.opts.opts.editor =editor;
                    console.log(self.opts.opts.editor);
                }


            });
        })


    </script>
</itk-editor>