<select-box>
	<div class="r-select" onclick={ clicked }>{ placeholder }</div>
    <ul class="r-select-body" hide={ hide }>
        <li each={ data } index={ index } value={ value } class="r-select-item { selected }" onclick={ parent.clickItem }>{ innerText }</li>
    </ul>
    <div style="display:none" class="inputHide"></div>
    <script>
    var self = this;
    var EL = self.root;
    self.config = self.opts.opts || self.opts;

    self.data = [];

    self.placeholder = self.config.placeholder;

    self.callback = self.config.callback;

    self.name = self.config.name;

    self.value = [];

    self.prevNode = null;

    EL.getValue = function () {
        return self.value;
    };

    self.hide = true;

    clicked(e) {
        self.hide = false;
        self.update();
    };

    updateValue(item) {
        for (var i = 0; i < self.data.length; i++) {
            if (self.data[i].selected) {
                self.value.push(self.data[i].value);
                self.placeholder.push(self.data[i].innerText);
            }
        }
        if (self.value.length == self.size) {
            self.hide = true;
        }
        self.placeholder = self.placeholder.join(',');
        self.prevNode = item;
        self.callback && self.callback(self);
        self.update();
    }
 
    clickItem(e) {
        var item = e.target || e.srcElement;
        var index = +item.getAttribute('index');
        self.value.length = 0;
        self.placeholder = [];
        if (self.mutiple) {
            self.data[index].selected = self.data[index].selected ? '' : 'selected';
            self.updateValue(null);
            return;
        }
        if (self.prevNode) {
            self.data[+self.prevNode.getAttribute('index')].selected = '';
        }
        self.data[index].selected = 'selected';
        self.updateValue(item);
    };

    self.one('mount', function () {
        for (var i = 0; i < self.config.data.length; i++) {
            var child = self.config.data[i];
            child.selected = '',
            child.index = i;
            self.data.push(child);
        }
        self.mutiple = self.config.mutiple || false;
        self.size = self.mutiple ? (self.config.size ? self.config.size : self.data.length) : 1;
        self.update();
    });
    </script>
</select-box>