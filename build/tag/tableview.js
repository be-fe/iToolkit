riot.tag('table-view', '<yield> <table class="{ config.class }"> <tr show="{ showHeader }"> <th each="{ cols }" riot-style="{ style }" hide="{ hide }">{ alias || name }</th> </tr> <tr each="{ row in rows }" > <td each="{ colkey, colval in parent.cols }" class="{ newline: parent.parent.config.newline, cut: parent.parent.config.cut }" title="{ parent.row[colkey.name] }" hide="{ colkey.hide }"> { parent.parent.drawcell(parent.row, this, colkey) } </td> </tr> </table>', function(opts) {

    var self = this;
    var EL = self.root;
    self.config = self.opts.opts || self.opts;
    if (self.config.showHeader===false) {
        self.showHeader = false
    }
    else {
        self.showHeader = true;
    }

    self.cols = [];
    self.rows = [];

    self.on('mount', function() {
        self.rows = self.config.data;
        if (EL.children.length > 1) {
            for( i = 0; i < EL.children.length; i++){
                var child = EL.children[i];
                if(child.localName === 'rcol'){
                    var col_style = ''    
                    if(child.attributes['width'] != undefined) {
                        col_style='width: '+ child.attributes['width'].value;
                    }

                    var col = {
                        inner: child.innerHTML,
                        style: col_style,
                        index: i,
                        attrs: child.attributes,
                        hide: false
                    }

                    col.name = child.attributes['name'] ? child.attributes['name'].value : '';
                    if (child.attributes['alias']) {
                        col.alias = child.attributes['alias'].value || ''
                    }

                    self.cols.push(col);
                }

            }
        }
        else {

            for (i in self.rows[0]) {
                var col = {
                    name: i,
                    inner: '',
                    style: col_style,
                }
                self.cols.push(col);
            }
        }
        self.update()
    })

    self.compare = function(a, b) {
        if (a[self.orderkeyName] > b[self.orderkeyName]) {
            return 1;
        } 
        else if (a[self.orderkeyName] === b[self.orderkeyName]) {
            return 0;
        }
        else {
            return -1;
        }
    }

    self.clearOrder = function() {
        self.ordered = false;
        self.reversed = false;
    }


    EL.loadData = function(newrows){
        self.clearOrder();
        self.rows = newrows
        self.update()
    }

    EL.appendData = function(newrows){
        self.clearOrder();
        self.rows.push(newrows)
        self.update()
    }

    EL.clearData = function(newrows){
        self.clearOrder();
        self.rows = [];
        self.update()
    }

    EL.orderData = function(keyName){
        self.orderkeyName = keyName;
        if (self.ordered !== keyName) {
            if (self.reversed !== keyName) {
                self.rows = self.rows.sort(self.compare)
            }
            else {
                self.rows = self.rows.reverse();
            }
        }
        else {
            return
        }
        self.ordered = keyName;
        self.reversed = false;
        self.update()
    }

    EL.reverseData = function(keyName){
        self.orderkeyName = keyName;
        if (self.reversed !== keyName) {
            if (self.ordered !== keyName) {
                self.rows = self.rows.sort(self.compare)
            }
            self.rows = self.rows.reverse();
        }
        else {
            return
        }
        self.ordered = false;
        self.reversed = keyName;
        self.update()
    }

    EL.deleteData = function(keyName, value){
        self.clearOrder();
        var keyName = keyName || 'id';
        for (i = 0; i < self.rows.length; i++) {
            if (self.rows[i][keyName] === value) {
                self.rows.splice(i, 1);
                EL.deleteData(keyName, value);
            }
        }
        self.update();
        return EL;
    }

    EL.hide = function(keyName) {
        for(i = 0; i < self.cols.length; i++) {
            if (self.cols[i].name === keyName) {
                self.cols[i].hide = true
                break
            }
        }
        self.update();
    }

    EL.show = function(keyName) {
        for(i = 0; i < self.cols.length; i++) {
            if (self.cols[i].name === keyName) {
                self.cols[i].hide = false
                break
            }
        }
        self.update();
    }
    
    self.findNodes = function(node, tag) {
        for(var i = 0;i < node.attributes.length; i++){
            var attrName = node.attributes[i]['name'];
            var attrValue = node.attributes[i]['value'];
            if (attrName === 'if' || attrName === 'show' || attrName === 'hide') {
                node.removeAttribute(attrName);
                var judgeValue = riot.util.tmpl(attrValue, tag);
                if (attrName == 'hide') judgeValue = !judgeValue;
                node.style.display = judgeValue ? '' : 'none';
            }
            if (attrName === 'each') {
                node.removeAttribute(attrName);
                var arr = riot.util.tmpl(attrValue, tag);
                var root = node.parentNode;
                if (arr && utils.isArray(arr)) {
                    var placeholder = document.createComment('riot placeholder');
                    var frag = document.createDocumentFragment();

                    root.insertBefore(placeholder, node);
                    for (i = 0; i < arr.length; i++) {
                        var tmp = document.createElement('tmp');
                        tmp.innerHTML = riot.util.tmpl(node.outerHTML, arr[i]);
                        frag.appendChild(tmp.firstChild);
                    }

                    root.removeChild(node);
                    root.insertBefore(frag, placeholder);
                }
                
            } 
        }
        if (node.hasChildNodes()) {
            var children = node.children;
            for (var i = 0; i < children.length; i++) {  
                var child = children.item(i);
                self.findNodes(child, tag);  
            }  
        }
        
    }

    this.drawcell = function(rowdata, td, col) {
        if (col.attrs.length) {
            for (i in col.attrs) {
                if (typeof col.attrs[i] !== 'function') {
                    if (col.attrs[i]['name'] && col.attrs[i]['name']!=='class') {
                        td.root.setAttribute(col.attrs[i]['name'], col.attrs[i]['value']);
                    }
                    else if (col.attrs[i]['name'] && col.attrs[i]['name']=='class') {
                        utils.addClass(td.root, col.attrs[i]['value']);
                    }
                }
            }
        } //将rcol的属性挪到td上，class需特殊处理，name和alias不动
        
        if(col.inner){
            var str = col.inner.replace(/&lt;%=/g, '{')
                               .replace(/%&gt;/g, '}')
                               .replace(/%>/g, '}')
                               .replace(/<%=/g, '{');
            for (i in iToolkit.tableExtend) {
                if (typeof iToolkit.tableExtend[i] === 'function') {
                    rowdata[i] = iToolkit.tableExtend[i].bind(rowdata);
                }
                else {
                    rowdata[i] = iToolkit.tableExtend[i]
                }
            }

            for (i in rowdata) {
                td[i] = rowdata[i];
            }
            
            td.root.innerHTML = str;
            self.findNodes(td.root, td);
            td.root.innerHTML = riot.util.tmpl(td.root.innerHTML, rowdata)
        }
        else{
            return rowdata[col.name];
        }
    }.bind(this);


});