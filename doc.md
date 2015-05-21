## iToolKit接口文档
### Table
- 可以由数据直接生成表格，支持变量组装、表头定义、列宽定义。
- 可以进行排序、追加、清空、加载新数据、删除指定项等功能。

#### 表格生成器示例代码：
[Demo](http://be-fe.github.io/iToolkit/iToolkit_pc.html)
HTML:

    <table-view>
        <rcol name="city"><a href="<%= desc%>"><%= city%></a></rcol>
        <rcol name="desc" width="100px"></rcol>
        <rcol name="name" alias="姓名"></rcol>
    </table-view>

JavaScript:

    var tableOpts = {
        data: [
            {city: 'Beijing', name: 'Sherman', desc: 'hehehehehhe'},
            {city: 'Beijing', name: 'Sherman', desc: 'hehehehehhe'},
            {city: 'Beijing', name: 'Sherman', desc: 'hehehehehhe'}
        ]
    }
    riot.mount('table-view', tableOpts);
    riot.mount('rcol');

#### 表格操作示例代码：
JavaScript:

    var dom = document.querySelector('table-view');
    dom.loadData([{city: 'LuoYang', name: 'mudan', desc: 'It is pretty'}]);  //加载新数据
    dom.appendData({city: 'LuoYang', name: 'mudan', desc: 'It is pretty'}); //追加数据
    dom.deleteData('city', 'LuoYang'); //删除指定数据
    dom.clearData();  //清空表格
    dom.orderData('city'); //根据字段city进行正序排列
    dom.reverseData('city'); //根据字段city进行倒序排列

### Form
- 提供了模板功能和常用指令，包括if、show、 each等
- 提供了ajax提交功能
- 提供了防连续点击功能
- 提供了表单验证功能

#### 示例代码
[Demo](http://be-fe.github.io/iToolkit/iToolkit_pc.html)
HTML:

    <super-form action="/test">
        <input name="t1" value="{ data.a }" show="{ data.a==1 }">
        <input name="t2" value="{ data.b }" onsubmit="{ valid({max: 10}) }">
        <input name="t3" value="{ data.b }" oninput="{ valid({min: 10}) }">
        <input type="submit" value="提交">
    </super-form>

JavaScript:

    var formOpts = {
        data: {
            a: 1,
            b: 'hehe'
        },
        callback: function() {
            alert('success');
        },
        errCallback: function(params) {
            alert("error, params:" + params);
        },
        normalSubmit: true  //true为正常表单提交，不配置或false为ajax提交
        submitingText: 
    }
    riot.mount('super-form', formOpts);

### Paginate
- 分页组件可以配置总数、每页展示数量、页码显示数量、页码跳转回调。

####示例代码
[Demo](http://be-fe.github.io/iToolkit/iToolkit_pc.html)
HTML:
    
    <paginate></paginate>

JavaScript:

    var pageOpts = {
        count: 50,
        pagesize: 10,
        showNumber: 5,
        callback: function(index) {
            document.getElementById('page-number').innerHTML = index;
        }
    }
    riot.mount('paginate', pageOpts);

### Tree
- 可以直接根据数据生成树结构。
- 树结构组件可以配置左键点击回调、数据。

#### 示例代码
[Demo](http://be-fe.github.io/iToolkit/iToolkit_pc.html)
HTML:
    
    <tree></tree>

JavaScript:

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
        root: true,              //必须配置为true，标志位。
        handleData: true,        //拉平的数据使用true，本身就是树结构的数据使用false
        name: 'title',           //展示树名称的字段名
        onLeftClick: function(item, target) {
            alert('This item\'s id is: ' + item.id);
        }                        //左键点击的回调函数
    }
    riot.mount('tree', treeOpts);

### Modal
- 模态框组件可以定制宽、高、title
- 可以支持内部模板

####示例代码
[Demo](http://be-fe.github.io/iToolkit/iToolkit_pc.html)
HTML:
    
    <modal id="modal-demo">
        <h1>welcome!</h1>
        <p>welcome, king under the montain!</p>
        <p>{ data.desc }</p>
    </modal>
    <button modal-open-target="modal-demo">打开模态框</button>

JavaScript:

    var modalOpts = {
        height: 300,
        width: 300,
        title: '模态框demo',
        data: {
            desc: 'hehehe'
        }
    }
    riot.mount('modal', modalOpts);
