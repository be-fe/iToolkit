riot.tag('itk-calendar', '<div class="itk-calendar-wrapper"> <div class="itk-calendar-head"> <div class="itk-calendar-month-prev btn" onclick="{ prevMonth }">⟨</div> <div class="itk-calendar-year-prev btn" onclick="{ prevYear }">⟪</div> <div class="itk-calendar-month">{ month.text }</div> <div class="itk-calendar-year">{ year.text }</div> <div class="itk-calendar-year-next btn" onclick="{ nextMonth }">⟩</div> <div class="itk-calendar-month-next btn" onclick="{ nextYear }">⟫</div> </div> <div class="itk-calendar-body"> <div class="itk-calendar-weeks"> <div class="itk-calendar-week" each="{ text in weekArr }">{ text }</div> </div> <div class="itk-calendar-days"> <div each="{ dayArr }" class="itk-calendar-day { selected: parent.showSelected && parent.selectedYear === year && parent.selectedMonth === month && parent.selectedDay === day } { today: parent.showToday && parent.toYear === year && parent.toMonth === month && parent.today === day } { cursor: year && month && day }" data-year="{ year }" data-month="{ month }" data-day="{ day }" onclick="{ (year && month) ? dayClicked : \'return false;\' }" >{ day }</div> </div> </div> </div>', 'hide="{ !open }"', function(opts) {



    var self = this;

    self.i18n = {
        zh_cn: {
            weekArr: ['日','一','二','三','四','五','六'],
            monthArr: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
        },
        en_us: {
            weekArr: ['Su','Mo','Tu','We','Th','Fr','Sa'],
            monthArr: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        }
    };



    var el = self.root;

    var config = self.opts.opts || self.opts || {};

    
    self.mapping = function (opts) {
        if (!utils.isObject(opts)) {
            throw new TypeError('Config is not a object!');
            return;
        }
        for (var i in opts) {
            self[i] = opts[i];
        }
    };

    self.mapping(config);

    
    self.initWeekList = function (language) {
        var list = self.i18n[language];
        if (list) {
            self.weekArr = list.weekArr;
            self.monthArr = list.monthArr;
        }
        else {
            if (!self.weekArr || !self.monthArr) {
                var list = self.i18n.en_us;
                self.weekArr = list.weekArr;
                self.monthArr = list.monthArr;
            }
        }
    };

    self.initWeekList(self.language);

    self.getDaysCount = function (year, month) {
        var ret = 0;
        switch (month) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
            case 0:
            case 13:
                ret = 31;
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                ret = 30;
                break;
            case 2:
                ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? ret = 29 : ret = 28;
                break;
            default:
                throw new Error('你算错了');
                break;
        }
        return ret;
    };

    self.drawDays = function (timeStamp) {
        var date;
        if (timeStamp) {
            date = new Date(timeStamp);
        }
        else {
            date = new Date();
        }
        var thisMonth = date.getMonth();
        var thisYear = date.getFullYear();

        self.month = {
            text: self.monthArr[thisMonth],
            val: thisMonth + 1
        };

        self.year = {
            text: thisYear,
            val: thisYear
        };

        thisMonth = thisMonth + 1;

        var thisMonthDays = self.getDaysCount(thisYear, thisMonth);
        var prevMonthDays = self.getDaysCount(thisYear, thisMonth - 1);
        var nextMonthDays = self.getDaysCount(thisYear, thisMonth + 1);
        date.setDate(1);
        var firstDay = date.getDay();
        date.setDate(thisMonthDays);
        var lastDay = date.getDay();
        var dayArr = [];
        dayArr = dayArr
            .concat((new Array(firstDay === 0 ? 1 : ((7 - firstDay) ^ 7) + 1).join(0).split('')).map(function (v, i) {
                return {
                    year: '',
                    month: '',
                    day: prevMonthDays - i
                }
            }).reverse());
        dayArr = dayArr.concat((new Array(thisMonthDays + 1).join(0).split('')).map(function (v, i){
                return {
                    year: thisYear,
                    month: thisMonth,
                    day: i + 1
                }
            }));
        dayArr = dayArr.concat((new Array(lastDay === 0 ? 7 : (6 - lastDay) + 1).join(0).split('')).map(function (v, i){
                return {
                    year: '',
                    month: '',
                    day: i + 1
                }
            }));
        return dayArr;
    };

    self.initDays = function (timeStamp) {
        if (self.showToday) {
            var tmp_date = new Date();
            self.today = tmp_date.getDate();
            self.toMonth = tmp_date.getMonth() + 1;
            self.toYear = tmp_date.getFullYear();
        }

        if (self.defaultSelected) {
            var tmp_date = new Date();
            self.selectedDay = tmp_date.getDate();
            self.selectedMonth = tmp_date.getMonth() + 1;
            self.selectedYear = tmp_date.getFullYear();
        }

        
        self.dayArr = self.drawDays(timeStamp);
        self.update();
    };

    self.initDays(self.initTime);

    self.getNum = function (v) {
        return v > 10 ? v : '0' + v;
    }

    self.formatter = function (type) {
        var date = new Date(self.selectedYear, self.selectedMonth - 1, self.selectedDay, 0, 0, 0);
        var timeStamp = date.getTime();
        var ret;
        switch (type) {
            case 'unixTimeStamp':
                ret = self.getUnixTimeStamp(timeStamp);
                break;
            case 'timeStamp':
                ret = self.getTimeStamp(timeStamp);
                break;
            default:
                if (!type) {
                    var type = 'yyyy/mm/dd';
                }
                ret = type.replace(/(yyyy|mm|dd|yy|m|d)/ig, function (v) {
                    if (v === 'yyyy') {
                        return self.selectedYear;
                    }
                    if (v === 'mm') {
                        return self.getNum(self.selectedMonth);
                    }
                    if (v === 'dd') {
                        return self.getNum(self.selectedDay);
                    }
                    if (v === 'yy') {
                        return self.selectedYear.toString().substr(2, 4);
                    }
                    if (v === 'm') {
                        return self.selectedMonth;
                    }
                    if (v === 'd') {
                        return self.selectedDay;
                    }
                });
                break;
        }
        return ret;
    };

    
    self.dayClicked = function (e) {
        self.selectedDay = e.item.day;
        self.selectedMonth = e.item.month;
        self.selectedYear = e.item.year;
        self.onSelect && self.onSelect(self.formatter, self.getYear(), self.getMonth(), self.getDay());
        self.update();
    };

    self.open = false;

    self.getAbsPoint = function (elm) {
        var x = elm.offsetLeft;
        var y = elm.offsetTop;
        while (elm = elm.offsetParent) {
            x += elm.offsetLeft;
            y += elm.offsetTop;
        }
        return {
            'x': x,
            'y': y
        };
    };

    self.location = function (e) {
        if (self.element) {
            var pos = self.getAbsPoint(self.element);
            self.root.style.position = 'absolute';
            self.root.style.top = pos.y + self.element.offsetHeight;
            self.root.style.left = pos.x;
        }
    };

    self.closeIt = function (e) {
        var className = e.target.className;
        if (
            e.target === self.element ||
            className &&
            className.indexOf('itk-calendar') !== -1 &&
            className !== 'itk-calendar-days'
        ) {
            return;
        }
        self.open = false;
        self.update();
    };

    self.openIt = function (e) {
        self.open = true;
        self.update();
        self.location(e);
    };

    
    self.unbindEvent = function () {
        if (self.element) {
            document.removeEventListener('click', self.closeIt, false);
            self.element.removeEventListener('click', self.openIt, false);
        }
    };

    self.on('mount', function () {
        if (self.element) {
            document.addEventListener('click', self.closeIt, false);
            self.element.addEventListener('click', self.openIt, false);
        }
        else {
            self.open = true;
        }
        self.update();
    });

    self.on('unmount', function () {
        self.unbindEvent();
    });

    
    self.getTimeStamp = function (timeStamp) {
        return timeStamp;
    };

    
    self.getUnixTimeStamp = function (timeStamp) {
        return Math.ceil(timeStamp / 1000).toString();
    };

    
    self.getYear = function () {
        return self.selectedYear;
    };

    
    self.getMonth = function () {
        return self.selectedMonth;
    };

    
    self.getDay = function () {
        return self.selectedDay;
    };

    self.nextYear = function () {
        var year = self.year.val + 1;
        self.dayArr = self.drawDays(new Date(year, self.month.val - 1, 1).getTime());
        self.update();
    };

    self.nextMonth = function () {
        var month = self.month.val - 1;
        var year = self.year.val;
        year = month === 11 ? year + 1 : year;
        month = month === 11 ? 0 : month + 1;
        var date = new Date(year, month, 1);
        self.dayArr = self.drawDays(date.getTime());
        self.update();
    };

    self.prevYear = function () {
        var year = self.year.val - 1;
        self.dayArr = self.drawDays(new Date(year, self.month.val - 1, 1).getTime());
        self.update();
    };

    self.prevMonth = function () {
        var month = self.month.val - 1;
        var year = self.year.val;
        year = month === 0 ? year - 1 : year;
        month = month === 0 ? 11 : month - 1;
        var date = new Date(year, month, 1);
        self.dayArr = self.drawDays(date.getTime());
        self.update();
    };
    
});
riot.tag('itk-center', '<div class="itk-loading {default: default}" > <yield> </div>', function(opts) {
        var self = this;
        var config = self.opts.opts || self.opts;
        self.default = false;
        
        self.on('mount', function() {
            var parentDom = self.root.parentNode;
            var parentPosition = window.getComputedStyle(parentDom, null).position;
            if (parentPosition === 'static') {
                parentDom.style.position = 'relative';
            }

            self.childDom = self.root.getElementsByClassName('itk-loading')[0];

            if (self.childDom.innerHTML.trim()) {
                self.default = false;
                self.update();
            }

            var cellHeight = parseInt(window.getComputedStyle(self.childDom, null).height.replace('px', ''), 10);
            self.root.style.marginTop = '-' + cellHeight/2 + 'px';
            
        });

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
            if (/itoolkit.min.js|itoolkit.js/.test(js[i].src)) {
                jsPath = js[i].src.replace(/itoolkit.min.js|itoolkit.js/, '');
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

riot.tag('itk-div', '<yield>', function(opts) {
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
riot.tag('itk-editor', '<textarea rows="10" cols="80" style="display:none;"></textarea>', function(opts) {
        var self = this;
        var EL = self.root;
        var config = self.opts.opts || self.opts;
        var js = document.scripts;
        var path = '';
        var jsPath = '';
        var type = config.type || 'standard';
        var filebrowserImageUploadUrl = config.filebrowserImageUploadUrl;

        if (config.initContent) {
            var initContent = config.initContent;
        }

        var initEditor;
        if (config.initEditor) {
            initEditor = config.initEditor;
        }

        var editorConfig = config.editorConfig;

        var topConfig = {};

        topConfig.image_previewText = '';
        topConfig.filebrowserImageUploadUrl = filebrowserImageUploadUrl;


        for (x in editorConfig) {

            if (x != 'image_previewText' && x != 'filebrowserImageUploadUrl' && x != 'initContent' && x != 'initEditor') {
                topConfig[x] = editorConfig[x];
            }
        }

        if (!config.path) {
            for (var i = 0; i < js.length; i++) {
                if (!js[i].src) {
                    continue;
                }
                if (/itoolkit.min.js|itoolkit.js/.test(js[i].src)) {
                    jsPath = js[i].src.replace(/itoolkit.min.js|itoolkit.js/, '');
                    break;
                }
            }
            path = jsPath + 'plugins/ckeditor/';
        }
        else {
            path = config.path;
        }

        self.on('mount', function () {

            var textarea = EL.getElementsByTagName('textarea')[0];

            var id = EL.getAttribute('id');

            textarea.setAttribute('id', EL.getAttribute('id'));
            EL.removeAttribute('id');

            utils.jsLoader([
                path + type + '/ckeditor.js'
            ], function () {

                var editor = CKEDITOR.replace(id, topConfig);

                self.update();

                if (initContent) {
                    editor.setData(initContent);
                }

                if (initEditor) {
                    (function (editor) {
                        initEditor(editor);
                    })(editor);
                }


            });
        })


    
});
riot.tag('itk-form', '<form onsubmit="{ submit }" > <yield> </form>', function(opts) {
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

    var checkList = [
        'allowEmpty',
        'allowempty',
        'max',
        'min',
        'valid',
        'vr'
    ];

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
    self.successTips = config.successTipsText || '通过';
    self.regexpWarning = '字段不符合验证规则';
    self.numWarning = '数字格式错误';

    self.passClass = config.passClass || 'valid-pass';
    self.failedClass = config.failedClass || 'valid-failed';

    
    self.comparator = function (type) {
        return {
            handler: function (validation, attrs) {
                switch (type) {
                    case 'number':
                        return self.numComparator(validation, attrs);
                    case 'string':
                    default:
                        return self.strCompatator(validation, attrs);
                }
            }
        };
    };

    
    self.strCompatator = function(validation, attrs) {
        var min = parseInt(attrs.min, 10);
        var max = parseInt(attrs.max, 10);
        var nMin = isNaN(min);
        var nMax = isNaN(max);
        var len = attrs.value.length;
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
    };

    
    self.numComparator = function(validation, attrs) {
        var min = parseInt(attrs.min, 10);
        var max = parseInt(attrs.max, 10);
        var nMin = isNaN(min);
        var nMax = isNaN(max);
        var value = +attrs.value;
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
    };

    self.one('mount', function() {
        EL.style.display = 'block';
        if (config.realTime && config.valid) {
            var elems = self.root.getElementsByTagName('form')[0].elements;
            for (var i = 0, len = elems.length; i < len; i ++) {
                var type = elems[i].type;
                if (type !== 'submit' || type !== 'button') {
                    elems[i].addEventListener('input', valueOnChange, false);
                    elems[i].addEventListener('change', valueOnChange, false);
                }
            }
        }
    });

    
    function valueOnChange(e) {
        doCheck([], this);
    }

    function isType(obj) {
        return Object.prototype.toString.call(obj).match(/\ (.*)\]/)[1];
    }

    function dif(obj) {
        var constructor = isType(obj);
        if (constructor === 'Null'
            || constructor === 'Undefined'
            || constructor === 'Function'
        ) {
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
                var value;
                if (elems[i].tagName === "SELECT") {
                    var options = elems[i].options;
                    for (var j = 0; j < options.length; j++) {
                        if (options[j].selected) {
                           value = options[j].value;
                           self.checkExistKey(params, elems[i].name, encodeURIComponent(value));
                        }
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
    
    
    
    self.removeTipNode = function(dom) {
        var tip = dom.nextElementSibling;
        if (tip && tip.className.match(/tip-container/)) {
            dom.parentNode.removeChild(tip);
        }
    };
    self.removeTip = EL.removeTip = function(dom){
        self.removeTipNode(dom);
        utils.removeClass(dom, self.passClass);
        utils.removeClass(dom, self.failedClass);
    };

    self.insertTip = EL.insertTip = function(dom, message, className){
        self.removeTipNode(dom);
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
                var value;
                if (elems[i].tagName === "SELECT") {
                    var options = elems[i].options;
                    for (var j = 0; j < options.length; j++) {
                        if (options[j].selected) {
                           value = options[j].value;
                           params += elems[i].name + "=" + encodeURIComponent(value) + "&";
                        }
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
                var submitbtn = elems[i];
                var attr = submitbtn.tagName === 'BUTTON'
                         ? 'innerHTML'
                         : 'value';
                var submitingText = submitbtn[attr];
                submitbtn.disabled = 'disabled';
                submitbtn[attr] = self.submitingText;
            }
        }
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(params);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4) {
                self.removeTips();
                submitbtn[attr] = submitingText;
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
        console.log(validArr);
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

    function getCheckParam(elem) {
        var elem = elem;
        var attributes = elem.attributes;
        var ret = {};
        for (var i = 0; i < attributes.length; i++) {
            var attr = attributes[i];
            ret[attr.name] = attr.value;
        }
        ret.value = elem.value;
        return ret;
    }

    function isNeedCheck(attrs) {
        for (var i = 0; i < checkList.length; i++) {
            if (attrs[checkList[i]]) {
                return true;
            }
        }
        return false;
    }

    
    self.Validation = function(validArr, name, dom) {
        this.msg = [];        
        this.validTip = function() {
            if (this.msg.length) {
                self.onValidRefuse(dom, this.msg[0]);
                validArr.push(name)
            }
            else {
                if (config.forbidTips) {
                    self.removeTip(dom);
                }
                else {
                    self.onValidPass(dom, self.successTips);
                }
            }
        }
    };

    
    self.rulesConfig = {
        email: {
            regexp: /^([a-zA-Z0-9_\-\.])+\@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
            msg: self.emailWarning
        },
        present: {
            regexp: /\S+/,
            msg: self.presentWarning
        },
        url: {
            regexp: /((http|ftp|https|file):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/,
            msg: self.urlWarning
        },
        mobile: {
            regexp:/^1[3|4|5|8][0-9]\d{4,8}$/,
            msg: self.mobileWarning
        }
    };

    self.valid = function(rule, validation, attrs) {
        if (self.rules[rule]) {
            var judgeResult = self.rules[rule](attrs);
            if (judgeResult === true) {
                self.comparator('string').handler(validation, attrs);
            }
            else {
                validation.msg.push(judgeResult);
            }
            return validation;
        }
    };


    self.validNumRange = function(validation, attrs) {
        var reg = NUMBER_REGEXP[attrs.valid.toUpperCase()];
        if (!reg.test(attrs.value)) {
            validation.msg.push(self.numWarning);
        }
        else {
            self.comparator('number').handler(validation, attrs);
        }
        return validation;
    };

    self.validUnion = function (validation, validArr, elem, attrs) {
        if (attrs.vr) {
            var arr = attrs.vr.split('::');
            var method = arr[0];
            var params = arr[1] ? arr[1].split(',') : undefined;
            var flag = false;
            try {
                flag = iToolkit[method].apply(elem, params);
            }
            catch (e) {
                flag = false;
                throw e;
            }
            if (!flag) {
                validation.msg.push('');
            }
        }
        return validation;
    };

    self.validEmpty = function (validation, attrs) {
        if (attrs.value === '') {
            validation.msg.push(self.presentWarning);
        }
        return validation;
    };

    
    self.on('mount', function() {
        self.init();
    });

    self.init = function() {
        for (i in config) {
            if (keyWords.indexOf(i) < 0) {
                if (self.hasOwnProperty(i)) {
                    self[i] = utils.deepCopy(config[i], self[i]);
                }
                else {
                    self[i] = config[i];
                }
            }
        }
        self.data = config.data;
        self.rules = {};

        for (ruleConfig in self.rulesConfig) {
            if (utils.isObject(self.rulesConfig[ruleConfig])) {
                (function(ruleConfig) {
                    self.rules[ruleConfig] = function(attrs) {
                        if (attrs.value.match(self.rulesConfig[ruleConfig].regexp)) {
                            return true;
                        }
                        else {
                            return self.rulesConfig[ruleConfig].msg;
                        }
                    }
                })(ruleConfig);
            }
            else if (utils.isFunction(self.rulesConfig[ruleConfig])) {
                self.rules[ruleConfig] = self.rulesConfig[ruleConfig];
            }
        }
    };
    

    
    function doCheck(validArr, elem) {
        var dom = elem;
        var attrs = getCheckParam(elem);
        if (!isNeedCheck(attrs)) {
            return;
        }
        var validation = new self.Validation(validArr, attrs.name, dom);
        if (attrs.name) {
            if ((attrs.allowEmpty || attrs.allowempty) && attrs.value === '') {
                self.onValidPass(dom, self.successTips);
                return;
            }
            self.validEmpty(validation, attrs);
            if (attrs.valid) {
                if (self.rules[attrs.valid]) {
                    self.valid(attrs.valid, validation, attrs);
                }
                else if (NUMBER_REGEXP[attrs.valid.toUpperCase()]) {
                    self.validNumRange(validation, attrs);
                }
            }
            else if (!attrs.valid) {
                if (attrs.min || attrs.max){
                    self.comparator('string').handler(validation, attrs);
                }
            }
        }
        if (!validArr.length) {
            self.validUnion(validation, validArr, dom, attrs);
        }
        validation.validTip();
    }
    
});
riot.tag('itk-modal', '<div class="itk-modal-dialog" riot-style="width:{width}; height:{height}"> <div class="itk-modal-title"> <span>{ title }</span> <div class="itk-modal-close-wrap" onclick="{ close }"> <div class="itk-modal-close"></div> </div> </div> <div class="itk-modal-container"> <yield> </div> </div>', function(opts) {

    var self = this;
    var config = self.opts.opts || self.opts;
    var EL = self.root;
    for (i in config) {
        self[i] = config[i];
    }
    self.width = config.width || 600;
    self.height = config.height || 'auto';

    self.on('mount', function() {
        var container = self.root.querySelector('.itk-modal-container');
        var head = self.root.querySelector('.itk-modal-title');
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
riot.tag('itk-paginate', '<div onselectstart="return false" ondragstart="return false"> <div class="itk-paginate"> <li onclick="{ goFirst }">«</li> <li onclick="{ goPrev }">‹</li> </div> <ul class="itk-paginate"> <li each="{ pages }" onclick="{ parent.changePage }" class="{ active: parent.currentPage == page }">{ page }</li> </ul> <div class="itk-paginate"> <li onclick="{ goNext }">›</li> <li onclick="{ goLast }">»</li> </div> <div class="itk-paginate"> <form onsubmit="{ redirect }" style="position:relative;"> <span class="redirect" if="{ redirect }">跳转到<input class="jumpPage" name="page" riot-type={"number"} style="width: 40px;">页 </span> <div class="itk-paginate-tips" riot-style="top: { tipsTop }; left: { tipsLeft }; display: { showTip }"> 请输入1～{ pageCount }之间的数字 </div> <span class="page-sum" if="{ showPageCount }"> 共<em>{ pageCount }</em>页 </span> <span class="item-sum" if="{ showItemCount }"> <em>{ count }</em>条 </span> <input type="submit" style="display: none;"> </form> </div> </div>', function(opts) {
        var self = this;
        var EL = self.root;
        var config = self.opts.opts || self.opts;
        self.showTip = 'none';
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

        self.updateCurrentPage = function () {
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

            if (

                self.needInit

                || (self.pageCount < oldPageCount && self.currentPage <= self.pageCount)
            ) {
                config.callback(self.currentPage);
            }

            self.pageChange(self.currentPage)
            self.update();
        };

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

        if (self.needInit) {
            config.callback(self.currentPage);
        }
        self.updateCurrentPage();
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
            var index = parseInt(self.page.value, 10);
            if (
                index &&
                index < (self.pageCount + 1) &&
                index > 0
            ) {
                self.pageChange(parseInt(index, 10));
            }
            else {
                self.tipsLeft = self.page.offsetLeft;
                self.tipsTop = self.page.offsetTop + self.page.offsetHeight + 8;
                self.showTip = 'block';
                setTimeout(function () {
                    self.showTip = 'none';
                    self.update();
                }, 1500)
                self.update();
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
            self.updateCurrentPage();
        };

    
});
riot.tag('itk-select', '<yield></yield> <ul class="itk-selected-container" onmousedown="{ showOptions }"> <li class="itk-selected-option" each="{realData }" if="{ selected && parent.mutiple}"> { name } <span class="itk-close" onmousedown="{ cancel }" >×</span> </li> <li class="itk-single-option" each="{ realData }" if="{ selected && !parent.mutiple}"> { name } </li> <li class="itk-search-wrap"> <input type="text" class="form-control itk-select-search" oninput="{ filter }" onfocus="{ filter }" onkeyup="{ keyboardHandle }"> </li> </ul> <ul class="itk-options-container"> <li class="itk-options" each="{ realData }" onmousedown="{ toggle }" if="{ !hide }"> <span class="itk-option-check" if="{ selected }"></span> <span class="empty-icon" if="{ !selected }"></span> { name } </li> <li class="no-result" if="{ noResult }">无搜索结果</li> </ul>', function(opts) {
        var self = this;
        var config = self.opts.opts || self.opts;
        self.gotOptions = false;
        self.chooseOnce = true;

        self.init = self.root.init = function() {
            self.gotOptions = false;
            self.update();
        };

        
        self.realData = [];
        self.root.exportData = self.realData;

        self.initData = self.root.initData = function() {
            if (self.root.querySelector('select')) {
                var options = self.root.querySelector('select').querySelectorAll('option');
                var mutiple = self.root.querySelector('select').hasAttribute('mutiple');
                if (mutiple) {
                    self.mutiple = true;
                }
                else {
                    self.mutiple = false;
                    self.noSearch = true;
                }
            }
            if (options && options.length && !self.gotOptions) {
                self.options = options;
                self.searchInput = self.root.querySelector('.itk-select-search');
                self.optionsWrap = self.root.querySelector('.itk-options-container');
                self.realData = [];
                for (i = 0; i < options.length; i++) {
                    self.realData.push({
                        name: options[i].innerHTML,
                        value: options[i].getAttribute('value'),
                        selected: options[i].getAttribute('selected'),
                        index: i
                    });
                }
                self.searchInput.onfocus = function () {
                    self.optionsWrap.style.display = 'block';
                };

                self.searchInput.onblur = function () {
                    self.optionsWrap.style.display = 'none';
                    self.searchInput.value = '';
                    self.resetSelectOpt();
                };

                if (self.noSearch) {
                    self.searchInput.style.width = '0px';
                }
                self.gotOptions = true;
                self.update();
            }
        };


        self.on('update', function() { 
            setTimeout(function() {
                self.initData();
            }, 0)
            
        });



        self.on('mount', function() {
            if (config) {
                for (var i in config) {
                    self[i] = config[i];
                }
                self.update();
            }
        });

        self.filter = function(e) {
            self.resetSelectOpt();
            var v = e.target.value;
            e.target.style.width = (0.9 * v.length + 1) + 'em';
            var match;
            for (i = 0; i < self.realData.length; i++) {
                if (!self.realData[i].name.match(v)) {
                    self.realData[i].hide = true;
                }
                else {
                    self.realData[i].hide = false;
                    match = true;
                }
            }
            self.noResult = !match;
        };

        self.toggle = function(e) {
            if (self.mutiple) {
                if (e.item.selected) {
                    e.item.selected = false;
                    self.options[e.item.index].selected = false;
                }
                else {
                    e.item.selected = true;
                    self.options[e.item.index].selected = true;
                }
            }
            else {
                for (i = 0; i < self.realData.length; i++) {
                    self.realData[i].selected = false;
                    self.options[i].selected = false;
                }
                e.item.selected = true;
                self.options[e.item.index].selected = true;
            }
            self.update();
            if (self.chooseOnce) {
                self.searchInput.blur();
            }
        };

        self.cancel = function(e) {
            e.stopPropagation();
            e.item.selected = false;
            self.options[e.item.index].selected = false;
            self.update();
        };

        self.showOptions = function(e) {
            if (self.searchInput && self.searchInput !== document.activeElement) {
                self.searchInput.focus();
            }
            else {
                self.searchInput.blur();
            }
        };

        
        self.keyboardHandle = function(e) {
            var searchInput = e.target;
            searchInput.options = self.root.querySelectorAll('.itk-options');
            if (searchInput.seletedIndex === undefined ){
                searchInput.seletedIndex = -1;
            }

            var keyCode = e.keyCode;
            if (keyCode === 37 || keyCode === 38){
                self.clearSelectedOpt(searchInput);
                searchInput.seletedIndex--;
                if (searchInput.seletedIndex < 0){
                    searchInput.seletedIndex = searchInput.options.length - 1;
                }
                self.setSelectedOpt(searchInput);
            }
            else if (keyCode === 39 || keyCode === 40){
                self.clearSelectedOpt(searchInput);
                searchInput.seletedIndex++;
                if (searchInput.seletedIndex >= searchInput.options.length){
                    searchInput.seletedIndex = 0;
                }
                self.setSelectedOpt(searchInput);
            }
            else if (keyCode === 13){
                self.chooseByKeyboard(searchInput);
            }
            else if (keyCode === 27){
                self.searchInput.blur();
            }
        };

        self.chooseByKeyboard = function(target){
            var e = document.createEvent("MouseEvents");
            var dom = target.options[target.seletedIndex];
            e.initEvent("mousedown", true, true);
            if (dom) {
                dom.dispatchEvent(e);
            }
        };

        self.clearSelectedOpt = function(target){
            if (target.options) {
                var dom = target.options[target.seletedIndex];
                if (target.seletedIndex >= 0 && dom) {
                    dom.style.background = "";
                    dom.scrollIntoView();
                }
            }
        };

        self.resetSelectOpt = function() {
            self.clearSelectedOpt(self.searchInput);
            self.searchInput.seletedIndex = -1;
        };

        self.setSelectedOpt = function(target){
            var dom = target.options[target.seletedIndex];
            if (dom) {
                dom.style.background = "#eff3f8";
                dom.scrollIntoView();
            }
        };
    
});


riot.tag('itk-slide', ' <yield>', function(opts) {
            var self = this;
            var EL = self.root;
            var config = self.opts.opts || self.opts;
            var js = document.scripts;
            var path = '';
            var jsPath = '';


            for (var i = 0; i < js.length; i++) {
                if (!js[i].src) {
                    continue;
                }
                if (/itoolkit.min.js|itoolkit.js/.test(js[i].src)) {
                    jsPath = js[i].src.replace(/itoolkit.min.js|itoolkit.js/, '');
                    break;
                }
            }

            path = jsPath + 'plugins/';

            self.loadSource = function(path) {
                utils.jsLoader([
                    path + 'slick/slick.css',
                    path + 'slick/slick-theme.css',
                    path + 'slick/slick.js',
                ], function () {
                    $(EL).slick(config);
                    EL.style.visibility = 'visible';
                });
            }

            if (typeof jQuery == 'undefined') {
                utils.jsLoader([
                    path + 'jquery/jquery-1.12.0.min.js',
                ], function () {
                    self.loadSource(path);
                });
            } else {
                self.loadSource(path);
            }            
        
});
riot.tag('itk-table', '<yield>', function(opts) {
        var self = this;
        var config = self.opts.opts || self.opts;
        var EL = self.root;
        
        self.init = function() {
            EL.style.display = 'block';
            for (i in config) {
                if (!self[i]) {
                    self[i] = config[i];
                }
            }
            self.originData = utils.deepCopy(self.data);
            self.update();
        };


        self.on('mount', function() {
            self.init();
        });

        
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

        
        self.loadData = EL.loadData = function(data) {
            self.data = data;
            self.originData = utils.deepCopy(data);
            self.update();
            return self.data;
        };
        
        
        self.exportData = EL.exportData = function() {
            return self.data;
        }
        
        
        self.reset = EL.reset = function() {
            self.data = utils.deepCopy(self.originData);
            self.update();
        };

        
        self.orderBy = function(col) {
            return function() {
                self.orderkeyName = col;
                if (self.ordered !== col) {
                    if (self.reversed !== col) {
                        self.data = self.data.sort(self.compare)
                    }
                    else {
                        self.data = self.data.reverse();
                    }
                    self.ordered = col;
                    self.reversed = false;
                    self.update()
                }
                return self.data;
            }
        };

        EL.orderBy = function(col) {
            self.orderBy(col)();
        };

        
        self.reverseBy = function(col) {
            return function() {
                self.orderkeyName = col;
                if (self.reversed !== col) {
                    if (self.ordered !== col) {
                        self.data = self.data.sort(self.compare);
                        self.data = self.data.reverse();
                    }
                    else {
                        self.data = self.data.reverse();
                    }
                    self.ordered = false;
                    self.reversed = col;
                    self.update()
                }
                return self.data;
            }
        };
        
        EL.reverseBy = function(col) {
            self.reverseBy(col)();
        };
        
        self.toggleBy = function(col) {
            if (self.ordered === col) {
                return self.reverseBy(col);
            }
            else {
                return self.orderBy(col);
            }
        };

        EL.toggleBy = function(col) {
            if (self.ordered === col) {
                EL.reverseBy(col);
            }
            else {
                EL.orderBy(col);
            }
        };

        
        
        self.append = function(rows) {
            return function() {
                self.clearOrder();
                if (utils.isObject(rows)) {
                    self.data.push(rows);
                }
                else if (utils.isArray(rows)) {
                    self.data = self.data.concat(rows);
                }
                self.update();
            }
        };

        EL.append = function(rows) {
            self.append(rows)();
        };
        
        
        self.prepend = function(rows) {
            return function() {
                self.clearOrder();
                if (utils.isObject(rows)) {
                    self.data.unshift(rows);
                }
                else if (utils.isArray(rows)) {
                    self.data = rows.concat(self.data);
                }
                self.update();
            }
        };
        EL.prepend = function(rows) {
            self.prepend(rows)();
        };
        
        
        self.deleteBy = function(col, value) {
            return function() {
                if (col && value) {
                    self.clearOrder();
                    for (var i = 0 ; i < self.data.length; i++) {
                        if (self.data[i][col] === value) {
                            self.data.splice(i, 1);
                            i = i - 1;
                        }
                    }
                    self.update();
                }
            };
        }

        EL.deleteBy = function (col, value) {
            self.deleteBy(col, value)();
        }


    
});
riot.tag('itk-tree-item', '<input type="checkbox" __checked="{ item.selected }" if="{ parent.rootConfig.showCheck }" onchange="{ checkHandle }"> <i class="tree-item-{ iconType } { open: item.opened }" onclick="{ toggle }" if="{ item.children }"></i> <i class="tree-item-icon" if="{ item.children }"></i> <i class="tree-no-{ iconType }" if="{ !item.children }"></i> <div onclick="{ leftClick }">{ item.name }</div>', function(opts) {
    
    var self = this;
    self.iconType = self.parent.rootConfig.iconType || 'arrow';
    
    
    self.selectchildren = function(item, bool) {
        var selectChildItem = function(item) {
            if (item && item.children) {
                for(var i = 0; i < item.children.length; i++) {
                    item.children[i].selected = bool;
                    selectChildItem(item.children[i]);
                }
            }
        };
        selectChildItem(item, bool);
        self.parent.treeroot.update();
    };

    
    self.cancelParent = function(item) {
        var cancelParentSelect = function(item) {
            if (item && item.pnode) {
                item.pnode.selected = false;
                cancelParentSelect(item.pnode);
            }
        };
        cancelParentSelect(item);
        self.parent.treeroot.update();
    };

    
    this.checkHandle = function(e) {
        var config = self.parent.rootConfig
        var checkCb = config.onCheck;
        var uncheckCb = config.onUnCheck;
        if (self.item.selected) {
            self.item.selected = false;
            uncheckCb && uncheckCb(self.item, e.target);

            if (config.link) {
                self.selectchildren(self.item, false);
                self.cancelParent(self.item);
            }
        }
        else if (!self.item.selected) {
            self.item.selected = true;
            checkCb && checkCb(self.item, e.target);
            if (config.link) {
                self.selectchildren(self.item, true);
            }
        }
    }.bind(this);
    
    
    this.toggle = function(e) {
        if (self.item.opened === true) {
            self.item.opened = false;
        }
        else {
            self.item.opened = true;
        }
        self.parent.treeroot.update();
    }.bind(this);

    
    this.leftClick = function(e) {
        var config = self.parent.rootConfig;
        if (config.folder && config.children) {
            if (self.item.opened === true) {
                self.item.opened = false;
            }
            else {
                self.item.opened = true;
            }
        }
        else {
            var leftClick = config.onLeftClick;
            if (leftClick) {
                leftClick(self.item, e.target);
            }
        }
    }.bind(this);


});

riot.tag('itk-tree', '<div class="tree-item-wrap" each="{ item, i in data }" onselectstart="return false" ondragstart="return false"> <itk-tree-item class="tree-item-row { root: item.level==1 }" riot-style="padding-left: { countPadding(item.level) }"></itk-tree-item> <ul class="tree-child-wrap" if="{ item.opened && item.children }"> <itk-tree data="{ item.children }"></itk-tree> </ul> </div>', function(opts) {
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
                node.pnode = parent;
                parent.children.push(node);
            }
            else {
                tree.push(node);
            }
        });

        var countLevel = function(tree, level) {
            var level = level + 1;
            tree.forEach(function(item) {
                item.level = level - 1;

                if (item.level < (self.config.openLevel + 1)) {
                    item.opened = true;
                }
                if (item.children) {
                    countLevel(item.children, level);
                }
            })
        };
        countLevel(tree, 1);
        return tree;

    };
    
    
    if (!self.parent || self.parent.root.tagName !== 'ITK-TREE') {
        if (self.config.handleData) {
            var tree = self.dataHandle(self.config.data);
            self.data = tree;
        }
        self.rootConfig = self.config;
        self.treeroot = self;
    }
    else {
        self.data = self.config.data;
        self.rootConfig = self.parent.rootConfig || self.parent.parent.rootConfig;
        self.treeroot = self.parent.treeroot || self.parent.parent.treeroot;
    }
    self.treeroot.update();
    
    
    
    this.countPadding = function(level) {
        var padding = self.rootConfig.padding || 20;
        return (level - 1) * padding + 'px';
    }.bind(this);
    
    
});
riot.tag('itk-uploader', '<yield> <div class="btn btn-large btn-primary itk-uploader-btn" name="uploadBtn">上传</div>', function(opts) {

        var self = this;
        var EL = self.root;
        var config = self.opts.opts || self.opts;

        var js = document.scripts;
        var jsPath = '';
        for (var i = 0; i < js.length; i++) {
            if (!js[i].src) {
                continue;
            }
            if (/itoolkit.min.js|itoolkit.js/.test(js[i].src)) {
                jsPath = js[i].src.replace(/itoolkit.min.js|itoolkit.js/, '');
                break;
            }
        }
        path = jsPath + 'plugins/uploader/';
        var sourceArr = [
            path + 'SimpleAjaxUploader.min.js',
        ];

        
        self.on('mount', function() {
            var defaultBtn = EL.querySelector('.itk-uploader-btn');
            if (EL.firstElementChild === defaultBtn) {
                defaultBtn.style.display = 'inline-block';
            }
            else {
                defaultBtn = EL.firstElementChild;
            };

            utils.jsLoader(sourceArr, function () {

                var json = {};
                json.button = config.btn || defaultBtn;

                json.url = config.url;
                json.name = config.name ? config.name : "";
                json.multipart = config.multipart ? config.multipart : true;
                json.responseType = config.responseType ? config.responseType : "";
                json.startXHR = config.startXHR ? config.startXHR : null;
                json.onSubmit = config.onSubmit ? config.onSubmit : null;
                json.onComplete = config.onComplete ? config.onComplete : null;
                json.onError = config.onError ? config.onError : null;


                var uploader = new ss.SimpleUpload(json);
            });
        })
    
});
