riot.tag('tree', '<div class="tree-item-wrap" each="{ data }" onselectstart="return false" ondragstart="return false"> <input type="checkbox" onchange="{ parent.checkHandle }" if="{ parent.rootConfig.showCheck }"> <i class="{ tree-item-arrow: true, open: opened, empty: !children }" onclick="{ parent.toggle }"></i> <div onclick="{ parent.leftClick }" style="display: inline;"> <i class="tree-item-icon" if="{ !parent.children }"></i> <i class="tree-item-icon" if="{ parent.children }"></i> <div class="{ tree-item-name : true }" title="{ name }">{ name }</div>  </div> <ul class="tree-child-wrap" if="{ children }"> <tree data="{ children }" if="{ children }"></tree> </ul> </div>', function(opts) {

    var self = this;
    self.config = self.opts.opts || self.opts;

    
    self.dataHandle = function(data, idName, pidName) {
        var data = data || []
        var id = idName || 'id';
        var pid = pidName || 'pid';

        var dataMap = {};
        data.forEach(function(node) {
            if (self.config.name) {
                node.name = node[self.config.name];
            }
            dataMap[node[id]] = node;
        });

        var tree = [];
        data.forEach(function(node) {
            var parent = dataMap[node[pid]];
            if (parent) {
                if (!parent.children) {
                    parent.children = [];
                }
                parent.children.push(node);
            }
            else {
                tree.push(node);
            }
        });
        return tree;
    };
    
    
    if (self.config.handleData) {
        var tree = self.dataHandle(self.config.data);
        self.data = tree;
    }
    else {
        self.data = self.config.data;
    }

    
    if (self.config.root) {
        self.rootConfig = self.config;
    }
    else {
        self.rootConfig = self.parent.rootConfig || self.parent.parent.rootConfig;
    }
    
    
    this.leftClick = function(e) {
        if (self.rootConfig.folder && e.item.children) {
            if (e.item.opened === true) {
                e.item.opened = false;
            }
            else {
                e.item.opened = true;
            }
        }
        else {
            var leftClick = self.rootConfig.onLeftClick;
            if (leftClick) {
                leftClick(e.item, e.target);
            }
        }
    }.bind(this);

    
    this.checkHandle = function(e) {
        var checkItem = self.rootConfig.onCheck;
        var uncheckItem = self.rootConfig.onUnCheck;
        if (checkItem && e.target.checked) {
            checkItem(e.item, e.target);
        }
        if (uncheckItem && !e.target.checked) {
            uncheckItem(e.item, e.target);
        }
    }.bind(this);



    
    
    this.toggle = function(e) {
        if (e.item.opened === true) {
            e.item.opened = false;
        }
        else {
            e.item.opened = true;
        }
    }.bind(this);

});