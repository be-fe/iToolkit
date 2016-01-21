<paginate>
    <style>
    .paginate .paginate-tips{
        position: absolute;
        padding: 5px;
        border: 1px solid #ddd;
        background-color: #fff;
        -webkit-box-shadow: 0 0 10px #ccc;
        box-shadow: 0 0 10px #ccc;
    }
    .paginate .paginate-tips:before {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        top: -16px;
        left: 10px;
        border: 8px solid transparent;
        border-bottom-color: #ddd;
    }
    .paginate .paginate-tips:after {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        top: -15px;
        left: 10px;
        border: 8px solid transparent;
        border-bottom-color: #fff;
    }
    </style>
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
            <form onsubmit={ redirect } style="position:relative;">
                <span>
                    <select-list list={ pagesizeOpts } title="选择分页数量"></select-list>
                </span>
                <span class="redirect" if={ redirect }>跳转到<input class="jumpPage" name="page" type="number" style="width: 40px;">页 </span>
                <div class="paginate-tips" style="top: { tipsTop }; left: { tipsLeft }; display: { showTip }">
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

    self.setPagesize = function () {
        var ret = [];
        var selected = Math.ceil(self.pagesize / 10);
        for (var i = 1; i < 11; i++) {
            ret.push({
                value: i * 10,
                text: '每页' + (i * 10) + '条',
                selected: i === selected ? 'selected' : '',
            });
        }
        return ret;
    };

    self.pagesizeOpts = self.setPagesize();

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

    self.on('selected', function (v) {
        config.onPagesizeSelected && config.onPagesizeSelected(v.value);
    });

    </script>

</paginate>

<select-list>
    <style>
    select-list {
        display: inline-block;
        position: relative;
        cursor: pointer;
    }
    .select-list-title-text {
        border: 1px solid #ddd;
        width: 94px;
        padding: 6px 12px;
        color: #337ab7;
    }
    .select-list-options {
        display: none;
        position: absolute;
        max-height: 96px;
        overflow-x: none;
        overflow-y: auto;
        border: 1px solid #ddd;
    }
    .select-list-option {
        width: 92px;
        padding: 6px 12px;
        background-color: #fff;
    }
    .select-list-option.selected {
        background-color: #ccc;
        color: #fff;
    }
    .select-list-options.open {
        display: block;
    }
    </style>
    <div onclick="{ toggle }">
        <div class="select-list-title-text">{ selectedItem.text }</div>
        <div class="select-list-title-triangle"></div>
    </div>
    <div class="select-list-options { open : openning }" style="top: { top }">
        <div each="{ list }" class="select-list-option { selected: parent.selectedItem.value === value }" onclick="{ parent.select }">{ text }</div>
    </div>
    <script>
    var self = this;
    self.openning = false;
    self.list = self.opts.list;

    self.getSelected = function() {
        for (var i = 0; i < self.list.length; i++) {
            if (self.list[i].selected) {
                return self.list[i];
            }
        }
    }

    self.selectedItem = self.getSelected();

    /* 展开或者收起下拉列表 */
    self.toggle = function (e) {
        window.event ? window.event.cancelBubble = true : e.stopPropagation();
        if (!self.openning) {
          self.openning = true;
        } else {
          self.openning = false;
        }
        self.update();

        if (self.openning) {
            var listBox = self.root.querySelector('.select-list-options');
            var listBoxHeight = listBox.clientHeight;
            var isOverflow = listBoxHeight + e.pageY > document.body.clientHeight;
            if (isOverflow) {
                self.top = (-listBoxHeight - 1) + 'px';
            }
            else {
                self.top = self.root.clientHeight - 1 + 'px';
            }
            self.update();
        }
    };

    self.select = function (e) {
        window.event ? window.event.cancelBubble = true : e.stopPropagation();
        var prevSelectedItem = self.selectedItem;
        self.selectedItem = e.item;
        self.openning = false;
        if (prevSelectedItem !== self.selectedItem) {
            self.parent.trigger('selected', self.selectedItem);
        }
        self.update();
    };

    self.closeSelectList = function (e) {
        self.openning = false;
        self.update();
    };

    self.on('mount', function () {
        document.addEventListener('click', self.closeSelectList, false);
    });
    self.on('unmount', function () {
        document.removeEventListener('click', self.closeSelectList, false);
    });
    </script>
</select-list>