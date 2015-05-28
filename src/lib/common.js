/*
 * Utils 函数
 */
var utils = {
    httpGet: function(url, callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.send(null);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4) { 
                if (xmlhttp.status === 200) {
                    try {
                        var data = JSON.parse(xmlhttp.responseText)
                    }
                    catch(e) {
                        alert('解析错误');
                    }
                    callback(data);
                }
            }
        }
    },

    httpPost: function(url, params, callback, type) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/json");
        xmlhttp.send(params);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4) { 
                if (xmlhttp.status === 200) {
                    try {
                        var data = JSON.parse(xmlhttp.responseText)
                    }
                    catch(e) {
                        alert('解析错误');
                    }
                    callback(data);
                }
                else {
                    alert('网络错误');
                }
            } 
        };
    },

    htmlEncode: function(value){
        var div = document.createElement('div');
        div.innerHTML = value; 
        return div.innerText;
    },

    addParams: function(url, str) {
        if (url.match(/\?/)) {
            return url + '&' + str;
        }
        else {
            return url + '?' + str;
        }
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
    }
}