<itk-table>
    <yield>
    <script>
        var self = this;
        var config = self.opts.opts || self.opts;
        var EL = self.root;
        
        self.init = function() {
            EL.style.display = 'block';
            for (i in config) {
                if (!self[i]) {
                    self[i] = config[i];
                }
            }
            self.originData = utils.deepCopy(self.data);
            self.update();
        };


        self.on('mount', function() {
            self.init();
        });

        /*
         * 内部方法
         */
        self.compare = function(a, b) {
            if (a[self.orderkeyName] > b[self.orderkeyName]) {
                return 1;
            } 
            else if (a[self.orderkeyName] === b[self.orderkeyName]) {
                return 0;
            }
            else {
                return -1;
            }
        }

        self.clearOrder = function() {
            self.ordered = false;
            self.reversed = false;
        }

        /*
         * 加载新数据
         */
        self.loadData = EL.loadData = function(data) {
            self.data = data;
            self.originData = utils.deepCopy(data);
            self.update();
            return self.data;
        };
        
        /*
         * 对外暴露当前数据状态
         */
        self.exportData = EL.exportData = function() {
            return self.data;
        }
        
        /*
         * 重载原始数据
         */
        self.reset = EL.reset = function() {
            self.data = utils.deepCopy(self.originData);
            self.update();
        };

        /*
         * 排序By col
         */
        self.orderBy = function(col) {
            return function() {
                self.orderkeyName = col;
                if (self.ordered !== col) {
                    if (self.reversed !== col) {
                        self.data = self.data.sort(self.compare)
                    }
                    else {
                        self.data = self.data.reverse();
                    }
                    self.ordered = col;
                    self.reversed = false;
                    self.update()
                }
                return self.data;
            }
        };

        EL.orderBy = function(col) {
            self.orderBy(col)();
        };

        /*
         * 倒序By col
         */
        self.reverseBy = function(col) {
            return function() {
                self.orderkeyName = col;
                if (self.reversed !== col) {
                    if (self.ordered !== col) {
                        self.data = self.data.sort(self.compare);
                        self.data = self.data.reverse();
                    }
                    else {
                        self.data = self.data.reverse();
                    }
                    self.ordered = false;
                    self.reversed = col;
                    self.update()
                }
                return self.data;
            }
        };
        
        EL.reverseBy = function(col) {
            self.reverseBy(col)();
        };
        
        self.toggleBy = function(col) {
            if (self.ordered === col) {
                return self.reverseBy(col);
            }
            else {
                return self.orderBy(col);
            }
        };

        EL.toggleBy = function(col) {
            if (self.ordered === col) {
                EL.reverseBy(col);
            }
            else {
                EL.orderBy(col);
            }
        };

        //self.hide = EL.hide = function(col) {};
        
        /*
         * 后方插入一条or多条
         */
        self.append = function(rows) {
            return function() {
                self.clearOrder();
                if (utils.isObject(rows)) {
                    self.data.push(rows);
                }
                else if (utils.isArray(rows)) {
                    self.data = self.data.concat(rows);
                }
                self.update();
            }
        };

        EL.append = function(rows) {
            self.append(rows)();
        };
        
        /*
         * 前方插入一条or多条
         */
        self.prepend = function(rows) {
            return function() {
                self.clearOrder();
                if (utils.isObject(rows)) {
                    self.data.unshift(rows);
                }
                else if (utils.isArray(rows)) {
                    self.data = rows.concat(self.data);
                }
                self.update();
            }
        };
        EL.prepend = function(rows) {
            self.prepend(rows)();
        };
        
        /*
         * 本地删除
         */
        self.deleteBy = function(col, value) {
            return function() {
                if (col && value) {
                    self.clearOrder();
                    for (var i = 0 ; i < self.data.length; i++) {
                        if (self.data[i][col] === value) {
                            self.data.splice(i, 1);
                            i = i - 1;
                        }
                    }
                    self.update();
                }
            };
        }

        EL.deleteBy = function (col, value) {
            self.deleteBy(col, value)();
        }


    </script>
</itk-table>