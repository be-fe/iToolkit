riot.tag('date-picker', '<yield>', function(opts) {
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
        path = jsPath + 'plugins/laydate/';
    }
    else {
        path = config.path;
    }

    var theme = config.theme ? config.theme : 'default';

    utils.jsLoader([
        path + 'laydate.min.js',
        path + '/need/' + 'laydate.css',
        path + '/skins/' + theme + '/laydate.css'
    ], function () {
        for (var i = 0; i < EL.children.length; i++) {
            var child = EL.children[i];
            if (child.attributes['pTrigger']) {
                self.pTrigger = child;
            }
            if (child.attributes['media']) {
                self.media = child;
            }
        }
        self.resolve();
        self.update();
    });

    this.resolve = function() {
        if (self.pTrigger || self.media) {
            if (self.pTrigger === self.media) {
                config.elem = config.pTrigger = self.media;
            }
            if (typeof self.pTrigger === 'undefined') {
                config.elem = self.media;
            }
            if (
                self.pTrigger
                && self.media
                && (self.pTrigger !== self.media)
            ) {
                config.pTrigger = self.pTrigger;
                config.elem = self.media;
            }
            if (self.pTrigger && !self.media) {
                config.elem = self.pTrigger;
                config.justChoose = true;
            }
        }
        else {
            throw 'media and pTrigger property was not found in the element';
        }

        if (config.pTrigger) {
            config.pTrigger.onclick = function (e) {
                laydate(config);
            }
            return;
        }
        laydate(config);
    }.bind(this);
    
});

