##loading
用于内容自动居中，如果无内容，则展示默认的loading动画

####HTML结构

```html
    <div class="container">
        <loading id="loading1"></loading>
    </div>
    <div class="container">
        <loading id="loading2">
            <img src="loading.gif" height="60">
            <!-- 注意，内容需要有高度 -->
        </loading>
    </div>
```

####JavaScript

```JS
    riot.mount('loading');
    document.getElementById('loading1').show(); //控制展示
    document.getElementById('loading1').hide(); //控制隐藏

```

####Demo
