var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');

var remotefilePath = "http://leiquan.site/img/big.png";
var callback;

http.createServer(function (req, res) {


    if (req.method == "GET") {
        var params = [];
        params = url.parse(request.url, true).query;


        res.end();
    } else if (req.method == "POST") {

    }


    var form = new formidable.IncomingForm();

    console.log(req.query);

    callback = "1";

    form.uploadDir = path.join(__dirname, "./temp");//必须设置
    form.keepExtensions = true;
    form.multiples = true;
    form.encoding = 'utf-8';

    form.parse(req, function (error, fields, files) {
            console.log("parsing done");
            //console.log('error:' + error);
            //console.log('fields:' + fields);
            //console.log('files:' + files);
        }
    );

    form.on('progress', function (bytesReceived, bytesExpected) {
        console.log('上传进度:');
        console.log(bytesReceived / bytesExpected);
    });

    form.on('fileBegin', function (name, file) {
        console.log('文件传输已经开始, 文件名:' + name);
    });
    form.on('file', function (name, file) {
        console.log('name:' + name);
        console.log('file:' + file);

        fs.renameSync(file.path, path.join(__dirname, "./upload/888.jpg"));
    });

    form.on('field', function (name, value) {
        console.log(name + ':' + value);
    });

    form.on('end', function () {
        res.writeHead(200, {"Access-Control-Allow-Origin": "*", "Content-Type": "text/html"});

        res.write("<script type=\"text/javascript\">");

        res.write("console.log('window');");
        res.write("console.log('window.parent');");
        res.write("console.log('window.parent.CKEDITOR');");

        res.write("window.parent.CKEDITOR.tools.callFunction(" + callback
            + ",'" + remotefilePath + "','hehe'" + ")");
        res.write("</script>");

        res.end();
    });

}).listen(8888);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');