iToolkit
========

iToolkit是一系列常用控件的集合，基于Riot进行构建，iToolkit拥有统一的配置方式：
例如：

    <tree></tree>
    riot.mount('tree', config);

可以根据选择器选择mount指定的元素：
    
    riot.mount('#container tree', config);

每个组件的配置项各不相同，但是基本用法是一致的,统一采用data字段包装数据：

    tableOpts: {
        data: [{name: 'Sherman'}],
        fixHeader: true,
        class: 'table'
    }

### 为什么要开发iToolkit？
1. 统一的调用方式,数据直接生成视图。
2. 到处可用，无论原网站是采用何种技术方案，都可以加入使用
3. 依赖库小，riot压缩后只有3.5KB, 适用于移动端开发、老项目改造。
4. 样式和逻辑完全分离，样式上具有较高的灵活性。
5. 语义清晰，源码更容易维护。

### PC端组件
- Tree: 支持一维数组和树两种数据结构。
- Tab
- Table: 支持定义字段、排序、表头、列宽，可以进行数据加载、追加、删除、排序等操作。
- Paginate: ajax前端分页。
- Modal: 可以定制尺寸和title文字, 支持模板和数据绑定
- super-form: 属性和原生form完全一致，支持ajax提交、数据校验、防连击、模板和数据绑定。
- super-div: super-div内的内容支持模板和数据绑定。

### 移动端组件
规划中......

### 文档与Demo
[文档](https://github.com/BE-FE/iToolkit/blob/master/doc.md)
[Demo](http://be-fe.github.io/iToolkit/iToolkit_pc.html)
[新版文档](http://be-fe.github.io/iToolkit/docs/book/index.html)  