## 关于iToolkit
iToolkit是一系列常用控件的集合，基于[Riot]()框架进行构建, 主要为了快速构建后台系统，针对后台系统中常用的表格、表单、树、分页等应用场景进行封装, 可以根据后台数据直接生成视图。
####如何引用

- 引入核心样式文件
- 引入JS文件
```html
    <link rel="stylesheet" href="build/themes/simple_pc.css">
    <script src="build/iToolkit_pc.js">
```

####基本调用方式
- 使用相应的HTML标签
- riot.mount()的第一个参数是一个字符串，写法等同于css选择器。
- riot.mount()的第二个参数统一是一个object。
- 数据统一使用data字段，其他配置项请参考文档。

```html
    <div id="tree-wrap" class="demo">
        <tree></tree>
    </div>
```

```JS
    $.ajax({
        url: '/test',
        success: function(data) {
            riot.mount('#tree-wrap tree', {data: data, root: true});
        }
    })
    //注：这里假设用户使用jQuery进行ajax请求，iToolkit本身不提供该api
```

####循环和表达式
在诸如super-div, super-form, modal等组件中，用户可以在其中填入自己需要的内容，并且可以根据传入的data来进行展示和控制。

目前支持if、show、hide、each四种指令

```html
    <super-div>
        <div if="{ data.exist }">只有管理员能看</div>
        <div show="{ data.exist }">想看其实也能看</div>
        <div hide="{ !data.exist }">你看不见我</div>
        <table>
            <tr each="{ data.data }">
                <td>{ name }</td>
                <td>{ age }</td>
                <td>{ score }</td>
            </tr>
        </table>
        <div each="{ name, value in obj }">{ name } = { value }</div>
    </super-div>
```

支持绝大部分形式的表达式：
```JS
    { title || 'Untitled' }
    { results ? 'ready' : 'loading' }
    { new Date() }
    { message.length > 140 && 'Message is too long' }
    { Math.round(rating) }
```