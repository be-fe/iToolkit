<table-view>
    <yield>
    <table class={ config.class }> 
        <tr show={ showHeader }>
            <th each={ cols } style={ style }>{ alias || name }</th>
        </tr>
        <tr each={ row in rows } > 
            <td each={ colkey, colval in parent.cols } class={ newline: parent.parent.config.newline, cut: parent.parent.config.cut } title={ parent.row[colkey.name] }>
                { parent.parent.drawcell(parent.row, this, colkey) }
            </td>
        </tr>
    </table>

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
                        name: child.attributes['name'].value,
                        inner: child.innerHTML,
                        style: col_style,
                        index: i
                    }
                    if (child.attributes['alias']) {
                        col.alias = child.attributes['alias'].value || ''
                    }

                    self.cols.push(col);
                }

            }
        }
        else {
            //simple table
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

    drawcell(rowdata, td, col) {
        if(col.inner){
            setTimeout(function() {
                var str = col.inner.replace(/&lt;%=[\s|\w]+%&gt;/g, function(v) {
                    var key = v.replace(/&lt;%=/g, '')
                               .replace(/\s/g, '')
                               .replace(/%&gt;/g, '');
                    return rowdata[key];
                });
                td.root.innerHTML = str;
            }, 10);
        }
        else{
            return rowdata[col.name];
        }
    }

</table-view>