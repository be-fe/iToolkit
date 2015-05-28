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

    EL.loadData = function(newData, colName){
        colName = colName || 'data';
        self[colName] = newData
        self.update()
    }

</super-div>