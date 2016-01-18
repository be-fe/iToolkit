<super-table>
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
            //self.originData = utils.deepCopy(self.data);
        }

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
        /*
         * 外部方法
         */
        self.orderBy = EL.orderBy = function(col) {
            self.orderkeyName = col;
            if (self.ordered !== col) {
                if (self.reversed !== col) {
                    self.data = self.data.sort(self.compare)
                }
                else {
                    self.data = self.data.reverse();
                }
            }
            else {
                return
            }
            self.ordered = col;
            self.reversed = false;
            self.update()
        };

        //self.hide = EL.hide = function(col) {};
        self.loadData = EL.loadData = function(data) {
            self.data = data;
            //self.originData = utils.deepCopy(data);
            self.update();
        };
        self.append = EL.loadData = function(rows) {
            if (utils.isObject(rows)) {
                self.data.push(rows);
            }
            else if (utils.isArray(rows)) {
                self.data = self.data.concat(rows);
            }
        };
        self.insertBefore = EL.insertBefore = function(rows) {
            if (utils.isObject(rows)) {
                self.data.unshift(rows);
            }
            else if (utils.isArray(rows)) {
                self.data = rows.concat(self.data);
            }
        };
        self.reverseBy = EL.reverseBy = function(col) {};



    </script>
</super-table>