##super-form
可以提供ajax提交、防连击保护、表单校验、数据模板、常用指令等五大功能, 有丰富的配置项，并且提供了一套完整的默认效果。

####HTML

```html
<div class="demo">
    <super-form action="/test">
        <input type="text" name="t1" value="{ data.a }" if="{ data.a==2 }">
        <label>
            Must be: 
            <input type="text" name="present" value="1" valid="present" max="10">
        </label><br>
        <label>
            Must be: 
            <input type="text" name="ee" value="1">
        </label><br>
        <label>
            email: 
            <input type="text" name="email" value="xieyu@baidu.com" valid="email">
        </label><br>
        <label>
            url: 
            <input type="text" name="url" value="http://www.baidu.com" valid="url">
        </label><br>
        <label>
            mobile: 
            <input type="text" name="mobile" value="13927678767" valid="mobile">
        </label><br>
        <label>
            RegExp:
            <input type="text" name="t3" value="test" valid="/test/">
        </label><br>
        <label>
            RegExp2:
            <input type="text" name="idcard" value="41030319880612000" customValid="isIDCard" allowEmpty="true">
        </label><br>
        <label>
            text more than 2: 
            <input type="text" name="t4" value="{ data.b }" min="3">
        </label><br>
        <label>
            text less than 9: 
            <input type="text" name="t5" value="good! There it is!" max="9">
        </label><br>
        <label>
            text less than 9 and more than 2: 
            <input type="text" name="t5" value="good! There it is!" max="9" min="2">
        </label><br>
        <label>
            text allow empty: 
            <input type="text" name="t6" value="good! There it is!" min="7" allowEmpty="true">
        </label><br>
        <label>
            number int: 
            <input type="text" name="n1" value="1" valid="int">
        </label><br>
        <label>
            number float: 
            <input type="text" name="n2" value="1" valid="float">
        </label><br>
        <label>
            int more than 2: 
            <input type="text" name="n3" value="1" valid="int" min="2">
        </label><br>
        <label>
            int less than 9: 
            <input type="text" name="n4" value="1" valid="int" max="9">
        </label><br>
        <label>
            int less than 9 and more than 2: 
            <input type="text" name="n5" value="1" valid="int" max="9" min="2">
        </label><br>
        <label id="test">
            beforeSubmit:
            <input type="text" name="n7" value="777" valid="int" min="1" max="65535"> <input type="text" name="n8" value="666" valid="int" min="1" max="65535">
        </label><br>
        <label>
            select:
            <select name="select">
                <option value="{ data.a }">{ data.a }</option>
                <option value="{ data.b }">{ data.b }</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
            </select>
        </label><br>
        <input type="submit" class="btn btn-primary" value="提交">
    </super-form>
    <button class="btn btn-primary" onclick="removeTip()">清除提示</button>
    <button class="btn btn-primary" onclick="reload()">reload</button>
</div>
```

####JavaScript

