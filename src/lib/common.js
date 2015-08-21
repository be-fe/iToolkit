/*
 * Utils 函数
 */
var utils = {
    httpGet: function(url, params, callback, complete) {
        var xmlhttp = new XMLHttpRequest();
        var url = utils.concatParams(url, params);
        xmlhttp.open("GET", url, true);
        xmlhttp.send(null);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4) {
                if (complete && typeof complete === 'function') {
                    complete();
                }
                if (xmlhttp.status === 200) {
                    var body = xmlhttp.responseText;
                    try {
                        if (typeof body === 'string') {
                            var data = JSON.parse(body);
                        }
                        else {
                            var data = body;
                        }
                    }
                    catch(e) {
                        alert('解析错误');
                    }
                    callback(data);
                }
            }
        }
    },

    httpPost: function(url, params, callback, complete) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/json");
        xmlhttp.send(params);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4) { 
                if (complete && typeof complete === 'function') {
                    complete();
                }
                if (xmlhttp.status === 200) {
                    try {
                        var data = JSON.parse(xmlhttp.responseText)
                    }
                    catch(e) {
                        console.log('解析错误');
                    }
                    callback(data);
                }
                else {
                    console.log('网络错误');
                }
            } 
        };
    },

    jsonp: function (url, params, callback) {
        var now = Date.now();
        var script = document.createElement('script');
        var head = document.getElementsByTagName('head')[0];
        var url = utils.concatParams(url, params);
        if (!params.callback) {
            if (url.match(/\?/)) {
                var src = url + '&callback=jsonpCallback' + now;
            }
            else {
                var src = url + '?callback=jsonpCallback' + now;
            }
            var funcName = 'jsonpCallback' + now;
        }
        else {
            var src = url;
            var funcName = params.callback;
        }
        script.src = src;
        head.appendChild(script);
        window[funcName] = function(data) {
            if (typeof data === 'string') {
                try {
                    data = JSON.parse(data);
                }
                catch(e) {}
            }
            callback(data);
        }
        script.onerror = function() {
            console.log('jsonp error');
        };
        script.onload = function() {
            head.removeChild(script);
        }
    },

    htmlEncode: function(value){
        var div = document.createElement('div');
        div.innerHTML = value; 
        return div.innerText;
    },

    concatParams: function(url, params) {
        if (url.match(/\?/)) {
            var str = '&'
        }
        else {
            var str = '?'
        }
        for(i in params) {
            str = str + i + '=' + params[i] + '&';
        }
        str = str.replace(/&$/, '');
        return url + str;
    },

    setCookie: function(key, value, expires, path) {
        var exp = new Date();
        var path = path || '/';
        exp.setTime(exp.getTime() + expires);
        document.cookie = key + "=" + escape (value) + ";path=" + path + ";expires=" + exp.toGMTString();
    },

    transBytes: function(bytes) {
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return 'n/a';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        if (i == 0) return bytes + sizes[i]; 
        return (bytes / Math.pow(1024, i)).toFixed(1) + sizes[i];
    },

    transTimes: function(timeStamp) {
        var timeStamp = parseInt(timeStamp, 10);
        var time = new Date(timeStamp * 1000)
        var now = new Date().getTime()/1000;
        var dv = now - timeStamp;
        if ( dv < 86400) {
            return time.getHours() + ':' + time.getMinutes();
        }
        else if ( dv > 86400 && dv < 172800) {
            return '昨天';
        }
        else if ( dv > 172800) {
            var Y = (time.getFullYear() + '-').substring(2);
            var M = (time.getMonth()+1 < 10 ? '0' + (time.getMonth()+1) : time.getMonth()+1) + '-';
            var D = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
            return Y + M + D;
        }
    },

    hasClass: function (obj, cls) {
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    },

    addClass: function (obj, cls) {
        obj.className.trim();
        if (!this.hasClass(obj, cls)) obj.className += " " + cls;
    },

    removeClass: function (obj, cls) {
        if (utils.hasClass(obj, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        }
    },

    toggleClass: function(obj, cls) {
        if (utils.hasClass(obj, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        } 
        else {
            obj.className += " " + cls;
        }
    },

    insertAfter: function(newElement, targetElement){
        var parent = targetElement.parentNode;
        if (parent.lastChild == targetElement) {
            parent.appendChild(newElement);
        }
        else {
            parent.insertBefore(newElement, targetElement.nextSibling);
        }
    },

    insertAfterText: function(newElement, targetElement) {
        var parent = targetElement.parentNode;
        if (parent.lastChild == targetElement) {
            parent.appendChild(newElement);
        }
        else {
            var next = targetElement.nextSibling;
            if (next.nodeType === 3) {
                next = next.nextSibling;
            }
            parent.insertBefore(newElement, next);
        }
    },

    isType: function (type) {
        return function (obj) {
            return toString.call(obj) === '[object ' + type + ']';
        }
    },

    makeArray: function () {
        return Array.prototype.concat(obj);
    },

    extend: function(src, obj) {
        for (var key in obj) {
            if (!src[key]) {
                src[key] = obj[key];
            }
        }
    }
};

utils.extend(utils, {
    isArray: utils.isType('Array'),
    isObject: utils.isType('Object'),
    isFunction: utils.isType('Function'),
    isElement: function (obj) {
        return toString.call(obj).indexOf('Element') !== -1;
    },
});

utils.extend(utils, {
    jsLoader: (function () {
        var HEAD_NODE = document.head || document.getElementsByTagName('head')[0];
        var cache = {};
        var _cid = 0;
        var tasks = [];
        var isArray = utils.isArray;
        var isFunction = utils.isFunction;
        var makeArray = utils.makeArray;
        var DONE = 'done';
        var INPROCESS = 'inprocess';
        var REJECTED = 'rejected';
        var PENDING = 'pending';
        var processCache = {};

        /**
         * 产生客户端id
         * @return {Number} [description]
         */
        function cid() {
            return _cid++;
        }

        function isCSS(css) {
            return css.match(/\.css\??/);
        }

        /**
         * Script对象，储存需要加载的脚本的基本信息
         * @param {String} uri 地址
         */
        function Script(uri) {
            this.uri = uri;
            this.cid = cid();
            this.status = PENDING;
        }

        /**
         * 从缓存中获取需要的Script对象
         * @param  {String} uri [description]
         * @return {Object}     需要的Script对象
         */
        Script.get = function (uri) {
            // 如果不存在于缓存中，创建一个新的Script对象
            return cache[uri] || (cache[uri] = new Script(uri));
        };

        /**
         * 当加载完成或失败时调用的处理函数
         * @param  {Object} js Script对象
         * @return {[type]}    [description]
         */
        Script.resolve = function (js) {
            var self = this;
            self.status++;
            if (js && js.status === REJECTED) {
                var error = Error('Source: ' + js.uri + ' load failed');
                reject(error);
            }
            if (self.status === self.task.length) {
                setTimeout(function () {
                    self.callback && self.callback();
                    self = null;
                    resolve(tasks.shift());
                }, 7);
            }
        };

        /**
         * jsLoader
         * @param  {[type]}   js       function or string or array
         * @param  {Function} callback 加载完成后的回调
         * @return {Function}          
         */
        function jsLoader(js, callback) {
            jsLoader.then(js, callback).start();
            return jsLoader;
        }

        /**
         * then方法用于向任务列表增加任务
         * @param  {[type]}   js       function or string or array
         * @param  {Function} callback [description]
         * @return {Function}          [description]
         */
        jsLoader.then = function (js, callback) {
            if (!js) {
                return jsLoader;
            }
            if (!isArray(js)) {
                js = makeArray(js);
            }
            var resolver = {
                task: [],
                callback: callback,
                status: 0
            };
            for (var i = 0; i < js.length; i++) {
                resolver.task.push(getCache(js[i]));
            }
            tasks.push(resolver);
            // jsLoader.resolve();
            return jsLoader;
        };

        /**
         * [reject description]
         * @param  {Object} e Object Error
         * @return {[type]}   [description]
         */
        function reject(e) {
            throw e;
        }

        /**
         * 执行任务序列中的任务
         * @param  {Object} resolver [description]
         * @return {[type]}          [description]
         */
        function resolve(resolver) {
            if (!resolver) {
                if (!tasks.length) {
                    return;
                }
            }
            for (var i = 0; i < resolver.task.length; i++) {
                var js = resolver.task[i];
                request(js, resolver);
            }
        }

        /**
         * 开始
         * @return {[type]} [description]
         */
        jsLoader.start = function () {
            resolve(tasks.shift());
            return jsLoader;
        }

        function loadStyles(script, resolver) {
            var node = document.createElement('link');
            node.type = 'text/css';
            node.rel = 'stylesheet';
            node.href = script.uri;
            HEAD_NODE.appendChild(node);
            node = null;
            script.status = DONE;
            Script.resolve.call(resolver);
        }

        /**
         * [request description]
         * @param  {[type]} js       [description]
         * @param  {[type]} resolver [description]
         * @return {[type]}          [description]
         */
        function request(js, resolver) {
            if (isFunction(js.uri)) {
                try {
                    js.uri();
                    js.status = DONE;
                    Script.resolve.call(resolver);
                }
                catch (e) {
                    js.status = REJECTED;
                    Script.resolve.call(resolver);
                }
                return;
            }
            if (js.status === DONE) {
                Script.resolve.call(resolver);
                return;
            }
            if (isCSS(js.uri)) {
                loadStyles(js, resolver);
                return;
            }
            if (js.status === INPROCESS) {
                // 在loading过程中，标记遇到的resolver
                js.changeStatus = true;
                processCache[js.cid] = processCache[js.cid] || [];
                processCache[js.cid].push({js:js, resolver:resolver});
                return;
            }
            js.status = INPROCESS;
            var node = document.createElement('script');
            node.async = true;
            node.src = js.uri;
            node.onload = node.onerror = onloadResolve;
            HEAD_NODE.appendChild(node);

            function onloadResolve(evt) {
                if (evt.type === 'error') {
                    js.status = REJECTED;
                }
                if (evt.type === 'load') {
                    js.status = DONE;
                }
                Script.resolve.call(resolver, js);
                if (js.changeStatus) {
                    // 如果加载完成，处理处在waiting状态下的任务
                    js.changeStatus = false;
                    for (var i = 0; i < processCache[js.cid].length; i++) {
                        var tmp = processCache[js.cid][i];
                        Script.resolve.call(tmp.resolver, tmp.js);
                    }
                    processCache[js.cid] = null;
                }
                node.onload = node.onerror = null;
                HEAD_NODE.removeChild(node);
                node = null;
            }
        }

        /**
         * 获取可能存在别名的Script对象
         * @param  {String} uri [description]
         * @return {Object}     Script Object
         */
        function getCache(uri) {
            var src = getAlias(uri);
            return  src ? Script.get(src) : Script.get(uri);
        }

        /**
         * 获取真实地址
         * @param  {String} str [description]
         * @return {[type]}     [description]
         */
        function getAlias(str) {
            return jsLoader.alias[str];
        }

        jsLoader.alias = {};

        return jsLoader;

    })()
});

/*
 * 全局事件监控
 */
var EventCtrl = EC = riot.observable();

/*
 * 外部方法传入
 */
var iToolkit = {};
iToolkit.methodRegister = function (name, fn) {
    for (var i in iToolkit) {
        if (name === i) {
            return;
        }
    }
    iToolkit[name] = fn;
};
iToolkit.tableExtend = {};
