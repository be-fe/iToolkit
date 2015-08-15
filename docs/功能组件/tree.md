## Tree

树结构组件可以直接根据数据生成树结构，支持一维数组结构和树状结构的数据，可以配置点击回调。
####HTML结构

```html
    <div id="tree-wrap" class="demo">
        <tree></tree>
    </div>
```
####JavaScript

```JavaScript
    var treeOpts = {
        data: [
            {id: 1, pid: null, title: 'root'},
            {id: 2, pid: 1, title: 'item1'},
            {id: 3, pid: 1, title: 'item2'},
            {id: 4, pid: 2, title: 'item3'},
            {id: 5, pid: 1, title: 'item4'},
            {id: 6, pid: 3, title: 'item5'},
            {id: 7, pid: 2, title: 'item6'},
        ],
        root: true,         //标示符，必须为true
        handleData: true,   //data为一维数组，选true, data为树结构，选false
        name: 'title',      //名称字段在接口中的字段名
        onLeftClick: function(item, target) {     
            alert('This item\'s id is: ' + item.id);
        }
        //左键点击的回调。第一个参数为对应的数据item, 第二个参数为对应的dom
        showCheck: true,   //是否展示checkbox, 默认为false;
        onCheck: function(item, target) {
            alert(item.id + 'checked');
        },  //checkbox选中时的回调
        onUnCheck: function(item, target) {
            alert(item.id + 'unchecked');
        }  //checkbox取消时的回调
    }
    riot.mount('.demo tree', treeOpts);
```

#### Demo
[Example]()