```JavaScript
var formOpts = {
    data: {
        a: 1,
        b: 'he'
    },
    valid: true,                //是否执行校验
    realTime: true,             //是否执行实时监测
    complete: function() {      //提交完成的回调，可不填
        alert('complete');
    },
    callback: function() {      //提交成功的回调
        alert('success');      
    },
    errCallback: function(params) {   //提交失败的回调
        alert("error, params:" + params);
    },
    beforeSubmit: function($invalid) {//在提交前执行的额外操作
        removeThisTip('test');
        var passed = checkPass('test');
        if (passed) {
            addThisTip('test', '通过', 'valid-pass');
        }
        else {
            addThisTip('test', '值1不能大于值2', 'valid-failed')
            $invalid.push(true); //阻止提交
        }
    },
    normalSubmit: false,              //是否为ajax提交, 默认为true
    onValidRefuse: function(dom, message) {        //验证失败的回调函数,非必需,组件提供了默认动作
       alert(message);  //覆盖默认动作
    },
    onValidPass: function(dom, message) {          //验证成功的回调函数,非必需,组件提供了默认动作
        alert(message);
    },
    maxWarning: function(max) {
        return '不得超过' + max + '个字符';          //字符长度验证失败的提示内容,非必须,组件提供了默认提示信息
    },
    minWarning: function(min) {
        return '不得少于' + min + '个字符';          //字符长度验证失败的提示内容,非必须,组件提供了默认提示信息
    },
    bpWarning: function(min, max) {
        return '只允许' + min + '-' + max + '个字符';//字符长度验证失败的提示内容,非必须,组件提供了默认提示信息
    },
    minNumWarning: function (min) {
        return '不得小于' + min;                     //数字长度验证失败的提示内容,非必须,组件提供了默认提示信息
    },
    maxNumWarning: function (max) {
        return '不得大于' + max;                     //数字长度验证失败的提示内容,非必须,组件提供了默认提示信息
    },
    numBpWarning:function (min, max) {            //数字长度验证失败的提示内容,非必须,组件提供了默认提示信息
        return '输入数字应在' + min + '-' + max + '之间';
    },
    submitingText: 'submiting...',   //提交中状态文字，默认为“提交中...”
    passClass: 'pass',          //验证通过时为input添加的class， 默认为valid-pass
    failedClass: 'failed',      //验证失败时为input添加的class，默认为valid-failed
    forbidTips: true            //验证通过时禁止提示
}

riot.mount('.demo super-form', formOpts);

var theForm = document.querySelector('.demo super-form');
console.log(theForm.getData()); //返回obj形式的key-value表单数据。

function removeTip() {    //清除提示信息，EL.removeTips
    theForm.removeTips();
}

function reload() {
    var data = {a: 'hehe', b: 'hehehe'};
    theForm.loadData({});  //ensure your data can be reset;
    theForm.loadData(data);
}

function removeThisTip(id) {
    var context = document.getElementById(id);
    var elems = context.getElementsByTagName('input');
    var tips = context.getElementsByClassName('tip-container');
    if (tips && tips.length) {
        del();
    }
    function del() {
        for (i = 0; i < tips.length; i++) {
            tips[i].parentNode.removeChild(tips[i]);
            if (tips.length) {
                del();
            }
        }
    }
    for (var i = 0; i < elems.length; i++) {
        utils.removeClass(elems[i], 'valid-pass');
        utils.removeClass(elems[i], 'valid-failed');
    }
}

function checkPass(id) {
    var context = document.getElementById(id);
    var elems = context.getElementsByTagName('input');
    var first = elems[0];
    var second = elems[1];
    if (parseInt(first.value, 10) > parseInt(second.value, 10)) {
        return false;
    }
    return true;
}

function addThisTip(id, message, className) {
    var context = document.getElementById(id);
    var elems = context.getElementsByTagName('input');
    for (var i = 0; i < elems.length; i++) {
        elems[i].className = className;
    };
    var tipContainer = document.createElement('span');
    tipContainer.className = className === 'valid-pass' ? 'tip-container success' : 'tip-container';
    tipContainer.innerHTML = message;
    context.appendChild(tipContainer);
}

window.isIDCard = {
    regExp: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/,
    message: '不是合法的身份证号码'
}  //在window上定义一个全局的校验规则，在html上用customValid属性调用。

EC.on('submit_success', function(result) {
    console.log(result);                   
}); //提交成功(状态码200)后会抛出'submit_success'这个事件，监听该事件，执行一些公共的处理方法。
```

####Demo
[FormInModal](../../../demos/FormInModal.html)  
[formWithBeforeSubmit](../../../demos/formWithBeforeSubmit.html) 


另外，我们提供了verification resolev属性和orient属性以实现其他验证。

#### HTML
```html
<div class="demo">
    <super-form action="/test">
        <div>
            <h4>其他验证</h4>
            <div>
                初始端口号：<input type="text" name="intStart" valid="int" min="0" max="65535" vr="selectPorts::end,第二个端口号不能小于第一个端口号" id="start">
            </div>
            <div>
                结束端口号：<input type="text" name="intEnd" valid="int" min="0" max="65535" vr="selectPorts::start,第二个端口号不能小于第一个端口号" id="end">
            </div>
        </div>
        <textarea name="area" min="1" max="20"></textarea>
        <input type="submit" class="btn btn-primary" />
    </super-form>
</div>
```

vr属性的值书写方式为vr="method::param1,param2,param3,...params"。使用vr属性调用的方法，内部this指向该元素。
当return false或方法内部出错时，验证不通过
####JavaScript

```JavaScript
/*
 *  super form 提交
 */
var formOpts = {
    normalSubmit: false,
    realTime: true,    //是否实时验证
    complete: function() {
        alert('complete');
    },
    callback: function() {
        alert('success');
    },
    errCallback: function(params) {
        alert("error, params:" + params);
    }
};
riot.mount('.demo super-form', formOpts);
iToolkit.methodRegister('selectPorts', function (selector, tips) {
    var start,form,parent,end;
    if (selector === 'start') {
        end = this;
        start = document.getElementById(selector);

    }
    else {
        start = this;
        end = document.getElementById(selector);
    }
    form = this.form;
    parent = form.parentNode;
    if (end.value <= start.value) {
        parent.onValidRefuse(end, tips);
        return false;
    }
    parent.onValidPass(start, '');
    parent.onValidPass(end, 'passed');
    return true;
});
```

####Demo 
[formWithVerificationResolve](../../../demos/formWithVerificationResolve.html) 