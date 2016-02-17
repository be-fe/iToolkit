<itk-select>
    <yield/>
    <ul class="itk-selected-container" onmousedown="{ showOptions }">
        <li class="itk-selected-option" each="{realData }" if="{ selected && parent.mutiple}">
            { name }
            <span class="itk-close" onmousedown="{ cancel }" >×</span>
        </li>
        <li class="itk-single-option" each="{ realData }" if="{ selected && !parent.mutiple}">
            { name }
        </li>
        <li class="itk-search-wrap">
            <input
                type="text"
                class="form-control itk-select-search"
                oninput="{ filter }"
                onfocus="{ filter }"
                onkeyup="{ keyboardHandle }"
            />
        </li>
    </ul>
    <ul class="itk-options-container">
        <li class="itk-options" each="{ realData }" onmousedown="{ toggle }" if="{ !hide }">
            <span class="itk-option-check" if="{ selected }"></span>
            <span class="empty-icon" if="{ !selected }"></span>
            { name }
        </li>
        <li class="no-result" if="{ noResult }">无搜索结果</li>
    </ul>

    <script>
        var self = this;
        var config = self.opts.opts || self.opts;
        self.gotOptions = false;
        self.chooseOnce = true;

        self.init = self.root.init = function() {
            self.gotOptions = false;
            self.update();
        };

        /*
         *
         */
        self.realData = [];
        self.root.exportData = self.realData;

        self.initData = self.root.initData = function() {
            if (self.root.querySelector('select')) {
                var options = self.root.querySelector('select').querySelectorAll('option');
                var mutiple = self.root.querySelector('select').hasAttribute('mutiple');
                if (mutiple) {
                    self.mutiple = true;
                }
                else {
                    self.mutiple = false;
                    self.noSearch = true;
                }
            }
            if (options && options.length && !self.gotOptions) {
                self.options = options;
                self.searchInput = self.root.querySelector('.itk-select-search');
                self.optionsWrap = self.root.querySelector('.itk-options-container');
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
                    self.searchInput.value = '';
                    self.resetSelectOpt();
                };

                if (self.noSearch) {
                    self.searchInput.style.width = '0px';
                }
                self.gotOptions = true;
                self.update();
            }
        };


        self.on('update', function() { 
            setTimeout(function() {
                self.initData();
            }, 0)
            
        });



        self.on('mount', function() {
            if (config) {
                for (var i in config) {
                    self[i] = config[i];
                }
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
            if (self.mutiple) {
                if (e.item.selected) {
                    e.item.selected = false;
                    self.options[e.item.index].selected = false;
                }
                else {
                    e.item.selected = true;
                    self.options[e.item.index].selected = true;
                }
            }
            else {
                for (i = 0; i < self.realData.length; i++) {
                    self.realData[i].selected = false;
                    self.options[i].selected = false;
                }
                e.item.selected = true;
                self.options[e.item.index].selected = true;
            }
            self.update();
            if (self.chooseOnce) {
                self.searchInput.blur();
            }
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

        /*
         * 键盘操作
         */
        self.keyboardHandle = function(e) {
            var searchInput = e.target;
            searchInput.options = self.root.querySelectorAll('.itk-options');
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
    </script>
</itk-select>

