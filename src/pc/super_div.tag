<super-div>
    <style scope>
        super-div{
            display: block;
        }
    </style>
    <yield>
    
    var self = this;
    var config = self.opts.opts || self.opts;
    var EL = self.root;

    for (i in config) {
        self[i] = config[i];
    }
    
    /*
     *  根据attr自动将接口和视图进行映射
     */
    self.getData = function(params) {
        var params = params || {};
        if (EL.getAttribute('data-get')) {
            var method = 'httpGet';
        }
        else if (EL.getAttribute('data-jsonp')) {
            var method = 'jsonp';
        }
        
        utils[method](self.superDivUrl, params, function(data) {
            for (i in data) {
                self.data = {};
                self.data[i] = data[i];
            }
            self.update();
        });
    }

    self.on('mount', function() {
        self.superDivUrl = EL.getAttribute('data-get') || EL.getAttribute('data-jsonp');
        if (self.superDivUrl) {
            self.getData(config.params);
        }
    })
    
    /*
     *  load & reload 数据
     */
    EL.loadData = function(newData, colName){
        colName = colName || 'data';
        self[colName] = newData
        self.update()
    }

    EL.reloadData = function() {
        if (self.superDivUrl) {
            self.getData(config.params);
        }
    }

</super-div>