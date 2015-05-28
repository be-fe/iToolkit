riot.tag('dropdown', '', function(opts) {

});
riot.tag('file-upload', '', function(opts) {


});
riot.tag('modal', '<div class="modal-dialog" riot-style="width:{width}px; height:{height}px"> <div class="modal-title"> <span>{ title }</span> <div class="modal-close-wrap" onclick="{ close }"> <div class="modal-close"></div> </div> </div> <div class="modal-container"> <yield> </div> </div>', function(opts) {

    var self = this;
    var config = self.opts.opts || self.opts;
    for (i in config) {
        self[i] = config[i];
    }
    self.width = config.width || 600;
    self.height = config.width || 300;

    this.close = function(e) {
        self.root.style.display = 'none';
    }.bind(this);
    document.querySelector("[modal-open-target='" + self.root.id + "']").onclick = function() {
        self.root.style.display = 'block';
    }




});
riot.tag('paginate', '<div class="paginate"> <li onclick="{ goFirst }">«</li> <li onclick="{ goPrev }">‹</li> </div> <ul class="paginate" if="{ pageCount > 1 }"> <li each="{ pages }" onclick="{ parent.changePage }" class="{ active: parent.currentPage == page }">{ page }</li> </ul> <div class="paginate"> <li onclick="{ goNext }">›</li> <li onclick="{ goLast }">»</li> </div>', function(opts) {
    
    var self = this;
    var config = self.opts.opts || self.opts;
    
    self.count = config.count || 0;
    self.pagesize = config.pagesize || 20;
    self.pageCount = config.pageCount || Math.ceil(self.count/self.pagesize) || 1;
    self.currentPage = config.currentPage || 1;
    self.url = config.url || '';
    self.showNumber = config.showNumber || 5;
    config.callback(self.currentPage);

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
        config.callback(1);
        self.currentPage = 1;
        self.pageChange(self.currentPage);
    }.bind(this);

    this.goPrev = function(e) {
        if (self.currentPage > 1) {
            config.callback(self.currentPage - 1);
            self.currentPage = self.currentPage - 1;
            self.pageChange(self.currentPage);
        }
    }.bind(this);

    this.goNext = function(e) {
        if (self.currentPage < self.pageCount) {
            config.callback(self.currentPage + 1);
            self.currentPage = self.currentPage + 1;
            self.pageChange(self.currentPage);
        }
    }.bind(this);
    
    this.goLast = function(e) {
        config.callback(self.pageCount);
        self.currentPage = self.pageCount;
        self.pageChange(self.currentPage);
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
    }

    this.changePage = function(e) {
        var page = e.item.page
        if (typeof(page) === 'string') {
            return false;
        }
        else {
            self.pageChange(page);
        }
    }.bind(this);



});
riot.tag('select-box', '', function(opts) {



});
riot.tag('side-list', '<ul > <li each="{ data }"> <img riot-src="{ logoUrl }" if="{ isLogo }"> <span>{ name }</span> </li> </ul>', function(opts) {

});
riot.tag('slide', '', function(opts) {


});
riot.tag('super-div', '<style scope> super-div{ display: block; } </style> <yield>', function(opts) {
    
    var self = this;
    var config = self.opts.opts || self.opts;
    var EL = self.root;

    for (i in config) {
        self[i] = config[i];
    }

    EL.loadData = function(newData, colName){
        colName = colName || 'data';
        self[colName] = newData
        self.update()
    }


});
riot.tag('super-form', '<form onsubmit="{ submit }" > <yield> </form>', function(opts) {

    var self = this;
    var EL = self.root;
    var config = self.opts.opts || self.opts;
    var keyWords = ['insertTip', 'ajaxSubmit', 'submit'];   //保留字，不被覆盖

    self.presentWarning = '必填';
    self.emailWarning = '邮箱格式错误';
    self.mobileWarning = '手机格式错误';
    self.urlWarning = '网址格式错误';
    self.successTips = '通过';
    self.regWarning = '字段不符合验证规则';

    EL.loadData = function(newData, colName){
        colName = colName || 'data';
        self[colName] = newData;
        self.update();
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

    self.removeTips = function() {
        var root = self.root;
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
    }
    
    self.insertTip = function(dom, message, className){
        var tip = dom.nextElementSibling;
        if (tip && tip.className.match(/tip-container/)) {
            dom.parentNode.removeChild(tip);
        }
        var tipContainer = document.createElement('span');
        tipContainer.className = className;
        tipContainer.innerHTML = message;
        utils.insertAfter(tipContainer, dom);
    }

    self.onValidRefuse = config.onValidRefuse || function(dom, errorTips) {
        self.insertTip(dom, errorTips, 'tip-container');
    }

    self.onValidPass = config.onValidPass || function(dom, successTips) {
        self.insertTip(dom, successTips, 'tip-container success');
    }

    self.ajaxSubmit = function(elems, url) {
        var params = '';
        for (var i = 0; i < elems.length; i++) {
            if (elems[i].name) {
                if (elems[i].tagName === "SELECT") {
                    value = elems[i].options[elems[i].selectedIndex].value;
                    params += elems[i].name + "=" + encodeURIComponent(value) + "&";
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
                var submitText = submitbtn.value || submitbtn.innerText;
                submitbtn.disabled = 'disabled';
                submitbtn.value = self.submitingText;
            }
        }
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(params);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4) { 
                if (xmlhttp.status === 200) {
                    try {
                        var result = JSON.parse(xmlhttp.responseText);
                        config.callback(result);
                    }catch(e){
                        console.log(e);
                    }
                }
                else {
                    config.errCallback(params);
                }
                self.removeTips();
                submitbtn.value = submitText;
                submitbtn.disabled = false;
            } 
        };
    }

    this.submit = function(e) {
        var validArr = [];
        var elems = self.root.getElementsByTagName('form')[0].elements;
        var url = self.root.getAttribute('action');

        if (config.valid) {
            for (var i = 0; i < elems.length; i++) {
                var valid = elems[i].getAttribute('valid');
                var max = elems[i].getAttribute('max');
                var min = elems[i].getAttribute('min');
                var v = elems[i].value; 
                var name = elems[i].name;
                var dom = elems[i];
                if (name && valid) {
                    if (valid === 'email') {
                        if (!v.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/)) {
                            validArr.push(name);
                            self.onValidRefuse(dom, self.emailWarning);
                        }
                        else {
                            self.onValidPass(dom, self.successTips); 
                        }
                    }
                    else if (valid === 'mobile') {
                        if (!v.match(/^1[3|4|5|8][0-9]\d{4,8}$/)) {
                            validArr.push(name);
                            self.onValidRefuse(dom, self.mobileWarning);
                        }
                        else {
                            self.onValidPass(dom, self.successTips); 
                        }
                    }
                    else if (valid === 'url') {
                        if (!v.match(/((http|ftp|https|file):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/)) {
                            validArr.push(name);
                            self.onValidRefuse(dom, self.urlWarning);
                        }
                        else {
                            self.onValidPass(dom, self.successTips); 
                        }
                    }
                    else if (valid === 'present') {
                        v = v.replace(' ', '');
                        if (!v.length) {
                            validArr.push(name);
                            self.onValidRefuse(dom, self.presentWarning);
                        }
                        else {
                            self.onValidPass(dom, self.successTips);
                        }
                    }
                    else if (valid.match(/^\/\S+\/$/)) {
                        valid = valid.replace(/^\//, '');
                        valid = valid.replace(/\/$/, '');
                        var reg = new RegExp(valid);
                        if (reg.test(v)) {
                            self.onValidPass(dom, self.successTips); 
                        }
                        else {
                            validArr.push(name);
                            self.onValidRefuse(dom, self.regWarning);
                        }
                    }
                }
                else if (name && max) {
                    var max = parseInt(max, 10);
                    if (v.length > max) {
                        validArr.push(name);
                        self.onValidRefuse(dom, self.maxWarning(max));
                    }
                    else {
                        self.onValidPass(dom, self.successTips);
                    }
                }
                else if (name && min) {
                    var min = parseInt(min, 10);
                    if (v.length < min) {
                        validArr.push(name);
                        self.onValidRefuse(dom, self.minWarning(min));
                    }
                    else {
                        self.onValidPass(dom, self.successTips);
                    }
                }
            }
        }
        
        if (!validArr.length) {
            e.preventDefault();
            if (config.normalSubmit) { 
                self.root.firstChild.setAttribute('action', self.root.getAttribute('action'));
                return true;
            }
            else {
                self.ajaxSubmit(elems, url);
            }
        }
        else {
            return false;
        }
    }.bind(this);


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
riot.tag('table-view', '<yield> <table class="{ config.class }"> <tr show="{ showHeader }"> <th each="{ cols }" riot-style="{ style }">{ alias || name }</th> </tr> <tr each="{ row in rows }" > <td each="{ colkey, colval in parent.cols }" class="{ newline: parent.parent.config.newline, cut: parent.parent.config.cut }" title="{ parent.row[colkey.name] }"> { parent.parent.drawcell(parent.row, this, colkey) } </td> </tr> </table>', function(opts) {

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
                        name: child.attributes['name'].value,
                        inner: child.innerHTML,
                        style: col_style,
                        index: i
                    }
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

    this.drawcell = function(rowdata, tr,  col) {
        if(col.inner){
            setTimeout(function() {
                var str = col.inner.replace(/&lt;%=[\s|\w]+%&gt;/g, function(v) {
                    var key = v.replace(/&lt;%=/g, '')
                               .replace(/\s/g, '')
                               .replace(/%&gt;/g, '');
                    return rowdata[key];
                });
                tr.root.children[col.index].innerHTML = str;
            }, 10);
        }
        else{
            return rowdata[col.name];
        }
    }.bind(this);


});
riot.tag('tree', '<div class="tree-item-wrap" each="{ data }"> <i class="{ tree-item-arrow: true, open: opened, empty: !children }" onclick="{ parent.toggle }"></i> <i class="tree-item-icon"></i> <div onclick="{ parent.leftClick }" class="{ tree-item-name : true }" title="{ name }">{ name }</div>  <ul class="tree-child-wrap" if="{ children }"> <tree data="{ children }" if="{ children }"></tree> </ul> </div>', function(opts) {

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
        self.data = self.dataHandle(self.config.data);
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
        var leftClick = self.rootConfig.onLeftClick;
        if (leftClick) {
            leftClick(e.item, e.target);
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