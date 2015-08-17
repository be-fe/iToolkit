##goto-top
返回顶部功能，有滑动过程

####HTML
如果`<goto-top>`标签内无内容，则使用默认的图标，如果插入其他标签，则使用用户自定义的内容。
```html
<div class="demo">
    <goto-top></goto-top>
</div>

<div class="demo">
    <goto-top>
        <div>gotoTop</div>
    </goto-top>
</div>
```
####JavaScript
可以使用`bottom`和`right`配置位置
```JS
    riot.mount('goto-top', { bottom: '10px', right: '4px' });
```