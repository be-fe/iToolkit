<paginate>
    <div class="paginate">
        <li onclick={ goFirst }>«</li>
        <li onclick={ goPrev }>‹</li>
    </div>
    <ul class="paginate" if={ pageCount > 1 }>
        <li each={ pages } onclick={ parent.changePage } class={ active: parent.currentPage == page }>{ page }</li>
    </ul>
    <div class="paginate">
        <li onclick={ goNext }>›</li>
        <li onclick={ goLast }>»</li>
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

    goFirst(e) {
        config.callback(1);
        self.currentPage = 1;
        self.pageChange(self.currentPage);
    }

    goPrev(e) {
        if (self.currentPage > 1) {
            config.callback(self.currentPage - 1);
            self.currentPage = self.currentPage - 1;
            self.pageChange(self.currentPage);
        }
    }

    goNext(e) {
        if (self.currentPage < self.pageCount) {
            config.callback(self.currentPage + 1);
            self.currentPage = self.currentPage + 1;
            self.pageChange(self.currentPage);
        }
    }
    
    goLast(e) {
        config.callback(self.pageCount);
        self.currentPage = self.pageCount;
        self.pageChange(self.currentPage);
    }

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

    changePage(e) {
        var page = e.item.page
        if (typeof(page) === 'string') {
            return false;
        }
        else {
            self.pageChange(page);
        }
    }


</paginate>