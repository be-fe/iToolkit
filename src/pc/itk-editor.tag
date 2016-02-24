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
        var initContent;
        if (config.initContent) {
            initContent = config.initContent;
        }

        var initEditor;
        if (config.initEditor) {
            initEditor = config.initEditor;
        }

        var topConfig = {};

        // 先将两个必须配置写进去
        topConfig.image_previewText = '';
        topConfig.filebrowserImageUploadUrl = filebrowserImageUploadUrl;

        if (config.editorConfig) {

            var editorConfig = config.editorConfig;

            // 然后将editorConfig逐一拷贝到topConfig中去
            for (x in editorConfig) {
                // 不能是这四个配置,否则可能会覆盖
                if (x != 'image_previewText' && x != 'filebrowserImageUploadUrl' && x != 'initContent' && x != 'initEditor') {
                    topConfig[x] = editorConfig[x];
                }
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

            EL.style.visibility = 'hidden';

            var textarea = EL.getElementsByTagName('textarea')[0];

            var id = EL.getAttribute('id');
            // textarea.setAttribute('name', EL.getAttribute('name'));
            textarea.setAttribute('id', EL.getAttribute('id'));
            EL.removeAttribute('id');

            utils.jsLoader([
                path + type + '/ckeditor.js'
            ], function () {

                var editor = CKEDITOR.replace(id, topConfig);

                EL.style.visibility = 'visible';

                self.update();

                if (initContent) {
                    editor.setData(initContent);
                }

                if (initEditor) {
                    initEditor(editor);
                }

            });
        })

    </script>
</itk-editor>