<itk-paginate>
    <div onselectstart="return false" ondragstart="return false">
        <div class="itk-paginate">
            <li onclick={ goFirst }>«</li>
            <li onclick={ goPrev }>‹</li>
        </div>
        <ul class="itk-paginate">
            <li each={ pages } onclick={ parent.changePage } class={ active: parent.currentPage == page }>{ page }</li>
        </ul>
        <div class="itk-paginate">
            <li onclick={ goNext }>›</li>
            <li onclick={ goLast }>»</li>
        </div>
        <div class="itk-paginate">
            <form onsubmit={ redirect } style="position:relative;">
                <span class="redirect" if={ redirect }>跳转到<input class="jumpPage" name="page" type="number" style="width: 40px;">页 </span>
                <div class="itk-paginate-tips" style="top: { tipsTop }; left: { tipsLeft }; display: { showTip }">
                    请输入1～{ pageCount }之间的数字
                </div>
                <span class="page-sum" if={ showPageCount }> 共<em>{ pageCount }</em>页 </span>
                <span class="item-sum" if={ showItemCount }> <em>{ count }</em>条 </span>
                <input type="submit" style="display: none;">
            </form>
        </div>
    </div>


    <script>
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
            
            // 当以下两种情况，执行回调
            if (
                // 需要实时初始化时
                self.needInit
                // 减少到前一页时
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
            self.updateCurrentPage();
        };

    </script>

</itk-paginate>