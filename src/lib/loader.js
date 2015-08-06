(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(function () {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return (root.jsLoader = factory());
        });
    } else {
        // Browser globals
        root.jsLoader = factory();
    }
}(this, function () {

    var cache = {};
    var _cid = 0;
    var tasks = [];
    var toString = Object.prototype.toString;
    var isArray = isType('Array');
    var isFunction = isType('Function');
    var HEAD_NODE = document.head || document.getElementsByTagName('head')[0];
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
     * 用于获取类型的方法
     * @param  {String}  type [description]
     * @return {Boolean}      [description]
     */
    function isType(type) {
        return function (obj) {
            return toString.call(obj) === '[object ' + type + ']';
        }
    }

    /**
     * 将传入参数处理成数组形式
     * @param  {[type]} obj [description]
     * @return {Array}      [description]
     */
    function makeArray(obj) {
        return Array.prototype.concat(obj);
    }

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
    };

    /**
     * 获取真实地址
     * @param  {String} str [description]
     * @return {[type]}     [description]
     */
    function getAlias(str) {
        return jsLoader.jsAlias[str];
    }

    jsLoader.jsAlias = {};

    return jsLoader;

}));