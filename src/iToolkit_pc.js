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
riot.tag('paginate', '<div onselectstart="return false" ondragstart="return false"> <div class="paginate"> <li onclick="{ goFirst }">«</li> <li onclick="{ goPrev }">‹</li> </div> <ul class="paginate"> <li each="{ pages }" onclick="{ parent.changePage }" class="{ active: parent.currentPage == page }">{ page }</li> </ul> <div class="paginate"> <li onclick="{ goNext }">›</li> <li onclick="{ goLast }">»</li> </div> <div class="paginate"> <form onsubmit="{ redirect }" style="position:relative;"> <span class="redirect" if="{ redirect }">跳转到<input class="jumpPage" name="page" riot-type={"number"} style="width: 40px;">页 </span> <div class="paginate-tips" riot-style="top: { tipsTop }; left: { tipsLeft }; display: { showTip }"> 请输入1～{ pageCount }之间的数字 </div> <span class="page-sum" if="{ showPageCount }"> 共<em>{ pageCount }</em>页 </span> <span class="item-sum" if="{ showItemCount }"> <em>{ count }</em>条 </span> <input type="submit" style="display: none;"> </form> </div> </div>', '.paginate .paginate-tips{ position: absolute; padding: 5px; border: 1px solid #ddd; background-color: #fff; -webkit-box-shadow: 0 0 10px #ccc; box-shadow: 0 0 10px #ccc; } .paginate .paginate-tips:before { content: ""; position: absolute; width: 0; height: 0; top: -16px; left: 10px; border: 8px solid transparent; border-bottom-color: #ddd; } .paginate .paginate-tips:after { content: ""; position: absolute; width: 0; height: 0; top: -15px; left: 10px; border: 8px solid transparent; border-bottom-color: #fff; }', function(opts) {
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
riot.tag('select-muti-wrap', '<yield></yield> <ul class="itoolkit-selected-container" onmousedown="{ showOptions }"> <li class="itoolkit-selected-option" each="{realData }" if="{ selected }"> { name } <span class="itoolkit-close" onmousedown="{ cancel }" >×</span> </li> <li class="itoolkit-search-wrap" style="min-height: 34px;"> <input type="text" class="form-control itoolkit-select-search" oninput="{ filter }" onfocus="{ filter }" onkeyup="{ keyboardHandle }"> </li> </ul> <ul class="itoolkit-options-container"> <li class="itoolkit-options" each="{ realData }" onmousedown="{ toggle }" if="{ !hide }"> <span class="itoolkit-option-check" if="{ selected }">√</span> <span class="empty-icon" if="{ !selected }"></span> { name } </li> <li class="no-result" if="{ noResult }">无搜索结果</li> </ul>', 'select-muti-wrap { display: block; position: relative; cursor: pointer; } select-muti-wrap select { display: none; } select-muti-wrap .itoolkit-selected-container { box-sizing: border-box; list-style: none; margin: 0; padding: 0 5px; width: 100%; display: inline-block; /*overflow-x: hidden;*/ /*overflow-y: auto;*/ border-radius: 0; border: 1px solid #d2d6de; text-align: left; } select-muti-wrap .itoolkit-selected-container .itoolkit-selected-option { display: inline-block; padding: 4px 8px; background: #3c8dbc; border-color: #367fa9; color: #ffffff; border-radius: 4px; margin: 2px 5px 2px 0; } select-muti-wrap .itoolkit-search-wrap { width: 1em; display: inline-block; } select-muti-wrap .itoolkit-search-wrap input { padding-left: 0; padding-right: 0; height: 30px; border:none; } select-muti-wrap .itoolkit-options-container { padding: 0; text-align: left; position: absolute; width: 100%; border: 1px solid #d2d6de; border-top: none; z-index: 10000; background: #ffffff; display: none; max-height: 150px; overflow-y: auto; } select-muti-wrap .itoolkit-options-container .itoolkit-options { padding: 6px 12px; } select-muti-wrap .itoolkit-options-container .itoolkit-options:hover { background: #eff3f8; } select-muti-wrap .itoolkit-options-container .no-result { text-align: center; padding: 6px 0; } select-muti-wrap .empty-icon { padding: 0 9px; } select-muti-wrap .itoolkit-option-check { /* 对勾*/ } select-muti-wrap .itoolkit-close { /* 叉叉*/ }', function(opts) {
        var self = this;
        var config = self.opts.opts || self.opts;
        self.gotOptions = false;

        self.init = self.root.init = function() {
            self.gotOptions = false;
            self.update();
        };

        
        self.realData = [];
        self.root.realData = self.realData;
        self.root.getSelectedData = function () {
            var selectedData = [];
            for (var i = 0, l= self.realData.length; i < l; i ++) {
                if (self.realData[i].selected) {
                    selectedData.push({
                        id: parseInt(self.realData[i].value, 10)
                    });
                }
            }
            return selectedData;
        };

        self.initData = self.root.initData = function() {
            if (self.root.querySelector('select')) {
                var options = self.root.querySelector('select').querySelectorAll('option');
            }
            if (options && options.length && !self.gotOptions) {
                self.options = options;
                self.searchInput = self.root.querySelector('.itoolkit-select-search');
                self.optionsWrap = self.root.querySelector('.itoolkit-options-container');
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
                    self.resetSelectOpt();
                };
                self.gotOptions = true;
                self.update();
                console.log(self.realData);
            }
        };


        self.on('update', function() { 
            setTimeout(function() {
                self.initData();
            }, 0)
            
        });



        self.on('mount', function() {
            if (config) {
                utils.extend(self, config);
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
            if (e.item.selected) {
                e.item.selected = false;
                self.options[e.item.index].selected = false;
            }
            else {
                e.item.selected = true;
                self.options[e.item.index].selected = true;
            }
            self.update();
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
            searchInput.options = document.querySelectorAll('.itoolkit-options');
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
riot.tag('super-table', '<yield>', function(opts) {
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

        }

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
        
        self.orderBy = EL.orderBy = function(col) {
            self.orderkeyName = col;
            if (self.ordered !== col) {
                if (self.reversed !== col) {
                    self.data = self.data.sort(self.compare)
                }
                else {
                    self.data = self.data.reverse();
                }
            }
            else {
                return
            }
            self.ordered = col;
            self.reversed = false;
            self.update()
        };

        self.loadData = EL.loadData = function(data) {
            self.data = data;

            self.update();
        };
        self.append = EL.loadData = function(rows) {
            if (utils.isObject(rows)) {
                self.data.push(rows);
            }
            else if (utils.isArray(rows)) {
                self.data = self.data.concat(rows);
            }
        };
        self.insertBefore = EL.insertBefore = function(rows) {
            if (utils.isObject(rows)) {
                self.data.unshift(rows);
            }
            else if (utils.isArray(rows)) {
                self.data = rows.concat(self.data);
            }
        };
        self.reverseBy = EL.reverseBy = function(col) {};



    
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
    }
    

    
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
riot.tag('tab', '<ul> <li each="{ data }" onclick="{ parent.toggle }" class="{ active: parent.currentIndex==index }">{ title }</li> </ul> <div class="tab-content" riot-tag="tab-content"></div>', function(opts) {

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

riot.tag('tab-content', '', function(opts) {
    var self = this;
   
    self.parent.on('update', function() {
        self.root.innerHTML = self.parent.content;
    });

});
riot.tag('tree-item', '<input type="checkbox" __checked="{ item.selected }" if="{ parent.rootConfig.showCheck }" onchange="{ checkHandle }"> <i class="tree-item-arrow { open: item.opened }" onclick="{ toggle }" if="{ item.children }"></i> <i class="tree-item-icon" if="{ item.children }"></i> <div onclick="{ leftClick }">{ item.name }</div>', function(opts) {
    
    var self = this;
    
    
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

riot.tag('tree', '<div class="tree-item-wrap" each="{ item, i in data }" onselectstart="return false" ondragstart="return false"> <tree-item class="tree-item-row { root: item.level==1 }" riot-style="padding-left: { countPadding(item.level) }"></tree-item> <ul class="tree-child-wrap" if="{ item.opened && item.children }"> <tree data="{ item.children }"></tree> </ul> </div>', function(opts) {
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
    
    
    if (!self.parent || self.parent.root.tagName !== 'TREE') {
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