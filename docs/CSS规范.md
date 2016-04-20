## Class命名规范
###Common class
- base-color,
- inline-block, block, inline
- pull-left, pull-right,

###Variable
@base-color
@base-text-color
@base-border
@base-font

@btn

@btn-primary
@btn-text-primary

@btn-default
@btn-text-default

@btn-success
@btn-text-success

@btn-error
@btn-text-error

@btn-warning
@btn-text-warning

@btn-text-light
@btn-text-dark

@btn-hover
@btn-text-hover
@btn-disable
@btn-text-disable
@btn-active
@btn-text-active

@link
@link-hover
@link-active
@link-readed


###组件内命名规范
- 组件内统一加一层div作为命名空间，命令规则：项目名 + 组件名
- 命名空间内，根据具体含义进行命名
- 需要绑定JS操作的id/class, 统一添加JS前缀。
- 组件在调用时，指定使用的ui class

####例如:
    <paginate>
        <div class="itoolkit-paginate">
            <div class="goto first">
                ......
            </div>
            
            <div class="goto prev">
                ......
            </div>
            
            <button class="js-handle btn btn-primary">js操作</button>
        </div>
            
        document.querySelector('js-handle').onclick = function() {
            ......
        }
    </paginate>
    
    调用时：
    <paginate class="eui"></paginate>
    
    或者使用：
    <body class="eui">
        <paginate></paginate>
    </body>

