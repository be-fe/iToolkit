##modal
可以配置模态框的高度、宽度、title; 并且可以将相关的数据带入模板

####HTML结构
```html
<div class="demo">
    <button modal-open-target='modal-demo' class="btn btn-success">Open Modal</button>
    <modal id="modal-demo">
        <h1>welcome!</h1>
        <p>welcome, king under the montain!</p>
        <p>{ data.desc }</p>
    </modal>
</div>
```

####JavaScript

```JavaScript
var modalOpts = {
    height: 300,  //如果不填，height为auto;
    width: 300,
    title: 'Modal demo',
    data: {
        desc: 'hehehe'
    }
}
riot.mount('.demo modal', modalOpts);
document.querySelector('#modal-demo').open();  //JS控制模态框打开
document.querySelector('#modal-demo').close(); //JS控制模态框关闭
document.querySelector('#modal-demo').loadData(newData, colname); //更新数据，colname不填默认更新data;
```

####Demo