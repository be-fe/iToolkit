<file-upload>

    <div id="uploader" class="wu-example">
        <!--//用来存放文件信息-->
        <div id="thelist" class="uploader-list"></div>
        <div class="btns">
            <div id="picker">选择文件</div>
            <button id="ctlBtn" class="btn btn-default">开始上传</button>
        </div>
    </div>
    
    var self = this;
    var config = self.opts.opts || self.opts;
    var head = document.getElementsByTagName('head')[0];
    var webUploadJS = document.createElement('script');
    webUploadJS.src = config.jsUrl || 'http://cdn.staticfile.org/webuploader/0.1.1/webuploader.js';
    var jQuerySource = document.createElement('script');
    jQuerySource.src = 'http://apps.bdimg.com/libs/jquery/2.1.1/jquery.min.js';
    // var webUploadCSS = document.createElement('link');
    self.getSource = function() {
        if (!window.WebUploader) {
            head.appendChild(webUploadJS);
            // webUploadCSS.href = config.cssUrl || 'http://www.baidu.com';
        }
    }

    if (!window.jQuery) {
        head.appendChild(jQuerySource);
        jQuerySource.onload = self.getSource;
    }
    else {
        self.getSource();
    }



    
    webUploadJS.onload = function() {
        console.log(WebUploader);
        var uploader = WebUploader.create({

            // swf文件路径
            swf: '/js/Uploader.swf',

            // 文件接收服务端。
            server: 'http://webuploader.duapp.com/server/fileupload.php',

            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#picker',

            // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            resize: false
        });
        console.log(uploader);

        uploader.on( 'uploadProgress', function( file, percentage ) {
            var $li = $( '#'+file.id ),
                $percent = $li.find('.progress .progress-bar');

            // 避免重复创建
            if ( !$percent.length ) {
                $percent = $('<div class="progress progress-striped active">' +
                  '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                  '</div>' +
                '</div>').appendTo( $li ).find('.progress-bar');
            }

            $li.find('p.state').text('上传中');

            $percent.css( 'width', percentage * 100 + '%' );
        });

        uploader.on( 'uploadSuccess', function( file ) {
            $( '#'+file.id ).find('p.state').text('已上传');
        });

        uploader.on( 'uploadError', function( file ) {
            $( '#'+file.id ).find('p.state').text('上传出错');
        });

        uploader.on( 'uploadComplete', function( file ) {
            $( '#'+file.id ).find('.progress').fadeOut();
        });

    }
</file-upload>