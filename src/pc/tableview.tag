<table-view>
    <yield>
    <table class={ config.class }> 
        <tr>
            <th each={ cols }>{ alias || name }</th>
        </tr>
        <tr each={ row in rows } > 
            <td each={ colkey, colval in parent.cols }>
                { parent.parent.drawcell( parent.row, this, colkey) }
            </td>
        </tr>
    </table>

    var self = this;
    var EL = self.root;
    self.config = self.opts.opts || self.opts;
    self.cols = [];
    self.rows = [];

    self.on('mount', function() {
        self.rows = self.config.data;
        if (EL.children.length > 1) {
            for( i = 0; i < EL.children.length; i++){
                var child = EL.children[i];
                if(child.localName=='rcol'){
                    var col_style=''    
                    if(child.attributes['width']!=undefined) {
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


    EL.load = function(newrows){
        self.rows = newrows
        self.update()
    }

    EL.append = function(newrows){
        self.rows.push(newrows)
        self.update()
    }

    drawcell(rowdata, tr,  col) {
        if(col.inner){
            setTimeout(function() {
                var str = col.inner.replace(/&lt;%=[\s|\w]+%&gt;/g, function(v) {
                    var key = v.replace(/&lt;%=/g, '')
                               .replace(/\s/g, '')
                               .replace(/%&gt;/g, '');
                    return rowdata[key];
                });
                tr.root.children[col.index].innerHTML = str;
            }, 1);
        }
        else{
            return rowdata[col.name];
        }
    }

</table-view>