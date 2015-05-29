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
    self.superDivUrl = EL.getAttribute('data-get') || EL.getAttribute('data-jsonp');

    for (i in config) {
        self[i] = config[i];
    }
    
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
                self[i] = data[i];
            }
            self.update();
        });
    }

    self.on('mount', function() {
        if (self.superDivUrl) {
            self.getData(config.params);
        }
    })

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