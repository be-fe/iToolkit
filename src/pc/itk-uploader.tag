<itk-uploader>
    <div class="container">
        <div class="page-header">
            <h1>Simple Ajax Uploader</h1>
            <h3>Basic Example</h3>
        </div>
        <div class="row" style="padding-top:10px;">
            <div class="col-xs-2">
                <button id="uploadBtn" class="btn btn-large btn-primary">Choose File</button>
            </div>
            <div class="col-xs-10">
                <div id="progressOuter" class="progress progress-striped active" style="display:none;">
                    <div id="progressBar" class="progress-bar progress-bar-success" role="progressbar"
                         aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 0%"
                </div>
            </div>
        </div>
    </div>
    <div class="row" style="padding-top:10px;">
        <div class="col-xs-10">
            <div id="msgBox"></div>
        </div>
    </div>
    </div>


    <script>
        var self = this;
        var EL = self.root;
        var config = self.opts.opts || self.opts;

        var js = document.scripts;

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
            path = jsPath + 'plugins/uploader/';
        }
        else {
            path = config.path;
        }


        var sourceArr = [
            path + 'SimpleAjaxUploader.min.js',
        ];

        utils.jsLoader(sourceArr, function () {
            var btn = document.getElementById('uploadBtn'),
                    progressBar = document.getElementById('progressBar'),
                    progressOuter = document.getElementById('progressOuter'),
                    msgBox = document.getElementById('msgBox');
            //..............
            var uploader = new ss.SimpleUpload({
                button: btn,
                url: 'file_upload.php',
                name: 'uploadfile',
                multipart: true,
                hoverClass: 'hover',
                focusClass: 'focus',
                responseType: 'json',
                startXHR: function () {
                    progressOuter.style.display = 'block'; // make progress bar visible
                    this.setProgressBar(progressBar);
                },
                onSubmit: function () {
                    msgBox.innerHTML = ''; // empty the message box
                    btn.innerHTML = 'Uploading...'; // change button text to "Uploading..."
                },
                onComplete: function (filename, response) {
                    btn.innerHTML = 'Choose Another File';
                    progressOuter.style.display = 'none'; // hide progress bar when upload is completed

                    if (!response) {
                        msgBox.innerHTML = 'Unable to upload file';
                        return;
                    }

                    if (response.success === true) {
                        msgBox.innerHTML = '<strong>' + escapeTags(filename) + '</strong>' + ' successfully uploaded.';

                    } else {
                        if (response.msg) {
                            msgBox.innerHTML = escapeTags(response.msg);

                        } else {
                            msgBox.innerHTML = 'An error occurred and the upload failed.';
                        }
                    }
                },
                onError: function () {
                    progressOuter.style.display = 'none';
                    msgBox.innerHTML = 'Unable to upload file';
                }
            });
        });


    </script>

</itk-uploader>
