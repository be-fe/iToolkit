<paginate>
    <style>
        .paginate {
            display: inline-block;
            padding: 0;
        }
        .paginate li {
            cursor: pointer;
            display: inline-block;
            position: relative;
            padding: 6px 12px;
            margin-left: -1px;
            line-height: 1.42857143;
            color: #337ab7;
            text-decoration: none;
            background-color: #fff;
            border: 1px solid #ddd;
        }

        .paginate li.active {
            color: #23527c;
            background-color: #eee;
            border-color: #ddd;
        }
    </style>
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
    if (self.opts.opts) {
        self.count = self.opts.opts.count || 0;
        self.pagesize = self.opts.opts.pagesize || 20;
        self.pageCount = self.opts.opts.pageCount || Math.ceil(self.count/self.pagesize) || 1;
        self.currentPage = self.opts.opts.currentPage || 1;
        self.url = self.opts.opts.url || '';
        self.showNumber = self.opts.opts.showNumber || 5;

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
    }
    
    
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
    }

</paginate>