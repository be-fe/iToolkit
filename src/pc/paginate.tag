<paginate>
    <div onselectstart="return false" ondragstart="return false">
        <div class="paginate">
            <li onclick={ goFirst }>«</li>
            <li onclick={ goPrev }>‹</li>
        </div>
        <ul class="paginate">
            <li each={ pages } onclick={ parent.changePage } class={ active: parent.currentPage == page }>{ page }</li>
        </ul>
        <div class="paginate">
            <li onclick={ goNext }>›</li>
            <li onclick={ goLast }>»</li>
        </div>
        <div class="paginate">
            <form onsubmit={ redirect }>
                <span class="redirect" if={ redirect }>跳转到<input name="page" type="number" style="width: 40px;" min="1" max={ pageCount }>页 </span>
                <span class="page-sum" if={ showPageCount }> 共<em>{ pageCount }</em>页 </span>
                <span class="item-sum" if={ showItemCount }> <em>{ count }</em>条 </span>
                <input type="submit" style="display: none;">
            </form>
        </div>
    </div>
    
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

    goFirst(e) {
        self.pageChange(1);
    }

    goPrev(e) {
        if (self.currentPage > 1) {
            self.pageChange(self.currentPage - 1);
        }
    }

    goNext(e) {
        if (self.currentPage < self.pageCount) {
            self.pageChange(self.currentPage + 1);
        }
    }
    
    goLast(e) {
        self.pageChange(self.pageCount);
    }

    redirect(e) {
        var index = self.page.value;
        if (parseInt(index, 10) && parseInt(index, 10) < (self.pageCount + 1)) {
            self.pageChange(parseInt(index, 10));
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


</paginate>