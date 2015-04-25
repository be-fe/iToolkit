<ajax-form>
    <form onsubmit={ submit }>
        <yield>
    </form>

    var self = this;
    var config = self.opts.opts || self.opts;

    submit(e) {
        e.preventDefault();
        var elem = self.root.getElementsByTagName('form')[0].elements;
        var url = self.root.getAttribute('action');
        var params = "";
        var value;

        for (var i = 0; i < elem.length; i++) {
            if (elem[i].name) {
                if (elem[i].tagName === "SELECT") {
                    value = elem[i].options[elem[i].selectedIndex].value;
                    params += elem[i].name + "=" + encodeURIComponent(value) + "&";
                } 
                else if (elem[i].type === "checkbox" || elem[i].type === "radio"){
                    if (elem[i].checked) {
                        value = elem[i].value;
                        params += elem[i].name + "=" + encodeURIComponent(value) + "&";
                    }
                }
                else {
                    value = elem[i].value;
                    params += elem[i].name + "=" + encodeURIComponent(value) + "&";
                }
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
            } 
        };
    }

</ajax-form>