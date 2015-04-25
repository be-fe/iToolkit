riot.tag('dropdown', '', function(opts) {

});
riot.tag('modal', '<div class="modal-dialog" riot-style="width:{width}px; height:{height}px"> <div class="modal-title"> <span>{ title }</span> <div class="modal-close" onclick="{ close }">X</div> </div> <div class="modal-content"> <yield> </div> </div>', function(opts) {

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
riot.tag('paginate', '<div class="paginate" if="{ currentPage != 1 }"> <li>首页</li> <li>上一页</li> </div> <ul class="paginate" if="{ pageCount > 1 }"> <li each="{ pages }" onclick="{ parent.changePage }" class="{ active: parent.currentPage == page }">{ page }</li> </ul> <div class="paginate" if="{ currentPage != pageCount }"> <li>下一页</li> <li>末页</li> </div>', function(opts) {
    
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
    
    
    this.changePage = function(e) {
        var page = e.item.page
        if (typeof(page) === 'string') {
            return false;
        }
        if (self.currentPage != e.item.page) {
            self.currentPage = e.item.page;
        }
        if (self.currentPage > 4 && self.pageCount > 7) {
            for (i = (self.currentPage - 3); i < (self.currentPage + 3); i++) {
                self.pages.push({page: i + 1});
                self.update();
            }
        }
        config.callback(self.currentPage);
    }.bind(this);


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
riot.tag('table-view', '<table> <tr> <th>测试一</th> <th>测试二</th> <th>测试三</th> </tr> <tr each="{ data }"> <td>{ count }</td> <td>{ pagesize }</td> <td>{ showNumber }</td> </tr> </table>', function(opts) {

    var self = this;
    self.data = self.opts.data;

});
riot.tag('tree', '<div class="tree-item-wrap" each="{ data }"> <i class="{ tree-item-arrow: true, open: opened, empty: !children }" onclick="{ parent.toggle }"></i> <i class="tree-item-icon"></i> <div onclick="{ parent.changeUser }" onmousedown="{ parent.rightClick }" oncontextmenu="{ parent.nomenu }" class="{ tree-item-name : true, active: deptId == parent.rootParent.currentId }" title="{ name }">{ name }</div> <div class="{ tree-item-back : true, active: deptId == parent.rootParent.currentId }" onclick="{ parent.changeUser }" onmousedown="{ parent.rightClick }" oncontextmenu="{ parent.nomenu }"></div> <ul class="tree-child-wrap" if="{ children }"> <treeview data="{ children }" if="{ children }"></treeview> </ul> </div>', function(opts) {

    var self = this;
    var config = self.opts.opts || self.opts;
    self.data = config.data;


});