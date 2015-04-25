<tree>
    <div class="tree-item-wrap" each={ data }>
        <i class={ tree-item-arrow: true, open: opened, empty: !children } onclick={ parent.toggle }></i>
        <i class="tree-item-icon"></i>
        <div onclick={ parent.changeUser } onmousedown={ parent.rightClick } oncontextmenu={ parent.nomenu } class={ tree-item-name : true, active: deptId == parent.rootParent.currentId } title={ name }>{ name }</div>
        <div class={ tree-item-back : true, active: deptId == parent.rootParent.currentId } onclick={ parent.changeUser } onmousedown={ parent.rightClick } oncontextmenu={ parent.nomenu }></div>
        <ul class="tree-child-wrap" if={ children }>
            <treeview data={ children } if={ children }></treeview>
        </ul>
    </div>

    var self = this;
    var config = self.opts.opts || self.opts;
    self.data = config.data;

</tree>