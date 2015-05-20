riot.tag('ajax-form', '<form onsubmit="{ submit }"> <yield> </form>', function(opts) {

    var self = this;
    var config = self.opts.opts || self.opts;

    this.submit = function(e) {
        e.preventDefault();
        var elem = self.root.getElementsByTagName('form')[0].elements;
        var url = self.root.getAttribute('action');
        var params = "";
        var value;

        for (var i = 0; i < elem.length; i++) {
            if (elem[i].name) {
                if (elem[i].tagName === "SELECT") {
                    value = elem[i].options[elem[i].selectedIndex].value;
                    params += elem[i].name + "=" + encodeURIComponent(value) + "&";
                } 
                else if (elem[i].type === "checkbox" || elem[i].type === "radio"){
                    if (elem[i].checked) {
                        value = elem[i].value;
                        params += elem[i].name + "=" + encodeURIComponent(value) + "&";
                    }
                }
                else {
                    value = elem[i].value;
                    params += elem[i].name + "=" + encodeURIComponent(value) + "&";
                }
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
            } 
        };
    }.bind(this);


});
riot.tag('rcol', '<yield>', function(opts) {
    var self = this; 
    this.on('mount', function(){ 
        self.root.style.display='none'; 
    });

});
riot.tag('dropdown', '', function(opts) {

});
riot.tag('file-upload', '', function(opts) {



});
riot.tag('modal', '<div class="modal-dialog" riot-style="width:{width}px; height:{height}px"> <div class="modal-title"> <span>{ title }</span> <div class="modal-close" onclick="{ close }"></div> </div> <div class="modal-content"> <yield> </div> </div>', function(opts) {

    var self = this;
    var config = self.opts.opts || self.opts;
    self.width = config.width || 600;
    self.height = config.width || 300;
    self.title = config.title;

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
    if (self.pageCount < 8) {
        for (i = 0; i < self.pageCount; i++) {
            self.pages.push({page: i + 1});
        }
    } 
    else {
        for (i = 0; i < 7; i++) {
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
        if (self.currentPage > 4 && self.pageCount > 7) {
            self.pages = [];
            if (self.pageCount - self.currentPage > 2) {
                var origin = self.currentPage - 4;
                var last = self.currentPage + 3;
            }
            else {
                var last = self.pageCount;
                var origin = self.pageCount - 7;
            }
            for (i = origin; i < last; i++) {
                self.pages.push({page: i + 1});
                self.update();
            }
            
        }
        else if (self.currentPage < 5 && self.pageCount > 7){
            self.pages = [];
            for (i = 0; i < 7; i++) {
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
riot.tag('table-view', '<yield> <table class="{ config.class }"> <tr> <th each="{ cols }">{ alias || name }</th> </tr> <tr each="{ row in rows }" > <td each="{ colkey, colval in parent.cols }"> { parent.parent.drawcell( parent.row, this, colkey) } </td> </tr> </table>', function(opts) {

    var self = this;
    var EL = self.root;
    self.config = self.opts.opts || self.opts;
    self.cols = [];
    self.rows = [];

    self.on('mount', function() {
        self.rows = self.config.data;
        if (EL.children.length > 1) {
            for( i = 0; i < EL.children.length; i++){
                var child = EL.children[i];
                if(child.localName=='rcol'){
                    var col_style=''    
                    if(child.attributes['width']!=undefined) {
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


    EL.load = function(newrows){
        self.rows = newrows
        self.update()
    }

    EL.append = function(newrows){
        self.rows.push(newrows)
        self.update()
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
            }, 1);
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