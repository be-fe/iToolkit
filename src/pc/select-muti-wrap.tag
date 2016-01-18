<select-muti-wrap>
    <style>
        select-muti-wrap {
            display: block;
            position: relative;
            cursor: pointer;
        }
        select-muti-wrap select {
            display: none;
        }

        select-muti-wrap .itoolkit-selected-container {
            box-sizing: border-box;
            list-style: none;
            margin: 0;
            padding: 0 5px;
            width: 100%;
            display: inline-block;
            /*overflow-x: hidden;*/
            /*overflow-y: auto;*/
            border-radius: 0;
            border: 1px solid #d2d6de;
            text-align: left;
        }

        select-muti-wrap .itoolkit-selected-container .itoolkit-selected-option {
            display: inline-block;
            padding: 4px 8px;
            background: #3c8dbc;
            border-color: #367fa9;
            color: #ffffff;
            border-radius: 4px;
            margin: 2px 5px 2px 0;
        }

        select-muti-wrap .itoolkit-search-wrap {
            width: 1em;
            display: inline-block;
        }
        select-muti-wrap .itoolkit-search-wrap input {
            padding-left: 0;
            padding-right: 0;
            height: 30px;
            border:none;
        }

        select-muti-wrap .itoolkit-options-container {
            padding: 0;
            text-align: left;
            position: absolute;
            width: 100%;
            border: 1px solid #d2d6de;
            border-top: none;
            z-index: 10000;
            background: #ffffff;
            display: none;
            max-height: 150px;
            overflow-y: auto;
        }

        select-muti-wrap .itoolkit-options-container .itoolkit-options {
            padding: 6px 12px;
        }

        select-muti-wrap .itoolkit-options-container .itoolkit-options:hover {
            background: #eff3f8;
        }

        select-muti-wrap .itoolkit-options-container .no-result {
            text-align: center;
            padding: 6px 0;
        }
        select-muti-wrap .empty-icon {
            padding: 0 9px;
        }

        select-muti-wrap .itoolkit-option-check {
            /* 对勾*/
        }

        select-muti-wrap .itoolkit-close {
            /* 叉叉*/
        }

    </style>
    <yield/>
    <ul class="itoolkit-selected-container" onmousedown="{ showOptions }">
        <li class="itoolkit-selected-option" each="{realData }" if="{ selected }">
            { name }
            <span class="itoolkit-close" onmousedown="{ cancel }" >×</span>
        </li>
        <li class="itoolkit-search-wrap" style="min-height: 34px;">
            <input
                type="text"
                class="form-control itoolkit-select-search"
                oninput="{ filter }"
                onfocus="{ filter }"
                onkeyup="{ keyboardHandle }"
            />
        </li>
    </ul>
    <ul class="itoolkit-options-container">
        <li class="itoolkit-options" each="{ realData }" onmousedown="{ toggle }" if="{ !hide }">
            <span class="itoolkit-option-check" if="{ selected }">√</span>
            <span class="empty-icon" if="{ !selected }"></span>
            { name }
        </li>
        <li class="no-result" if="{ noResult }">无搜索结果</li>
    </ul>

    <script>
        var self = this;
        var config = self.opts.opts || self.opts;
        self.gotOptions = false;

        self.init = self.root.init = function() {
            self.gotOptions = false;
            self.update();
        };

        /*
         *
         */
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

        /*
         * 键盘操作
         */
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
    </script>
</select-muti-wrap>