riot.tag('dropdown', '<yield> <div class="r-dropdown">{ title }</div> <ul class="r-downdown-menu"> <li class="r-dropdown-list" each="{ data }"><a href="{ link|\'javascript:void(0)\' }">{ name }</a></li> </ul>', function(opts) {
	var self = this;
    var EL = self.root;
    var config = self.opts.opts || self.opts;
	
});
riot.tag('editable-link', '<a href="javascript:void(0);" if="{ !editable }" onclick="{ open }">{ value }</a> <super-form if="{ editable }" action="{ action }" opts="{ formOpts }"> <input type="text" value="{ parent.value }" name="{ parent.name }" class="editable-link-input"> <input type="submit" value="提交"> <button onclick="{ parent.close }">取消</button> </super-form>', function(opts) {

    var self = this;
    self.editlink = false;
    var EL = self.root;
    var config = self.opts.opts || self.opts;

    self.on('mount', function() {
        self.action = EL.getAttribute('action');
        self.value = EL.getAttribute('text');
        self.name = EL.getAttribute('name');
        self.update();
    })

    this.open = function(e) {
        self.editable = true;
        self.update();
    }.bind(this);

    this.close = function(e) {
        self.editable = false;
        self.update();
    }.bind(this);

    self.formOpts = {
        errCallback: function() {
            config.errCallback();
            EL.querySelector('.editable-link-input').value = self.value;
            self.editable = false;
            self.update();
        },
        callback: function(value) {
            config.callback();
            self.value = EL.querySelector('.editable-link-input').value;
            self.editable = false;
            self.update();
        }
    }

});
riot.tag('goto-top', '<div class="itoolkit-goto-top" show="{ showGotoTop }" onclick="{ gotoTop }"> <yield> <span class="itoolkit-goto-top-icon" show="{ showDefault }"><span class="icon-arrowUp"></span></span> </div>', 'goto-top .itoolkit-goto-top{ display: block; position: fixed; bottom: 50px; right: 40px; height: 60px; width: 60px; z-index: 10000; text-align: center; opicity: 0.5; cursor: pointer; } goto-top .itoolkit-goto-top .itoolkit-goto-top-icon{ font-size: 3em; margin: auto; float: none; }', function(opts) {

    var self = this;
    self.config = self.opts.opts || self.opts;
    var avalibleHeight = window.screen.availHeight;
    var EL = self.root;
    
    self.on('mount', function() {
        self.root.querySelector('.itoolkit-goto-top').style.bottom = self.config.bottom;
        self.root.querySelector('.itoolkit-goto-top').style.right = self.config.right;
        if (EL.querySelector('.itoolkit-goto-top').firstElementChild.className === 'itoolkit-goto-top-icon') {
            self.showDefault = true;
        }
        window.addEventListener('scroll', self.controlGotoTop);
    })
    
    self.controlGotoTop = function() {
        var body = document.body;
        if (body.scrollTop > avalibleHeight && !self.showGotoTop) {
            self.showGotoTop = true;
            self.update();
        }
        else if (body.scrollTop < avalibleHeight && self.showGotoTop) {
            self.showGotoTop = false;
            self.update();
        }
    }

    this.gotoTop = function(e) {
        var length = document.body.scrollTop / 100 * 16;
        var timer = setInterval(function() {
            document.body.scrollTop = document.body.scrollTop - length;
            if (document.body.scrollTop < 10) {
                clearInterval(timer);
            }
        }, 16);
    }.bind(this);
    

});
riot.tag('loading', '<div class="{itoolkit-loading: true, default: default}" > <yield> </div>', 'loading .itoolkit-loading { text-align: center; }', function(opts) {

    var self = this;
    var config = self.opts.opts || self.opts;
    self.default = true;
    
    self.on('mount', function() {
        var parentDom = self.root.parentNode;
        var parentPosition = window.getComputedStyle(parentDom, null).position;
        if (parentPosition === 'static') {
            parentDom.style.position = 'relative';
        }

        self.childDom = self.root.getElementsByClassName('itoolkit-loading')[0];

        if (self.childDom.innerHTML.trim()) {
            self.default = false;
            self.update();
        }

        var cellHeight = parseInt(window.getComputedStyle(self.childDom, null).height.replace('px', ''), 10);
        self.root.style.marginTop = '-' + cellHeight/2 + 'px';
        
    })

    self.root.show = function(){
        if (self.childDom) {
            self.childDom.style.display = 'block';
        }
    }

    self.root.hide = function(){
        if (self.childDom) {
            self.childDom.style.display = 'none';
        }
    }
    

});
riot.tag('modal', '<div class="itoolkit-modal-dialog" riot-style="width:{width}; height:{height}"> <div class="itoolkit-modal-title"> <span>{ title }</span> <div class="itoolkit-modal-close-wrap" onclick="{ close }"> <div class="itoolkit-modal-close"></div> </div> </div> <div class="itoolkit-modal-container"> <yield> </div> </div>', function(opts) {

    var self = this;
    var config = self.opts.opts || self.opts;
    var EL = self.root;
    for (i in config) {
        self[i] = config[i];
    }
    self.width = config.width || 600;
    self.height = config.height || 'auto';

    self.on('mount', function() {
        var container = self.root.querySelector('.itoolkit-modal-container');
        var head = self.root.querySelector('.itoolkit-modal-title');
        var headHeight = parseInt(window.getComputedStyle(head, null).height.replace('px', ''));
        if (config.height) {
            container.style.height = (self.height - headHeight - 2) + 'px';
        }

    })

    this.close = function(e) {
        self.root.style.display = 'none';
        self.onClose && self.onClose();
    }.bind(this);

    if (document.querySelector("[modal-open-target='" + self.root.id + "']")) {
        document.querySelector("[modal-open-target='" + self.root.id + "']").onclick = function() {
            self.root.style.display = 'block';
            self.onOpen && self.onOpen();
        }
    }

    self.root.open = function() {
        self.root.style.display = 'block';
        self.onOpen && self.onOpen();
    }

    self.root.close = function() {
        self.root.style.display = 'none';
        self.onClose && self.onClose();
    }

    self.root.loadData = function(newData, colName){
        colName = colName || 'data';
        self[colName] = newData;
        self.update();
    }




});
riot.tag('paginate', '<div onselectstart="return false" ondragstart="return false"> <div class="paginate"> <li onclick="{ goFirst }">«</li> <li onclick="{ goPrev }">‹</li> </div> <ul class="paginate"> <li each="{ pages }" onclick="{ parent.changePage }" class="{ active: parent.currentPage == page }">{ page }</li> </ul> <div class="paginate"> <li onclick="{ goNext }">›</li> <li onclick="{ goLast }">»</li> </div> <div class="paginate"> <form onsubmit="{ redirect }"> <span class="redirect" if="{ redirect }">跳转到<input name="page" riot-type={"number"} style="width: 40px;" min="1" max="{ pageCount }">页 </span> <span class="page-sum" if="{ showPageCount }"> 共<em>{ pageCount }</em>页 </span> <span class="item-sum" if="{ showItemCount }"> <em>{ count }</em>条 </span> <input type="submit" style="display: none;"> </form> </div> </div>', function(opts) {
    
    var self = this;
    var EL = self.root;
    var config = self.opts.opts || self.opts;
    
    self.count = config.count || 0;
    self.pagesize = config.pagesize || 20;
    self.pageCount = config.pageCount || Math.ceil(self.count/self.pagesize) || 1;
    self.currentPage = config.currentPage || 1;
    self.url = config.url || '';
    self.showNumber = config.showNumber || 5;

    self.redirect = config.redirect || true;
    self.showPageCount = config.showPageCount || true;
    self.showItemCount = config.showItemCount || true;
    self.needInit = config.needInit || false;

    EL.addCount = function (num) {
        var count = self.count + num;
        var oldPageCount = self.pageCount;
        count < 0
        ? self.count = 0
        : self.count = count;

        self.pageCount = Math.ceil(self.count/self.pagesize) || 1;
        self.currentPage = (
            self.currentPage > self.pageCount
            ? self.pageCount
            : self.currentPage
        );

        if (self.pageCount <= self.showNumber) {
            self.pages = [];
            for (var i = 0; i < self.pageCount; i++) {
                self.pages.push({page: i + 1});
            }
        }

        if (self.needInit) {
            config.callback(self.currentPage);
        }

        self.pageChange(self.currentPage)
        self.update();
    };
    
    if (self.needInit) {
        config.callback(self.currentPage);
    }

    self.pages = [];
    
    if (self.pageCount < (self.showNumber + 1)) {
        for (i = 0; i < self.pageCount; i++) {
            self.pages.push({page: i + 1});
        }
    } 
    else {
        for (i = 0; i < self.showNumber; i++) {
            self.pages.push({page: i + 1});
        }
        self.pages.push({page: '...'});
    }
    self.update();

    this.goFirst = function(e) {
        self.pageChange(1);
    }.bind(this);

    this.goPrev = function(e) {
        if (self.currentPage > 1) {
            self.pageChange(self.currentPage - 1);
        }
    }.bind(this);

    this.goNext = function(e) {
        if (self.currentPage < self.pageCount) {
            self.pageChange(self.currentPage + 1);
        }
    }.bind(this);
    
    this.goLast = function(e) {
        self.pageChange(self.pageCount);
    }.bind(this);

    this.redirect = function(e) {
        var index = self.page.value;
        if (parseInt(index, 10) && parseInt(index, 10) < (self.pageCount + 1)) {
            self.pageChange(parseInt(index, 10));
        }
    }.bind(this);

    this.changePage = function(e) {
        var page = e.item.page
        if (typeof(page) === 'string') {
            return false;
        }
        else {
            self.pageChange(page);
        }
    }.bind(this);

    self.pageChange = function(page) {
        if (self.currentPage != page) {
            self.currentPage = page;
            config.callback(page);
        }
        if (self.currentPage > Math.ceil(self.showNumber/2) && self.pageCount > self.showNumber) {
            self.pages = [];
            if (self.pageCount - self.currentPage > 2) {
                var origin = self.currentPage - Math.ceil(self.showNumber/2);
                var last = self.currentPage + Math.floor(self.showNumber/2);
            }
            else {
                var last = self.pageCount;
                var origin = self.pageCount - self.showNumber;
            }
            for (i = origin; i < last; i++) {
                self.pages.push({page: i + 1});
                self.update();
            }
            
        }
        else if (self.currentPage < (Math.ceil(self.showNumber/2) + 1) && self.pageCount > self.showNumber){
            self.pages = [];
            for (i = 0; i < self.showNumber; i++) {
                self.pages.push({page: i + 1});
            }
            self.pages.push({page: '...'});
        }
    };



});
riot.tag('select-box', '<div class="r-select" onclick="{ clicked }">{ placeholder }</div> <ul class="r-select-body" hide="{ hide }"> <li each="{ data }" index="{ index }" value="{ value }" class="r-select-item { selected }" onclick="{ parent.clickItem }">{ innerText }</li> </ul> <div style="display:none" class="inputHide"></div>', function(opts) {
    var self = this;
    var EL = self.root;
    self.config = self.opts.opts || self.opts;

    self.data = [];

    self.placeholder = self.config.placeholder;

    self.callback = self.config.callback;

    self.name = self.config.name;

    self.value = [];

    self.prevNode = null;

    EL.getValue = function () {
        return self.value;
    };

    self.hide = true;

    this.clicked = function(e) {
        self.hide = false;
        self.update();
    }.bind(this);

    this.updateValue = function(item) {
        for (var i = 0; i < self.data.length; i++) {
            if (self.data[i].selected) {
                self.value.push(self.data[i].value);
                self.placeholder.push(self.data[i].innerText);
            }
        }
        if (self.value.length == self.size) {
            self.hide = true;
        }
        self.placeholder = self.placeholder.join(',');
        self.prevNode = item;
        self.callback && self.callback(self);
        self.update();
    }.bind(this);
 
    this.clickItem = function(e) {
        var item = e.target || e.srcElement;
        var index = +item.getAttribute('index');
        self.value.length = 0;
        self.placeholder = [];
        if (self.mutiple) {
            self.data[index].selected = self.data[index].selected ? '' : 'selected';
            self.updateValue(null);
            return;
        }
        if (self.prevNode) {
            self.data[+self.prevNode.getAttribute('index')].selected = '';
        }
        self.data[index].selected = 'selected';
        self.updateValue(item);
    }.bind(this);

    self.one('mount', function () {
        for (var i = 0; i < self.config.data.length; i++) {
            var child = self.config.data[i];
            child.selected = '',
            child.index = i;
            self.data.push(child);
        }
        self.mutiple = self.config.mutiple || false;
        self.size = self.mutiple ? (self.config.size ? self.config.size : self.data.length) : 1;
        self.update();
    });
    
});
riot.tag('side-list', '<ul > <li each="{ data }"> <img riot-src="{ logoUrl }" if="{ isLogo }"> <span>{ name }</span> </li> </ul>', function(opts) {

});
riot.tag('slide', '', function(opts) {


});
riot.tag('super-div', '<yield>', 'super-div{ display: block; }', function(opts) {
    
    var self = this;
    var config = self.opts.opts || self.opts;
    var EL = self.root;

    for (i in config) {
        self[i] = config[i];
    }
    
    
    self.getData = function(params) {
        var params = params || {};
        if (EL.getAttribute('data-get')) {
            var method = 'httpGet';
        }
        else if (EL.getAttribute('data-jsonp')) {
            var method = 'jsonp';
        }
        
        utils[method](self.superDivUrl, params, function(data) {
            for (i in data) {
                self.data = {};
                self.data[i] = data[i];
            }
            self.update();
        });
    }

    self.on('mount', function() {
        EL.style.display = 'block';
        self.superDivUrl = EL.getAttribute('data-get') || EL.getAttribute('data-jsonp');
        if (self.superDivUrl) {
            self.getData(config.params);
        }
    })
    
    
    self.loadData = EL.loadData = function(newData, colName){
        colName = colName || 'data';
        self[colName] = newData
        self.update();
    }

    self.reload = EL.reload = function() {
        if (self.superDivUrl) {
            self.getData(config.params);
        }
        else {
            self.update();
        }
    }


});
riot.tag('super-form', '<form onsubmit="{ submit }" > <yield> </form>', function(opts) {

    var self = this;
    var EL = self.root;
    var config = self.opts.opts || self.opts;
    var keyWords = [
        'insertTip',
        'ajaxSubmit',
        'submit',
        'removeTips',
        'insertTip',
        'removeTip',
        'loadData',
        'getData',
        'setData'
    ];   //保留字，不被覆盖

    var NUMBER_REGEXP = {
        NON_NEGATIVE_INT: /^0$|^-[1-9]\d*$/,                            //非负整数（正整数 + 0） 
        POSITIVE_INT: /^[1-9]\d*$/,                                     //正整数 
        NON_POSITIVE_INT: /^[1-9]\d*$|^0$/,                             //非正整数（负整数 + 0） 
        NEGATIVE_INT: /^-[1-9]\d*$/,                                    //负整数 
        INT: /^-?[1-9]\d*$|^0$/,                                        //整数 
        NON_NEGATIVE_FLOAT: /^(\d)(\.\d+)?$|^([1-9]\d*)(\.\d+)?$|^0$/,  //非负浮点数（正浮点数 + 0） 
        POSITIVE_FLOAT: /^(\d)(\.\d+)?$|^([1-9]\d*)(\.\d+)?$/,          //正浮点数 
        NON_POSITIVE_FLOAT: /^(-\d)(\.\d+)?$|^(-[1-9]\d*)(\.\d+)?$|^0$/,//非正浮点数（负浮点数 + 0） 
        NEGATIVE_FLOAT: /^(-\d)(\.\d+)?$|^(-[1-9]\d*)(\.\d+)?$/,        //负浮点数 
        FLOAT: /^(-?\d)(\.\d+)?$|^(-?[1-9]\d*)(\.\d+)?$|^0$/            //浮点数
    };

    self.presentWarning = '必填';
    self.emailWarning = '邮箱格式错误';
    self.mobileWarning = '手机格式错误';
    self.urlWarning = '网址格式错误';
    self.successTips = '通过';
    self.regWarning = '字段不符合验证规则';
    self.numWarning = '数字格式错误';

    self.passClass = config.passClass || 'valid-pass';
    self.failedClass = config.failedClass || 'valid-failed';

    
    self.comparator = function (type) {
        return {
            handler: function (validation, min, max, value) {
                switch (type) {
                    case 'number':
                        return self.numComparator(validation, min, max, value);
                    case 'string':
                    default:
                        return self.strCompatator(validation, min, max, value);
                }
            }
        };
    };

    
    self.strCompatator = function(validation, min, max, value) {
        var nMin = isNaN(min);
        var nMax = isNaN(max);
        var len = value.length;
        if (!nMin && !nMax) {
            if (len > max || len < min) {
                validation.msg.push(self.bpWarning(min, max));
            }
        }
        else {
            if (!nMin && len < min) {
                validation.msg.push(self.minWarning(min));
            }
            if (!nMax && len > max) {
                validation.msg.push(self.maxWarning(max));
            }
        }
        return validation;
    }

    
    self.numComparator = function(validation, min, max, value) {
        var nMin = isNaN(min);
        var nMax = isNaN(max);
        var value = +value;
        if (!nMin && !nMax) {
            if (value > max || value < min) {
                validation.msg.push(self.numBpWarning(min, max));
            }
        }
        else {
            if (!nMin && value < min) {
                validation.msg.push(self.minNumWarning(min));
            }
            if (!nMax && value > max) {
                validation.msg.push(self.maxNumWarning(max));
            }
        }
        return validation;
    }

    self.one('mount', function() {
        EL.style.display = 'block';
        if (config.realTime && config.valid) {
            var elems = self.root.getElementsByTagName('form')[0].elements;
            for (var i = 0, len = elems.length; i < len; i ++) {
                var type = elems[i].type;
                if (type !== 'submit' || type !== 'button') {
                    elems[i].addEventListener('input', valueOnChange, false);
                    if (type === 'checkbox' || type === 'radio') {
                        elems[i].addEventListener('change', valueOnChange, false);
                        
                    }
                    elems[i].addEventListener('input', valueOnChange, false);
                }
                
            }
        }
    });

    
    function valueOnChange(e) {
        doCheck([], this);
    }

    function isType(obj) {
        return toString.call(obj).match(/\ (.*)\]/)[1];
    }

    function dif(obj) {
        var constructor = isType(obj);
        if (constructor === 'Null' || constructor === 'Undefined' || constructor === 'Function') {
            return obj;
        }
        return new window[constructor](obj);
    }

    EL.loadData = function(newData, colName){
        if (utils.isObject(newData)) {
            for(var i in newData) {
                newData[i] = dif(newData[i]);
            }
        }
        else {
            newData = dif(newData);
        }
        colName = colName || 'data';
        self[colName] = newData;





        self.update();
    };

    EL.setData = function(newData, name){
        self.data[name] = dif(newData);
        self.update();
    };

    self.checkExistKey = function(obj, key, value) {
        if (obj.hasOwnProperty(key)) {
            if (utils.isArray(obj[key])) {
                obj[key].push(value);
            }
            else {
                var arr = [];
                arr.push(obj[key]);
                arr.push(value)
                obj[key] = arr;
            }                  
        }
        else {
            obj[key] = value;
        }
    }

    self.getData = EL.getData = function(){
        var elems = self.root.getElementsByTagName('form')[0].elements;
        var params = {};
        for (var i = 0; i < elems.length; i++) {
            if (elems[i].name) {
                if (elems[i].tagName === "SELECT") {
                    var selected = elems[i].selectedOptions;
                    for (j = 0; j < selected.length; j++) {
                        value = selected[j].value;
                        self.checkExistKey(params, elems[i].name, encodeURIComponent(value));
                    }
                } 
                else if (elems[i].type === "checkbox" || elems[i].type === "radio"){
                    if (elems[i].checked) {
                        value = elems[i].value;
                        self.checkExistKey(params, elems[i].name, encodeURIComponent(value));
                    }
                }
                else {
                    value = elems[i].value;
                    self.checkExistKey(params, elems[i].name, encodeURIComponent(value));
                }
            }
        }
        return params;
    }
    
    

    for (i in config) {
        if (keyWords.indexOf(i) < 0) {
            self[i] = config[i];
        }
    }
    self.data = config.data;

    self.submitingText = config.submitingText || '提交中...';
    if (config.valid === undefined) {
        config.valid = true;
    }
    
    self.maxWarning = config.maxWarning || function(n) {
        return '不得超过' + n + '个字符';
    }
    self.minWarning = config.minWarning || function(n) {
        return '不得小于' + n + '个字符';
    }

    self.bpWarning = config.bpWarning || function (min, max) {
        return '只允许' + min + '-' + max + '个字符';
    }

    self.minNumWarning = config.minNumWarning || function (n) {
        return '不得小于' + n;
    }
    self.maxNumWarning = config.maxNumWarning || function (n) {
        return '不得大于' + n;
    }
    self.numBpWarning = config.numBpWarning || function (min, max) {
        return '输入数字应在' + min + '-' + max + '之间';
    }

    
    self.removeTips = EL.removeTips = function() {
        var root = self.root;
        var elems = root.getElementsByTagName('form')[0].elements;
        var tips = root.getElementsByClassName('tip-container');
        if (tips && tips.length) {
            del();
        }

        function del() {
            for (i = 0; i < tips.length; i++) {
                tips[i].parentNode.removeChild(tips[i]);                
                if (tips.length) {
                    del();
                }
            }
        }

        for (var i = 0; i < elems.length; i++) {
            utils.removeClass(elems[i], self.passClass);
            utils.removeClass(elems[i], self.failedClass);
        }
    }
    
    
    self.removeTip = EL.removeTip = function(dom){
        var tip = dom.nextElementSibling;
        if (tip && tip.className.match(/tip-container/)) {
            dom.parentNode.removeChild(tip);
        }
        utils.removeClass(dom, self.passClass);
        utils.removeClass(dom, self.failedClass);
    };

    self.insertTip = EL.insertTip = function(dom, message, className){
        var tip = dom.nextElementSibling;
        if (tip && tip.className.match(/tip-container/)) {
            dom.parentNode.removeChild(tip);
        }
        var tipContainer = document.createElement('span');
        tipContainer.className = className;
        tipContainer.innerHTML = message;
        utils.insertAfterText(tipContainer, dom);
    };

    self.onValidRefuse = EL.onValidRefuse = config.onValidRefuse || function(dom, errorTips) {
        self.insertTip(dom, errorTips, 'tip-container');
        utils.removeClass(dom, self.passClass);
        utils.addClass(dom, self.failedClass);
    };

    self.onValidPass = EL.onValidPass = config.onValidPass || function(dom, successTips) {
        self.insertTip(dom, successTips, 'tip-container success');
        utils.removeClass(dom, self.failedClass);
        utils.addClass(dom, self.passClass);
    };

    
    self.ajaxSubmit = function(elems, url) {
        var params = '';
        for (var i = 0; i < elems.length; i++) {
            if (elems[i].name) {
                if (elems[i].tagName === "SELECT") {
                    var selected = elems[i].selectedOptions;
                    for (j = 0; j < selected.length; j++) {
                        value = selected[j].value;
                        params += elems[i].name + "=" + encodeURIComponent(value) + "&";
                    }
                } 
                else if (elems[i].type === "checkbox" || elems[i].type === "radio"){
                    if (elems[i].checked) {
                        value = elems[i].value;
                        params += elems[i].name + "=" + encodeURIComponent(value) + "&";
                    }
                }
                else {
                    value = elems[i].value;
                    params += elems[i].name + "=" + encodeURIComponent(value) + "&";
                }
            }
            if (elems[i].type === "submit") {
                if (elems[i].tagName === 'BUTTON') {
                    var submitbtn = elems[i];
                    var submitText = submitbtn.innerHTML;
                    submitbtn.disabled = 'disabled';
                    submitbtn.innerHTML = self.submitingText;
                }
                else {
                    var submitbtn = elems[i];
                    var submitText = submitbtn.value;
                    submitbtn.disabled = 'disabled';
                    submitbtn.value = self.submitingText;
                }
            }
        }
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(params);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4) {
                self.removeTips();
                if (submitbtn.tagName === 'BUTTON') {
                    submitbtn.innerHTML = submitText;
                }
                else {
                    submitbtn.value = submitText;
                }
                submitbtn.disabled = false;
                if (config.complete && typeof config.complete === 'function') {
                    config.complete();
                }
                if (xmlhttp.status === 200) {
                    try {
                        var result = JSON.parse(xmlhttp.responseText);
                        config.callback && config.callback(result);
                        EC.trigger('submit_success', result);
                    }catch(e){
                        throw new Error(e.message);
                    }
                }
                else {
                    config.errCallback && config.errCallback(params);
                    EC.trigger('submit_error', params);
                }
            } 
        };
    }
    
    
    this.submit = function(e) {
        var validArr = [];
        var elems = self.root.getElementsByTagName('form')[0].elements;
        var action = self.action || self.root.getAttribute('action');
        var url = action;

        if (config.valid) {
            for (var i = 0; i < elems.length; i++) {
                doCheck(validArr, elems[i]);
            }
        }

        if (!validArr.length) {
            try {
                config.beforeSubmit && config.beforeSubmit(validArr);
            }
            catch (e) {
                validArr.push(e);
            }
        }

        if (!validArr.length) {

            if (config.normalSubmit) {
                self.root.firstChild.setAttribute('action', action);
                return true;
            }
            else {
                e.preventDefault();
                self.ajaxSubmit(elems, url);
            }
        }
        else {
            return false;
        }
    }.bind(this);


    self.Validation = function(validArr, name, dom) {
        this.msg = [];        
        this.validTip = function() {
            if (this.msg.length) {
                self.onValidRefuse(dom, this.msg[0]);
                validArr.push(name)
            }
            else {
                self.onValidPass(dom, self.successTips);
            }
        }
    }

    self.validEmail = function(validation, v) {
        if (!v.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/)) {
            validation.msg.push(self.emailWarning);
        }
        return validation;
    }

    self.validUrl = function(validation, v) {
        if (!v.match(/((http|ftp|https|file):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/)) {
            validation.msg.push(self.emailWarning);
        }
        return validation;
    }

    self.validMobile = function(validation, v) {
        if (!v.match(/^1[3|4|5|8][0-9]\d{4,8}$/)) {
            validation.msg.push(self.mobileWarning);
        }
        return validation;
    }

    self.validPresent = function(validation, v) {
        v = v.replace(' ', '');
        if (!v.length) {
            validation.msg.push(self.presentWarning);
        }
        return validation;
    }

    self.validRegExp = function(validation, valid, v, min, max) {
        valid = valid.replace(/^\//, '');
        valid = valid.replace(/\/$/, '');
        var reg = new RegExp(valid);
        if (reg.test(v)) {
            self.comparator('string').handler(validation, min, max, v);
        }
        else {
            validation.msg.push(self.presentWarning);
        }
        return validation;
    }

    self.validNumRange = function(validation, valid, v, min, max) {
        var reg = NUMBER_REGEXP[valid.toUpperCase()];
        if (reg.test(v)) {
            self.comparator('number').handler(validation, min, max, v);
        }
        else {
            validation.msg.push(self.numWarning);
        }
        return validation;
    }

    self.validCustom = function(validation, customValid, v, min, max) {
        if (window[customValid]) {
            var reg = window[customValid].regExp;
            var tips = window[customValid].message || self.regWarning;
            if (reg && reg.test(v)) {
                self.comparator('string').handler(validation, min, max, v); 
            }
            else {
                validation.msg.push(tips);
            }
        }
        return validation;
    }



    
    function doCheck(validArr, elem) {
        var elem = elem;
        var valid = elem.getAttribute('valid');
        var customValid = elem.getAttribute('customValid');
        var vr = elem.getAttribute('vr');
        var orient = elem.getAttribute('orient');
        var max = parseInt(elem.getAttribute('max'), 10);
        var min = parseInt(elem.getAttribute('min'), 10);
        var type = elem.type;
        var allowEmpty = elem.getAttribute('allowEmpty');
        var v = elem.value; 
        var name = elem.name;
        var dom = elem;
        var validation = new self.Validation(validArr, name, dom);

        if (
            allowEmpty === null
            && isNaN(max)
            && isNaN(min)
            && valid === null
            && customValid === null
            && vr === null
            && orient === null
        ) {
            return;
        }
        if (allowEmpty && (v === '' || typeof v !== 'string')) {
            self.onValidPass(dom, self.successTips);
            return;
        }
        if (name && valid) {
            if (valid === 'present') {
                self.validPresent(validation, v);
            }
            else if (valid === 'mobile') {
                self.validMobile(validation, v);
            }
            else if (valid === 'url') {
                self.validUrl(validation, v);
            }
            else if (valid === 'email') {
                self.validEmail(validation, v);
            }
            else if (valid.match(/^\/\S+\/$/)) {
                self.validRegExp(validation, valid, v, min, max);
            }
            else if (NUMBER_REGEXP[valid.toUpperCase()]) {
                self.validNumRange(validation, valid, v, min, max);
            }
        }
        else if (name && !valid) {
            if (customValid) {
                self.validCustom(validation, customValid, v, min, max);
            }
            else {
                if (type === 'text') {
                    self.comparator('string').handler(validation, min, max, v); 
                }
            }
        }
        validation.validTip();

        if (orient) {
            var newEle = EL.querySelector(orient);
            if (elem === newEle || !newEle) {
                return;
            }
            elem = newEle;
            vr = elem.getAttribute('vr');
        }
        if (!validArr.length && vr) {
            var arr = vr.split('::');
            var method = arr[0];
            var params = arr[1] ? arr[1].split(',') : undefined;
            var flag = false;
            try {
                if (iToolkit[method]) {
                    flag = iToolkit[method].apply(elem, params);
                }
            }
            catch (e) {
                flag = false;
                throw e;
            }
            if (!flag) {
                validArr.push('fail');
            }
        }
    }


});
riot.tag('tab', '<ul> <li each="{ data }" onclick="{ parent.toggle }" class="{ active: parent.currentIndex==index }">{ title }</li> </ul> <div class="tab-content"> { content } </div>', function(opts) {

    var self = this
    var config = self.opts.opts || self.opts;

    self.data = config.data;
    if (self.data.length > 0) {
        self.currentIndex = 0;
        self.content = self.data[0].content;
        for (i = 0; i < self.data.length; i++) {
            self.data[i].index = i;
        }
    }
    

    this.toggle = function(e) {
        self.content = e.item.content;
        self.currentIndex = e.item.index;
        self.update();
    }.bind(this);

});
riot.tag('table-view', '<yield> <table class="{ config.class }"> <tr show="{ showHeader }"> <th each="{ cols }" riot-style="{ style }" hide="{ hide }">{ alias || name }</th> </tr> <tr each="{ row in rows }" > <td each="{ colkey, colval in parent.cols }" class="{ newline: parent.parent.config.newline, cut: parent.parent.config.cut }" title="{ parent.row[colkey.name] }" hide="{ colkey.hide }"> { parent.parent.drawcell(parent.row, this, colkey) } </td> </tr> </table>', function(opts) {

    var self = this;
    var EL = self.root;
    self.config = self.opts.opts || self.opts;
    if (self.config.showHeader===false) {
        self.showHeader = false
    }
    else {
        self.showHeader = true;
    }

    self.cols = [];
    self.rows = [];

    self.on('mount', function() {
        self.rows = self.config.data;
        if (EL.children.length > 1) {
            for( i = 0; i < EL.children.length; i++){
                var child = EL.children[i];
                if(child.localName === 'rcol'){
                    var col_style = ''    
                    if(child.attributes['width'] != undefined) {
                        col_style='width: '+ child.attributes['width'].value;
                    }

                    var col = {
                        inner: child.innerHTML,
                        style: col_style,
                        index: i,
                        attrs: child.attributes,
                        hide: false
                    }

                    col.name = child.attributes['name'] ? child.attributes['name'].value : '';
                    if (child.attributes['alias']) {
                        col.alias = child.attributes['alias'].value || ''
                    }

                    self.cols.push(col);
                }

            }
        }
        else {

            for (i in self.rows[0]) {
                var col = {
                    name: i,
                    inner: '',
                    style: col_style,
                }
                self.cols.push(col);
            }
        }
        self.update()
    })

    self.compare = function(a, b) {
        if (a[self.orderkeyName] > b[self.orderkeyName]) {
            return 1;
        } 
        else if (a[self.orderkeyName] === b[self.orderkeyName]) {
            return 0;
        }
        else {
            return -1;
        }
    }

    self.clearOrder = function() {
        self.ordered = false;
        self.reversed = false;
    }


    EL.loadData = function(newrows){
        self.clearOrder();
        self.rows = newrows
        self.update()
    }

    EL.appendData = function(newrows){
        self.clearOrder();
        self.rows.push(newrows)
        self.update()
    }

    EL.clearData = function(newrows){
        self.clearOrder();
        self.rows = [];
        self.update()
    }

    EL.orderData = function(keyName){
        self.orderkeyName = keyName;
        if (self.ordered !== keyName) {
            if (self.reversed !== keyName) {
                self.rows = self.rows.sort(self.compare)
            }
            else {
                self.rows = self.rows.reverse();
            }
        }
        else {
            return
        }
        self.ordered = keyName;
        self.reversed = false;
        self.update()
    }

    EL.reverseData = function(keyName){
        self.orderkeyName = keyName;
        if (self.reversed !== keyName) {
            if (self.ordered !== keyName) {
                self.rows = self.rows.sort(self.compare)
            }
            self.rows = self.rows.reverse();
        }
        else {
            return
        }
        self.ordered = false;
        self.reversed = keyName;
        self.update()
    }

    EL.deleteData = function(keyName, value){
        self.clearOrder();
        var keyName = keyName || 'id';
        for (i = 0; i < self.rows.length; i++) {
            if (self.rows[i][keyName] === value) {
                self.rows.splice(i, 1);
                EL.deleteData(keyName, value);
            }
        }
        self.update();
        return EL;
    }

    EL.hide = function(keyName) {
        for(i = 0; i < self.cols.length; i++) {
            if (self.cols[i].name === keyName) {
                self.cols[i].hide = true
                break
            }
        }
        self.update();
    }

    EL.show = function(keyName) {
        for(i = 0; i < self.cols.length; i++) {
            if (self.cols[i].name === keyName) {
                self.cols[i].hide = false
                break
            }
        }
        self.update();
    }
    
    self.findNodes = function(node, tag) {
        for(var i = 0;i < node.attributes.length; i++){
            var attrName = node.attributes[i]['name'];
            var attrValue = node.attributes[i]['value'];
            if (attrName === 'if' || attrName === 'show' || attrName === 'hide') {
                node.removeAttribute(attrName);
                var judgeValue = riot.util.tmpl(attrValue, tag);
                if (attrName == 'hide') judgeValue = !judgeValue;
                node.style.display = judgeValue ? '' : 'none';
            }
            if (attrName === 'each') {
                node.removeAttribute(attrName);
                var arr = riot.util.tmpl(attrValue, tag);
                var root = node.parentNode;
                if (arr && utils.isArray(arr)) {
                    var placeholder = document.createComment('riot placeholder');
                    var frag = document.createDocumentFragment();

                    root.insertBefore(placeholder, node);
                    for (i = 0; i < arr.length; i++) {
                        var tmp = document.createElement('tmp');
                        tmp.innerHTML = riot.util.tmpl(node.outerHTML, arr[i]);
                        frag.appendChild(tmp.firstChild);
                    }

                    root.removeChild(node);
                    root.insertBefore(frag, placeholder);
                }
                
            } 
        }
        if (node.hasChildNodes()) {
            var children = node.children;
            for (var i = 0; i < children.length; i++) {  
                var child = children.item(i);
                self.findNodes(child, tag);  
            }  
        }
        
    }

    this.drawcell = function(rowdata, td, col) {
        if (col.attrs.length) {
            for (i in col.attrs) {
                if (typeof col.attrs[i] !== 'function') {
                    if (col.attrs[i]['name'] && col.attrs[i]['name']!=='class') {
                        td.root.setAttribute(col.attrs[i]['name'], col.attrs[i]['value']);
                    }
                    else if (col.attrs[i]['name'] && col.attrs[i]['name']=='class') {
                        utils.addClass(td.root, col.attrs[i]['value']);
                    }
                }
            }
        } //将rcol的属性挪到td上，class需特殊处理，name和alias不动
        
        if(col.inner){
            var str = col.inner.replace(/&lt;%=/g, '{')
                               .replace(/%&gt;/g, '}')
                               .replace(/%>/g, '}')
                               .replace(/<%=/g, '{');
            for (i in iToolkit.tableExtend) {
                if (typeof iToolkit.tableExtend[i] === 'function') {
                    rowdata[i] = iToolkit.tableExtend[i].bind(rowdata);
                }
                else {
                    rowdata[i] = iToolkit.tableExtend[i]
                }
            }

            for (i in rowdata) {
                td[i] = rowdata[i];
            }
            
            td.root.innerHTML = str;
            self.findNodes(td.root, td);
            td.root.innerHTML = riot.util.tmpl(td.root.innerHTML, rowdata)
        }
        else{
            return rowdata[col.name];
        }
    }.bind(this);


});
riot.tag('tree', '<div class="tree-item-wrap" each="{ data }" onselectstart="return false" ondragstart="return false"> <input type="checkbox" onchange="{ parent.checkHandle }" if="{ parent.rootConfig.showCheck }"> <i class="{ tree-item-arrow: true, open: opened, empty: !children }" onclick="{ parent.toggle }"></i> <div onclick="{ parent.leftClick }" style="display: inline;"> <i class="tree-item-icon" if="{ !parent.children }"></i> <i class="tree-item-icon" if="{ parent.children }"></i> <div class="{ tree-item-name : true }" title="{ name }">{ name }</div>  </div> <ul class="tree-child-wrap" if="{ children }"> <tree data="{ children }" if="{ children }"></tree> </ul> </div>', function(opts) {

    var self = this;
    self.config = self.opts.opts || self.opts;

    
    self.dataHandle = function(data, idName, pidName) {
        var data = data || []
        var id = idName || 'id';
        var pid = pidName || 'pid';

        var dataMap = {};
        data.forEach(function(node) {
            if (self.config.name) {
                node.name = node[self.config.name];
            }
            dataMap[node[id]] = node;
        });

        var tree = [];
        data.forEach(function(node) {
            var parent = dataMap[node[pid]];
            if (parent) {
                if (!parent.children) {
                    parent.children = [];
                }
                parent.children.push(node);
            }
            else {
                tree.push(node);
            }
        });
        return tree;
    };
    
    
    if (self.config.handleData) {
        var tree = self.dataHandle(self.config.data);
        self.data = tree;
    }
    else {
        self.data = self.config.data;
    }

    
    if (self.config.root) {
        self.rootConfig = self.config;
    }
    else {
        self.rootConfig = self.parent.rootConfig || self.parent.parent.rootConfig;
    }
    
    
    this.leftClick = function(e) {
        if (self.rootConfig.folder && e.item.children) {
            if (e.item.opened === true) {
                e.item.opened = false;
            }
            else {
                e.item.opened = true;
            }
        }
        else {
            var leftClick = self.rootConfig.onLeftClick;
            if (leftClick) {
                leftClick(e.item, e.target);
            }
        }
    }.bind(this);

    
    this.checkHandle = function(e) {
        var checkItem = self.rootConfig.onCheck;
        var uncheckItem = self.rootConfig.onUnCheck;
        if (checkItem && e.target.checked) {
            checkItem(e.item, e.target);
        }
        if (uncheckItem && !e.target.checked) {
            uncheckItem(e.item, e.target);
        }
    }.bind(this);



    
    
    this.toggle = function(e) {
        if (e.item.opened === true) {
            e.item.opened = false;
        }
        else {
            e.item.opened = true;
        }
    }.bind(this);

});