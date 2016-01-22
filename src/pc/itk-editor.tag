<itk-editor>
    <textarea name="editor1" id="editor1" rows="10" cols="80">
        This is my textarea to be replaced with CKEditor.
    </textarea>

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
        

        utils.jsLoader([
            path + type + '/ckeditor.js',
            // path + '/need/' + 'laydate.css',
            // path + '/skins/' + theme + '/laydate.css'
        ], function () {
            CKEDITOR.replace( 'editor1', {
                image_previewText: '',
                filebrowserImageUploadUrl: "admin/UserArticleFileUpload.do"
            });
            self.update();
        });
        
    </script>
</itk-editor>