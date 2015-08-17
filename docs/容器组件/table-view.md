##table-view

表格组件可以根据数据生成表格，使用rcol标签控制字段的排序、表头名、内容的拼接、列的宽度，使用参数配置表头展示、固定等。

表格组件还支持加载、追加、情况、删除、排序等功能函数。

####HTML结构
```html
<div class="demo">
    <table-view>
        <rcol name="city">
            <div>
                <a href="<%= testMethod(desc) %>" hide="<%= status==1%>" onclick="Test.test('<%= 'sss'||desc%>')"><%= city%></a>
                <a href="<%= testMethod(desc) %>" hide="<%= !status==1%>" onclick="Test.test('<%= 'sss'||desc%>')"><%= city%></a>
            </div>
        </rcol>
        <rcol name="desc" width="200px"></rcol>
        <rcol name="name" alias="姓名"></rcol>
        <rcol alias="测试"><button class="btn btn-primary">测试</button></rcol> <!-- 不对应任何字段的情况-->
        <rcol name="list" alias="列表">
            <ul if="<%=list%>">
                <li each="<%=list%>"><%=a%></li>
            </ul>
        </rcol>
    </table-view>
</div>
```

####JavaScript
```JavaScript
var tableOpts = {
    data: [
        {city: 'BeiJing', name: 'Sherman', desc: 'he is a Tank'},
        {city: 'ShangHai', name: 'Ruth', desc: 'she is a nice girl'},
        {city: 'ChengDu', name: 'Billy', desc: 'hehehe'},
        {city: 'GuangZhou', name: 'Silly', desc: 'bad weather!'}
    ],
    class: 'table',    //table上添加的class，可配合Bootstrap
    showHeader: true,  //是否展示表头
    cut: true,         //内容超长是否省略
    newline: false,    //内容超长是否换行
}
iToolkit.tableExtend.testMethod = function(str) {
    return str + 'aaaa';
}  //table cell内的方法需要在该命名空间下注册，以处理相应列的数据,方法注册要在mount动作之前。

riot.mount('.demo  table-view', tableOpts);
```
####表格操作：

```JavaScript
var dom = document.querySelector('table-view');
dom.loadData([{city: 'LuoYang', name: 'mudan', desc: 'It is pretty'}]);  //load new data
dom.appendData({city: 'LuoYang', name: 'mudan', desc: 'It is pretty'}); //append data
dom.deleteData('city', 'LuoYang'); //delete data
dom.clearData();  //clear data
dom.orderData('city'); //order by 'city'
dom.reverseData('city'); //reverse by 'city'
dom.hide('city'); //hide 'city' col
dom.show('city'); //show 'city' col
```

####Demo
[Table](../../../demos/Table.html)