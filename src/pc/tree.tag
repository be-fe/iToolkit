<tree-item>
    <input type="checkbox" checked="{ selected }" if="{ parent.rootConfig.showCheck }" onchange="{ checkHandle }"/>
    <i class="tree-item-arrow { open: opened }" onclick="{ toggle }" if={ children }></i>
    <i class="tree-item-icon" if="{ children }"></i>
    <div onclick="{ leftClick }">{ name }</div>
    
    var self = this;

    self.originData = function(id) {
        var originDatas = self.parent.data;
        var originData;
        for (i = 0; i < originDatas.length; i++) {
            if (originDatas[i].id === id) {
                originData = originDatas[i];
                break;
            }
        }
        return originData
    }
    
    /*
    *  选中所有子元素
    */
    self.selectchildren = function(item, bool) {
        var selectChildItem = function(item) {
            if (item && item.children) {
                for(var i = 0; i < item.children.length; i++) {
                    item.children[i].selected = bool;
                    selectChildItem(item.children[i]);
                }
            }
        };
        selectChildItem(item, bool);
        self.parent.treeroot.update();
    };

    /*
    *  取消所有父元素
    */
    self.cancelParent = function(item) {
        var cancelParentSelect = function(item) {
            if (item && item.pnode) {
                item.pnode.selected = false;
                cancelParentSelect(item.pnode);
            }
        };
        cancelParentSelect(item);
        self.parent.treeroot.update();
    };

    /*
     * checkbox选中回调
     */
    checkHandle(e) {
        var originData = self.originData(self.id);
        var config = self.parent.rootConfig
        var checkCb = config.onCheck;
        var uncheckCb = config.onUnCheck;
        if (self.selected) {
            originData.selected = false;
            uncheckCb && uncheckCb(originData, e.target);
            //如果设置为联动，则取消子，父相应也取消，选中父，也自动选中子
            if (config.link) {
                self.selectchildren(self, false);
                self.cancelParent(self);
            }
        }
        else if (!self.selected) {
            originData.selected = true;
            checkCb && checkCb(originData, e.target);
            if (config.link) {
                self.selectchildren(self, true);
            }
        }
    };
    
    /*
     * 展开收起
     */
    toggle(e) {
        var originData = self.originData(self.id);
        if (originData.opened === true) {
            originData.opened = false;
            self.parent.opened = false;
        }
        else {
            originData.opened = true;
            self.parent.opened = true;
        }
        self.parent.treeroot.update();
    }

    /*
     * 左键点击回调
     */
    leftClick(e) {
        var originData = self.originData(self.id);
        var config = self.parent.rootConfig;
        if (config.folder && config.children) {
            if (originData.opened === true) {
                originData.opened = false;
            }
            else {
                originData.opened = true;
            }
        }
        else {
            var leftClick = config.onLeftClick;
            if (leftClick) {
                leftClick(originData, e.target);
            }
        }
    }

</tree-item>

<tree>
    <div class="tree-item-wrap" each="{ data }" onselectstart="return false" ondragstart="return false">
        <tree-item class="tree-item-row { root: level==1 }" style="padding-left: { countPadding(level) }"></tree-item>
        <ul class="tree-child-wrap" if="{ _item.opened && children }">
            <tree data="{ children }"></tree>
        </ul>
    </div>
    <script>
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
                node.pnode = parent;
                parent.children.push(node);
            }
            else {
                tree.push(node);
            }
        });
        //计算层级
        var countLevel = function(tree, level) {
            var level = level + 1;
            tree.forEach(function(item) {
                item.level = level - 1;

                if (item.level < (self.config.openLevel + 1)) {
                    item.opened = true;
                }
                if (item.children) {
                    countLevel(item.children, level);
                }
            })
        };
        countLevel(tree, 1);
        return tree;

    };
    
    /*
     * 非树结构需要进行dataHandle处理, 得到根节点的config, 命名为rootConfig
     */
    if (!self.parent || self.parent.root.tagName !== 'TREE') {
        if (self.config.handleData) {
            var tree = self.dataHandle(self.config.data);
            self.data = tree;
        }
        self.rootConfig = self.config;
        self.treeroot = self;
    }
    else {
        self.data = self.config.data;
        self.rootConfig = self.parent.rootConfig || self.parent.parent.rootConfig;
        self.treeroot = self.parent.treeroot || self.parent.parent.treeroot;
        //console.log(self.data);
    }
    self.treeroot.update();
    
    
    /*
     * 计算每一行的padding值
     */
    countPadding(level) {
        var padding = self.rootConfig.padding || 20;
        return (level - 1) * padding + 'px';
    }
    
    </script>
</tree>