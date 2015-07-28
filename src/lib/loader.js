/**
 * @file loader.js
 * @author sucer(lipenghui01@baidu.com)
 */

// How to use loader?
// Here is a example.
// 
// var v = new Date().getTime();
// 
// loader.config = {
//  'angular': 'http://libs.useso.com/js/angular.js/1.2.9/angular.min.js' + '?v=' + v,
//  'preload': 'http://libs.useso.com/js/PreloadJS/0.4.1/preloadjs.min.js',
//  'd3': 'http://libs.useso.com/js/d3/3.4.8/d3.min.js',
//  'extend': 'extend.js',
// };
// 
// loader.jsLoader([
//  'angular',
//  'preload',
//  'd3',
//  'extend.js'
// ], function () {
//  console.log(extend);
// });
// 
// loader.jsLoader('../lazyLoad.js', function () {})

var loader = {};

var HEAD_NODE = document.getElementsByTagName('head')[0];

loader.loadList = [];
loader.loadedList = [];

loader.jsLoader = function () {
    var self = this;
    var param = [].slice.apply(arguments);
    var list = [];
    var callback;

    for (var i = param.length - 1; i >= 0; i--) {
        if (param[i] instanceof Array) {
            for (var j = param[i].length - 1; j >= 0; j--) {
                self.checkSource(param[i][j], list);
            }
        }
        else if (typeof param[i] === 'string') {
            self.checkSource(param[i], list);
        }
        else if (typeof param[i] === 'function') {
            callback = param[i];
        }
    }

    self.loadJs(list, callback);
};

loader.checkSource = function (item, list) {
    if (this.config[item]) {
        list.push(this.config[item]);
    }
    else {
        list.push(item);
    }
};

// var c = 0;
loader.loadJs = function (list, callback) {
    // console.log(c++);
    var src = list.shift();
    var self = this;

    if (!src) {
        var passed = self.loadList.every(function (item) {
            return self.loadedList.indexOf(item) !== -1;
        });
        if (passed) {
            self.timeCount = 0;
            return callback && callback();
        }
        else {
            setTimeout(function () {
                self.loadJs(list, callback);
            }, 200);
        }
        return;
    }

    if (self.loadList.indexOf(src) === -1) {
        self.loadList.push(src);
        var webUploadJS = document.createElement('script');
        webUploadJS.src = src;
        HEAD_NODE.appendChild(webUploadJS);
        webUploadJS.onload = function () {
            self.loadedList.push(src);
            self.loadJs(list, callback);
        };
    }
    else {
        self.loadJs(list, callback);
    }
};
