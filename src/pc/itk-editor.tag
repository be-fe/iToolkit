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
        
        self.on('mount', function() {
            var textarea = EL.getElementsByTagName('textarea')[0];
            var id = EL.getAttribute('id');
            textarea.setAttribute('name', EL.getAttribute('name'));
            textarea.setAttribute('id', EL.getAttribute('id'));
            EL.removeAttribute('id');

<<<<<<< HEAD
        utils.jsLoader([
            path + type + '/ckeditor.js',
            // path + '/need/' + 'laydate.css',
            // path + '/skins/' + theme + '/laydate.css'
        ], function () {
            CKEDITOR.replace( 'editor1', {
                image_previewText: '',
                filebrowserImageUploadUrl: "http://localhost:9090/src/plugins/ckeditor/server/upload.php"
=======
            utils.jsLoader([
                path + type + '/ckeditor.js',
                // path + '/need/' + 'laydate.css',
                // path + '/skins/' + theme + '/laydate.css'
            ], function () {
                CKEDITOR.replace( id, {
                    image_previewText: '',
                    filebrowserImageUploadUrl: "admin/UserArticleFileUpload.do"
                });
                self.update();
>>>>>>> 452b37669e866e53df868bf7db2fe5bcf15dae5d
            });
        })

        
        
    </script>
</itk-editor>