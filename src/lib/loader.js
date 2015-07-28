/**
 * @file loader.js
 * @author sucer(lipenghui01@baidu.com)
 */

var loader = {};

var HEAD_NODE = document.getElementsByTagName('head')[0];

loader.loadList = [];
loader.loadedList = [];
loader.timeCount = 0;

loader.jsLoader = function (opt) {
    this.checkSource(opt);
};

if (!Array.prototype.every) {
    Array.prototype.every = function (callbackfn, thisArg) {
        'use strict';
        var T;
        var k;

        if (this == null) {
            throw new TypeError('this is null or not defined');
        }

        // 1. Let O be the result of calling ToObject passing the this
        //    value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method
        //    of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If IsCallable(callbackfn) is false, throw a TypeError exception.
        if (typeof callbackfn !== 'function') {
            throw new TypeError();
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 1) {
            T = thisArg;
        }

        // 6. Let k be 0.
        k = 0;

        // 7. Repeat, while k < len
        while (k < len) {

            var kValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal
            //    method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal method
                //    of O with argument Pk.
                kValue = O[k];

                // ii. Let testResult be the result of calling the Call internal method
                //     of callbackfn with T as the this value and argument list
                //     containing kValue, k, and O.
                var testResult = callbackfn.call(T, kValue, k, O);

                // iii. If ToBoolean(testResult) is false, return false.
                if (!testResult) {
                    return false;
                }
            }
            k++;
        }
        return true;
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {

        var k;

        // 1. Let O be the result of calling ToObject passing
        //    the this value as the argument.
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get
        //    internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If len is 0, return -1.
        if (len === 0) {
            return -1;
        }

        // 5. If argument fromIndex was passed let n be
        //    ToInteger(fromIndex); else let n be 0.
        var n = +fromIndex || 0;

        if (Math.abs(n) === Infinity) {
            n = 0;
        }

        // 6. If n >= len, return -1.
        if (n >= len) {
            return -1;
        }

        // 7. If n >= 0, then Let k be n.
        // 8. Else, n<0, Let k be len - abs(n).
        //    If k is less than 0, then let k be 0.
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        // 9. Repeat, while k < len
        while (k < len) {
            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the
            //    HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            //    i.  Let elementK be the result of calling the Get
            //        internal method of O with the argument ToString(k).
            //   ii.  Let same be the result of applying the
            //        Strict Equality Comparison Algorithm to
            //        searchElement and elementK.
            //  iii.  If same is true, return k.
            if (k in O && O[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}

loader.checkSource = function (opt) {
    var list = [];
    for (var i = 0, len = opt.deps.length; i < len; i++) {
        if (this.config[opt.deps[i]]) {
            list.push(this.config[opt.deps[i]]);
        }
        else {
            list.push(opt.deps[i]);
        }
    }
    this.loadJs(opt, list);
};
// var c = 0;

loader.loadJs = function (obj, list) {
    // console.log(c++);
    var src = list.shift();
    var self = this;
    if (!src) {
        var passed = self.loadList.every(function (item) {
            return self.loadedList.indexOf(item) !== -1;
        });
        if (passed) {
            self.timeCount = 0;
            return obj.onloaded && obj.onloaded();
        }
        else {
            if (obj.timeout && self.timeCount >= obj.timeout) {
                if (typeof obj.failure === 'function') {
                    obj.failure();
                }
                return;
            }
            else {
                setTimeout(function () {
                    self.timeCount += 200;
                    self.loadJs(obj, list);
                }, 200);
            }
        }
        return;
    }

    if (self.loadedList.indexOf(src) === -1) {
        if (self.loadList.indexOf(src) === -1) {
            self.loadList.push(src);
            var webUploadJS = document.createElement('script');
            webUploadJS.src = src;
            HEAD_NODE.appendChild(webUploadJS);
            if (webUploadJS.readyState) {
                webUploadJS.onreadystatechange = function () {
                    if (
                        webUploadJS.readyState === 'loaded'
                        || webUploadJS.readyState === 'complete'
                    ) {

                        self.loadedList.push(src);
                        self.loadJs(obj, list);
                    }
                };
            }
            else {
                webUploadJS.onload = function () {
                    self.loadedList.push(src);
                    self.loadJs(obj, list);
                };
            }
        }
        else {
            self.loadJs(obj, list);
        }
    }
    else {
        self.loadJs(obj, list);
    }
};
