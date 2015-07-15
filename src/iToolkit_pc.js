riot.tag('dropdown', '', function(opts) {

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
riot.tag('file-upload', '<div id="uploader" class="wu-example">  <div id="thelist" class="uploader-list"></div> <div class="btns"> <div id="picker">选择文件</div> <button id="ctlBtn" class="btn btn-default">开始上传</button> </div> </div>', function(opts) {
    
    var self = this;
    var config = self.opts.opts || self.opts;
    var head = document.getElementsByTagName('head')[0];
    var webUploadJS = document.createElement('script');
    webUploadJS.src = config.jsUrl || 'http://cdn.staticfile.org/webuploader/0.1.1/webuploader.js';
    var jQuerySource = document.createElement('script');
    jQuerySource.src = 'http://apps.bdimg.com/libs/jquery/2.1.1/jquery.min.js';

    self.getSource = function() {
        if (!window.WebUploader) {
            head.appendChild(webUploadJS);

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

            swf: '/js/Uploader.swf',

            server: 'http://webuploader.duapp.com/server/fileupload.php',


            pick: '#picker',

            resize: false
        });
        console.log(uploader);

        uploader.on( 'uploadProgress', function( file, percentage ) {
            var $li = $( '#'+file.id ),
                $percent = $li.find('.progress .progress-bar');

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

});
riot.tag('goto-top', '<div class="itoolkit-goto-top" show="{ showGotoTop }" onclick="{ gotoTop }"> <span class="icon" if="{ !config.img }"><span class="icon-arrowUp"></span></span> <img riot-src="{ config.img }" if="{ config.img }"> </div>', 'goto-top .itoolkit-goto-top{ display: block; position: fixed; bottom: 50px; right: 40px; height: 60px; width: 60px; z-index: 10000; text-align: center; opicity: 0.5; cursor: pointer; } goto-top .itoolkit-goto-top .icon{ font-size: 3em; margin: auto; float: none; }', function(opts) {

    var self = this;
    self.config = self.opts.opts || self.opts;
    var avalibleHeight = window.screen.availHeight;
    
    self.on('mount', function() {
        self.root.querySelector('.itoolkit-goto-top').style.bottom = self.config.bottom;
        self.root.querySelector('.itoolkit-goto-top').style.right = self.config.right;
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
    window.test = self;




    

});
riot.tag('loading', '<div class="{itoolkit-loading: true, default: default}" > <img riot-src="{ img }" if="{ img }" width="{ width }" alt="loading"> </div>', 'loading .itoolkit-loading { text-align: center; }', function(opts) {

    var self = this;
    var config = self.opts.opts || self.opts;
    
    if (!config.img) {
        self.img = false;
        self.default = true;
    }
    else {
        self.img = config.img;
    }
    
    self.on('mount', function() {
        var childDom = self.root.getElementsByClassName('itoolkit-loading')[0];

        var img = childDom.querySelector('loading .itoolkit-loading img');
        if (img) {
            img.style.height = config.imgHeight || '50px';
        }

        var cellHeight = parseInt(window.getComputedStyle(childDom, null).height.replace('px', ''), 10);

        var parentDom = self.root.parentNode;
        var parentPosition = window.getComputedStyle(parentDom, null).position;

        self.root.style.marginTop = '-' + cellHeight/2 + 'px';
        if (parentPosition === 'static') {
            parentDom.style.position = 'relative';
        }
    })

    self.root.show = function(newrows){
        if (childDom) {
            childDom.style.display = 'block';
        }
    }

    self.root.hide = function(newrows){
        if (childDom) {
            childDom.style.display = 'none';
        }
    }
    

});
riot.tag('modal', '<div class="itoolkit-modal-dialog" riot-style="width:{width}; height:{height}"> <div class="itoolkit-modal-title"> <span>{ title }</span> <div class="itoolkit-modal-close-wrap" onclick="{ close }"> <div class="itoolkit-modal-close"></div> </div> </div> <div class="itoolkit-modal-container"> <yield> </div> </div>', function(opts) {

    var self = this;
    var config = self.opts.opts || self.opts;
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
    }.bind(this);
    if (document.querySelector("[modal-open-target='" + self.root.id + "']")) {
        document.querySelector("[modal-open-target='" + self.root.id + "']").onclick = function() {
            self.root.style.display = 'block';
        }
    }

    self.root.open = function() {
        self.root.style.display = 'block';
    }

    self.root.close = function() {
        self.root.style.display = 'none';
    }




});
riot.tag('paginate', '<div onselectstart="return false" ondragstart="return false"> <div class="paginate"> <li onclick="{ goFirst }">«</li> <li onclick="{ goPrev }">‹</li> </div> <ul class="paginate"> <li each="{ pages }" onclick="{ parent.changePage }" class="{ active: parent.currentPage == page }">{ page }</li> </ul> <div class="paginate"> <li onclick="{ goNext }">›</li> <li onclick="{ goLast }">»</li> </div> <div class="paginate"> <form onsubmit="{ redirect }"> <span class="redirect" if="{ redirect }">跳转到<input name="page" type="number" style="width: 40px;" min="1" max="{ pageCount }">页 </span> <span class="page-sum" if="{ showPageCount }"> 共<em>{ pageCount }</em>页 </span> <span class="item-sum" if="{ showItemCount }"> <em>{ count }</em>条 </span> <input type="submit" style="display: none;"> </form> </div> </div>', function(opts) {
    
    var self = this;
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
    }



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
    var keyWords = ['insertTip', 'ajaxSubmit', 'submit'];   //保留字，不被覆盖

    self.presentWarning = '必填';
    self.emailWarning = '邮箱格式错误';
    self.mobileWarning = '手机格式错误';
    self.urlWarning = '网址格式错误';
    self.successTips = '通过';
    self.regWarning = '字段不符合验证规则';

    self.passClass = config.passClass || 'valid-pass';
    self.failedClass = config.failedClass || 'valid-failed';

    EL.loadData = function(newData, colName){
        colName = colName || 'data';
        self[colName] = newData;
        self.update();
    }

    self.getData = EL.getData = function(){
        var elems = self.root.getElementsByTagName('form')[0].elements;
        var params = {};
        for (var i = 0; i < elems.length; i++) {
            if (elems[i].name) {
                if (elems[i].tagName === "SELECT") {
                    value = elems[i].options[elems[i].selectedIndex].value;
                    params[elems[i].name] = encodeURIComponent(value);
                } 
                else if (elems[i].type === "checkbox" || elems[i].type === "radio"){
                    if (elems[i].checked) {
                        value = elems[i].value;
                        params[elems[i].name] = encodeURIComponent(value);
                    }
                }
                else {
                    value = elems[i].value;
                    params[elems[i].name] = encodeURIComponent(value);
                }
            }
        }
        return params;
    }

    self.getQuery = EL.getQuery = function(){
        var elems = self.root.getElementsByTagName('form')[0].elements;
        var params = {};
        for (var i = 0; i < elems.length; i++) {
            if (elems[i].name) {
                if (elems[i].tagName === "SELECT") {
                    value = elems[i].options[elems[i].selectedIndex].value;
                    params[elems[i].name] = encodeURIComponent(value);
                } 
                else if (elems[i].type === "checkbox" || elems[i].type === "radio"){
                    if (elems[i].checked) {
                        value = elems[i].value;
                        params[elems[i].name] = encodeURIComponent(value);
                    }
                }
                else {
                    value = elems[i].value;
                    params[elems[i].name] = encodeURIComponent(value);
                }
            }
        }
        return params
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
    
    
    self.removeTips = function(elems) {
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

        for (var i = 0; i < elems.length; i++) {
            utils.removeClass(elems[i], self.passClass);
            utils.removeClass(elems[i], self.failedClass);
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
        utils.removeClass(dom, self.passClass);
        utils.addClass(dom, self.failedClass);
    }

    self.onValidPass = config.onValidPass || function(dom, successTips) {
        self.insertTip(dom, successTips, 'tip-container success');
        utils.removeClass(dom, self.failedClass);
        utils.addClass(dom, self.passClass);
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
            if (elems[i].type === "submit" && elems[i].tagName !== "BUTTON") {
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
                if (config.complete && typeof config.complete === 'function') {
                    config.complete();
                }
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
                self.removeTips(elems);
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
                var type = elems[i].getAttribute('type');
                var v = elems[i].value; 
                var name = elems[i].name;
                var dom = elems[i];
                var validMin = function() {
                    min = parseInt(min, 10);
                    if (v.length < min) {
                        validArr.push(name);
                        self.onValidRefuse(dom, self.minWarning(min));
                    }
                    else {
                        self.onValidPass(dom, self.successTips);
                    }
                }

                var validMax = function() {
                    max = parseInt(max, 10);
                    if (v.length > max) {
                        validArr.push(name);
                        self.onValidRefuse(dom, self.maxWarning(max));
                    }
                    else {
                        self.onValidPass(dom, self.successTips);
                    }
                }
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
                        else if (max && type!== 'number'){
                            validMax();
                        }
                        else if (min && type!== 'number'){
                            validMin();
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
                else if (name && max && type!== 'number') {
                    validMax();
                }
                else if (name && min && type!== 'number') {
                    validMin();
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

    this.drawcell = function(rowdata, td, col) {
        if (col.attrs.length) {
            for (i in col.attrs) {
                if (typeof col.attrs[i] !== 'function') {
                    if (col.attrs[i]['name'] && col.attrs[i]['name']!=='class') {
                        td.root.setAttribute(col.attrs[i]['name'], col.attrs[i]['value']);
                    }
                    else if (col.attrs[i]['name'] && col.attrs[i]['name']=='class') {
                        td.root.className += (' ' + col.attrs[i]['value']);
                    }
                }
            }
        } //将rcol的属性挪到td上，class需特殊处理，name和alias不动
        
        if(col.inner){
            setTimeout(function() {
                var str = col.inner.replace(/&lt;%=/g, '{')
                                   .replace(/%&gt;/g, '}')
                                   .replace(/%>/g, '}')
                                   .replace(/<%=/g, '{');
                td.root.innerHTML = riot.util.tmpl(str, rowdata);
            }, 10);
        }
        else{
            return rowdata[col.name];
        }
    }.bind(this);


});
riot.tag('tree', '<div class="tree-item-wrap" each="{ data }" onselectstart="return false" ondragstart="return false"> <input type="checkbox" onchange="{ parent.checkHandle }" if="{ parent.rootConfig.showCheck }"> <i class="{ tree-item-arrow: true, open: opened, empty: !children }" onclick="{ parent.toggle }"></i> <i class="tree-item-icon"></i> <div onclick="{ parent.leftClick }" class="{ tree-item-name : true }" title="{ name }">{ name }</div>  <ul class="tree-child-wrap" if="{ children }"> <tree data="{ children }" if="{ children }"></tree> </ul> </div>', function(opts) {

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