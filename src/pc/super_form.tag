<super-form>
    <form onsubmit={ submit } >
        <yield>
    </form>

    var self = this;
    var config = self.opts.opts || self.opts;
    self.data = config.data;
    self.submitingText = config.submitingText || '提交中...';

    valid(params, message) {
        if (typeof params === 'string') {
            if (params === 'email') {

            }
            else if (params === 'mobile') {

            }
            else if (params === 'url') {
                
            }
        }
        else if (typeof params === 'object') {
            if (params.max) {

            }
            else if (params.min) {

            }
            
        }
        self.trigger('prevent')
    }

    self.showValidTips = function() {
        self.show = true;
    }

    submit(e) {
        var elems = self.root.getElementsByTagName('form')[0].elements;
        var url = self.root.getAttribute('action');
        var params = "";
        var value;

        if (config.normalSubmit) { 
            self.root.firstChild.setAttribute('action', self.root.getAttribute('action'));
            return true 
        }

        // for (var i = 0; i < elems.length; i++) {
        //     var valid = elems[i].valid;
        //     var v = elems[i].value; 
        //     if (valid === 'email') {
        //         if (!v.match(/\dsd/)) {

        //         }
        //     }
        //     else if (valid === 'phone') {

        //     }
        // }
        e.preventDefault();
        self.one('pass', function() {
            for (var i = 0; i < elems.length; i++) {
                if (elems[i].name) {
                    if (elems[i].tagName === "SELECT") {
                        value = elems[i].options[elems[i].selectedIndex].value;
                        params += elems[i].name + "=" + encodeURIComponent(value) + "&";
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
                if (elems[i].type === "submit") {
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
                    if (xmlhttp.status === 200) {
                        try {
                            var result = JSON.parse(xmlhttp.responseText);
                            config.callback(result);
                        }catch(e){
                            console.log(e);
                        }
                    }
                    else {
                        config.errCallback(params);
                    }
                    submitbtn.value = submitText;
                    submitbtn.disabled = false;
                } 
            };
        });
        
        self.trigger('pass');
    }

</super-form>