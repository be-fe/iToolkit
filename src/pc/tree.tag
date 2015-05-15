<tree>
    <div class="tree-item-wrap" each={ data }>
        <i class={ tree-item-arrow: true, open: opened, empty: !children } onclick={ parent.toggle }></i>
        <i class="tree-item-icon"></i>
        <div onclick={ parent.leftClick } class={ tree-item-name : true } title={ name }>{ name }</div>
        <!--<div class={ tree-item-back : true, active: deptId == parent.rootParent.currentId }></div>-->
        <ul class="tree-child-wrap" if={ children }>
            <tree data={ children } if={ children }></tree>
        </ul>
    </div>

    var self = this;
    self.config = self.opts.opts || self.opts;

    /*
     *  将列表数据转换为树型结构 
     */
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
        //tree[0].opened = true;
        return tree;
    };
    
    /*
     * 非树结构需要进行dataHandle处理
     */
    if (self.config.handleData) {
        self.data = self.dataHandle(self.config.data);
    }
    else {
        self.data = self.config.data;
    }
    
    /*
     * 得到根节点的config, 命名为rootConfig
     */
    if (self.config.root) {
        self.rootConfig = self.config;
    }
    else {
        self.rootConfig = self.parent.rootConfig || self.parent.parent.rootConfig;
    }
    
    /*
     * 左键点击回调
     */
    leftClick(e) {
        var leftClick = self.rootConfig.onLeftClick;
        if (leftClick) {
            leftClick(e.item, e.target);
        }
    }
    
    /*
     * 展开收起
     */
    toggle(e) {
        if (e.item.opened === true) {
            e.item.opened = false;
        }
        else {
            e.item.opened = true;
        }
    }
</tree>