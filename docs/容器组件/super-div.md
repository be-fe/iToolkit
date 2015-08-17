##super-div
为super-div容器内的元素提供模板、数据绑定和基础指令.

####HTML结构
```html
<div class="demo">
    <super-div>
        <h4 onclick="{ warning }">{ data.title }</h4>
        <p>{ data.desc }</p>
        <ul>
            <li each="{ data.list }" onclick="{ parent.changeItem }">{ name }</li>
        </ul>
    </super-div>
</div>
```

####JavaScript

```JavaScript
var divOpts = {
    data: {
        title: '复仇者联盟',
        desc: '讲述了超级英雄拯救世界的故事。',
        list: [{name: "钢铁侠"},{name: "绿巨人"},{name: "美国队长"},{name: "黑寡妇"},{name:"鹰眼"}]
    },
    warning: function(e) {     //可以定义函数，供事件调用
        console.log(e.target);  //对应的dom元素
        console.log(e.item);    //each情况下数组对应的数据
        alert('test');
    },
    changeItem: function(e) {     //可以定义函数，供事件调用
        console.log(e.item);    //each情况下数组对应的数据
        e.item.name="test";
    }
}
riot.mount('.demo super-div', divOpts);

var dom = document.querySelector('.demo super-div');
dom.reload(); //重新渲染数据，如果有data-get或data-jsonp则会重新请求
dom.loadData({
    title: '复仇者联盟2',
    desc: '讲述了超级英雄拯救世界的故事2。',
    list: [{name: "钢铁侠"},{name: "绿巨人"},{name: "美国队长"},{name: "黑寡妇"},{name:"鹰眼"}]
}, 'data')  //第一个参数为新的数据，第二个参数为数据的字段名，默认为data
```

super-div还内置了httpGet和jsonp两种自动映射接口数据的方式：

####HTML结构
```html
<super-div id="http-get" data-get="/data.json">
    <h4 onclick="{ warning }">{ data.title }</h4>
    <p>{ data.desc }</p>
    <ul>
        <li each="{ data.list }" onclick="{ parent.changeItem }">{ name }</li>
    </ul>
</super-div>
<super-div id="jsonp" data-jsonp="/data.json">
    <h4 onclick="{ warning }">{ data.title }</h4>
    <p>{ data.desc }</p>
    <ul>
        <li each="{ data.list }" onclick="{ parent.changeItem }">{ name }</li>
    </ul>
</super-div>
```

####JavaScript

```JavaScript
riot.mount('#http-get', {params: {name: "Tom"}}); //params里填写url query参数
riot.mount('#jsonp', {params: {name: "Tom"}});
```

####Demo
[DivGetData](../../../demos/DivGetData.html)    
[TableInDiv](../../../demos/TableInDiv.html)  