<super-div>
    <style scope>
        super-div{
            display: block;
        }
    </style>
    <yield>
    
    var self = this;
    var config = self.opts.opts || self.opts;

    for (i in config) {
        self[i] = config[i];
    }
</super-div>