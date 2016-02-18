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
            var id = EL.getAttribute('id');
            textarea.setAttribute('name', EL.getAttribute('name'));
            textarea.setAttribute('id', EL.getAttribute('id'));
            EL.removeAttribute('id');

            utils.jsLoader([
                path + type + '/ckeditor.js',
                // path + '/need/' + 'laydate.css',
                // path + '/skins/' + theme + '/laydate.css'
            ], function () {
                CKEDITOR.replace(id, {
                    image_previewText: '',
                    // filebrowserImageUploadUrl: "admin/UserArticleFileUpload.do"
                    // 注意,这里的 url 需要可处理 php 文件并且需要和页面同域, 测试这个组件的时候,建议使用:php -S localhost:8080开启服务,因为默认的 doc 页面的server 无法处理PHP 代码.
                    filebrowserImageUploadUrl: "http://localhost:8080/demos/plugins/ckeditor/_server/app.php"
                });
                self.update();
            });
        })


    </script>
</itk-editor>