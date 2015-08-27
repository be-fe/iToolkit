riot.tag('super-div', '<yield>', 'super-div{ display: block; }', function(opts) {
    
    var self = this;
    var config = self.opts.opts || self.opts;
    var EL = self.root;

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
                self.data = {};
                self.data[i] = data[i];
            }
            self.update();
        });
    }

    self.on('mount', function() {
        EL.style.display = 'block';
        self.superDivUrl = EL.getAttribute('data-get') || EL.getAttribute('data-jsonp');
        if (self.superDivUrl) {
            self.getData(config.params);
        }
    })
    
    
    self.loadData = EL.loadData = function(newData, colName){
        colName = colName || 'data';
        self[colName] = newData
        self.update();
    }

    self.reload = EL.reload = function() {
        if (self.superDivUrl) {
            self.getData(config.params);
        }
        else {
            self.update();
        }
    }


});