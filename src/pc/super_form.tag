<super-form>
    <form onsubmit={ submit } >
        <yield>
    </form>

    var self = this;
    var EL = self.root;
    var config = self.opts.opts || self.opts;
    var keyWords = ['insertTip', 'ajaxSubmit', 'submit'];   //保留字，不被覆盖

    self.presentWarning = '必填';
    self.emailWarning = '邮箱格式错误';
    self.mobileWarning = '手机格式错误';
    self.urlWarning = '网址格式错误';
    self.successTips = '通过';
    self.regWarning = '字段不符合验证规则';

    self.passClass = config.passClass || 'valid-pass';
    self.failedClass = config.failedClass || 'valid-failed';

    self.on('mount', function() {
        EL.style.display = 'block';
    })

    EL.loadData = function(newData, colName){
        colName = colName || 'data';
        self[colName] = newData;
        self.update();
    }

    //获取表单的obj
    self.checkExistKey = function(obj, key, value) {
        if (obj.hasOwnProperty(key)) {
            if (utils.isArray(obj[key])) {
                obj[key].push(value);
            }
            else {
                var arr = [];
                arr.push(obj[key]);
                arr.push(value)
                obj[key] = arr;
            }                  
        }
        else {
            obj[key] = value;
        }
    }

    self.getData = EL.getData = function(){
        var elems = self.root.getElementsByTagName('form')[0].elements;
        var params = {};
        for (var i = 0; i < elems.length; i++) {
            if (elems[i].name) {
                if (elems[i].tagName === "SELECT") {
                    var selected = elems[i].selectedOptions;
                    for (j = 0; j < selected.length; j++) {
                        value = selected[j].value;
                        self.checkExistKey(params, elems[i].name, encodeURIComponent(value));
                    }
                } 
                else if (elems[i].type === "checkbox" || elems[i].type === "radio"){
                    if (elems[i].checked) {
                        value = elems[i].value;
                        self.checkExistKey(params, elems[i].name, encodeURIComponent(value));
                    }
                }
                else {
                    value = elems[i].value;
                    self.checkExistKey(params, elems[i].name, encodeURIComponent(value));
                }
            }
        }
        return params;
    }
    
    /*
     *  将config中的属性浅拷贝到Tag对象上。
     *  
     */

    for (i in config) {
        if (keyWords.indexOf(i) < 0) {
            self[i] = config[i];
        }
    }
    self.data = config.data;
    self.submitingText = config.submitingText || '提交中...';
    if (config.valid === undefined) {
        config.valid = true;
    }
    
    self.maxWarning = config.maxWarning || function(n) {
        return '不得超过' + n + '个字符';
    }
    self.minWarning = config.minWarning || function(n) {
        return '不得小于' + n + '个字符';
    }
    
    /*
     * 移除提示
     */
    self.removeTips = function(elems) {
        var root = self.root;
        var tips = root.getElementsByClassName('tip-container');
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
            utils.removeClass(elems[i], self.passClass);
            utils.removeClass(elems[i], self.failedClass);
        }
    }
    
    /*
     *  插入提示
     */
    self.insertTip = function(dom, message, className){
        var tip = dom.nextElementSibling;
        if (tip && tip.className.match(/tip-container/)) {
            dom.parentNode.removeChild(tip);
        }
        var tipContainer = document.createElement('span');
        tipContainer.className = className;
        tipContainer.innerHTML = message;
        utils.insertAfter(tipContainer, dom);
    }

    self.onValidRefuse = config.onValidRefuse || function(dom, errorTips) {
        self.insertTip(dom, errorTips, 'tip-container');
        utils.removeClass(dom, self.passClass);
        utils.addClass(dom, self.failedClass);
    }

    self.onValidPass = config.onValidPass || function(dom, successTips) {
        self.insertTip(dom, successTips, 'tip-container success');
        utils.removeClass(dom, self.failedClass);
        utils.addClass(dom, self.passClass);
    }
    

    /*
     * ajax提交
     */
    self.ajaxSubmit = function(elems, url) {
        var params = '';
        for (var i = 0; i < elems.length; i++) {
            if (elems[i].name) {
                if (elems[i].tagName === "SELECT") {
                    var selected = elems[i].selectedOptions;
                    for (j = 0; j < selected.length; j++) {
                        value = selected[j].value;
                        params += elems[i].name + "=" + encodeURIComponent(value) + "&";
                    }
                } 
                else if (elems[i].type === "checkbox" || elems[i].type === "radio"){
                    if (elems[i].checked) {
                        value = elems[i].value;
                        params += elems[i].name + "=" + encodeURIComponent(value) + "&";
                    }
                }
                else {
                    value = elems[i].value;
                    params += elems[i].name + "=" + encodeURIComponent(value) + "&";
                }
            }
            if (elems[i].type === "submit" && elems[i].tagName !== "BUTTON") {
                var submitbtn = elems[i];
                var submitText = submitbtn.value || submitbtn.innerText;
                submitbtn.disabled = 'disabled';
                submitbtn.value = self.submitingText;
            }
        }
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(params);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4) {
                self.removeTips(elems);
                submitbtn.value = submitText;
                submitbtn.disabled = false;
                if (config.complete && typeof config.complete === 'function') {
                    config.complete();
                }
                if (xmlhttp.status === 200) {
                    try {
                        var result = JSON.parse(xmlhttp.responseText);
                        config.callback && config.callback(result);
                        EC.trigger('submit_success', result);
                    }catch(e){
                        console.log(e);
                    }
                }
                else {
                    config.errCallback && config.errCallback(params);
                    EC.trigger('submit_error', params);
                }
            } 
        };
    }
    
    /*
     * 提交动作，校验流程
     */
    submit(e) {
        var validArr = [];
        var elems = self.root.getElementsByTagName('form')[0].elements;
        var action = config.action || self.root.getAttribute('action');
        var url = action;

        if (config.valid) {
            for (var i = 0; i < elems.length; i++) {
                var valid = elems[i].getAttribute('valid');
                var customValid = elems[i].getAttribute('customValid');
                var max = elems[i].getAttribute('max');
                var min = elems[i].getAttribute('min');
                var type = elems[i].getAttribute('type');
                var v = elems[i].value; 
                var name = elems[i].name;
                var dom = elems[i];
                var validMin = function() {
                    min = parseInt(min, 10);
                    if (v.length < min) {
                        validArr.push(name);
                        self.onValidRefuse(dom, self.minWarning(min));
                    }
                    else {
                        self.onValidPass(dom, self.successTips);
                    }
                }

                var validMax = function() {
                    max = parseInt(max, 10);
                    if (v.length > max) {
                        validArr.push(name);
                        self.onValidRefuse(dom, self.maxWarning(max));
                    }
                    else {
                        self.onValidPass(dom, self.successTips);
                    }
                }
                if (name && valid) {
                    if (valid === 'email') {
                        if (!v.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/)) {
                            validArr.push(name);
                            self.onValidRefuse(dom, self.emailWarning);
                        }
                        else {
                            self.onValidPass(dom, self.successTips); 
                        }
                    }
                    else if (valid === 'mobile') {
                        if (!v.match(/^1[3|4|5|8][0-9]\d{4,8}$/)) {
                            validArr.push(name);
                            self.onValidRefuse(dom, self.mobileWarning);
                        }
                        else {
                            self.onValidPass(dom, self.successTips); 
                        }
                    }
                    else if (valid === 'url') {
                        if (!v.match(/((http|ftp|https|file):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/)) {
                            validArr.push(name);
                            self.onValidRefuse(dom, self.urlWarning);
                        }
                        else {
                            self.onValidPass(dom, self.successTips); 
                        }
                    }
                    else if (valid === 'present') {
                        v = v.replace(' ', '');
                        if (!v.length) {
                            validArr.push(name);
                            self.onValidRefuse(dom, self.presentWarning);
                        }
                        else if (max && type!== 'number'){
                            validMax();
                        }
                        else if (min && type!== 'number'){
                            validMin();
                        }
                        else {
                            self.onValidPass(dom, self.successTips);
                        }
                    }
                    else if (valid.match(/^\/\S+\/$/)) {
                        valid = valid.replace(/^\//, '');
                        valid = valid.replace(/\/$/, '');
                        var reg = new RegExp(valid);
                        if (reg.test(v)) {
                            self.onValidPass(dom, self.successTips); 
                        }
                        else {
                            validArr.push(name);
                            self.onValidRefuse(dom, self.regWarning);
                        }
                    }
                }
                else if (name && max && type!== 'number') {
                    validMax();
                }
                else if (name && min && type!== 'number') {
                    validMin();
                }
                else if (name && customValid) {
                    if (window[customValid]) {
                        var reg = window[customValid].regExp;
                        var tips = window[customValid].message || self.regWarning;
                        if (reg && reg.test(v)) {
                            self.onValidPass(dom, self.successTips); 
                        }
                        else {
                            validArr.push(name);
                            self.onValidRefuse(dom, tips);
                        }
                    }
                }
            }
        }
        
        if (!validArr.length) {
            e.preventDefault();
            if (config.normalSubmit) { 
                self.root.firstChild.setAttribute('action', action);
                return true;
            }
            else {
                self.ajaxSubmit(elems, url);
            }
        }
        else {
            return false;
        }
    }

</super-form>