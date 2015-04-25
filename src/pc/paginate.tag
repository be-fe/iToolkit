<paginate>
    <div class="paginate" if={ currentPage != 1 }>
        <li>首页</li>
        <li>上一页</li>
    </div>
    <ul class="paginate" if={ pageCount > 1 }>
        <li each={ pages } onclick={ parent.changePage } class={ active: parent.currentPage == page }>{ page }</li>
    </ul>
    <div class="paginate" if={ currentPage != pageCount }>
        <li>下一页</li>
        <li>末页</li>
    </div>
    
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
    
    
    changePage(e) {
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
    }

</paginate>