##Paginate
分页组件可以由配置数据直接生成，可以配置跳页回调、展示数量等数据
####HTML结构

```html
<div class="demo">
    <paginate></paginate>
    <p>The page number is <b id="page-number"></b></p>
</div>
```
####JavaScript

```JavaScript
var pageOpts = {
    count: 120,     //总条目数
    pagesize: 10,   //每页的条目数
    pageCount: 12,  //页数，非必须，会覆盖总条数/每页条数的计算结果
    showNumber: 5,  //分页格的最大数量
    currentPage: 1, //初始化的页码，默认是1
    needInit: true, //初始化时是否执行callback，默认false
    callback: function(index) {
        document.getElementById('page-number').innerHTML = index;
    }               //页数变化时的回调，会将跳转页码作为参数传入
}
riot.mount('.demo paginate', pageOpts);
```

####Demo

[Example](../../../demos/paginate.html)