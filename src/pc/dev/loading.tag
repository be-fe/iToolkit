<loading>
    <style>
        loading .itoolkit-loading {
            text-align: center;
        }
    </style>
    <div class={itoolkit-loading: true, default: default} >
        <yield>
    </div>

    var self = this;
    var config = self.opts.opts || self.opts;
    self.default = true;
    
    self.on('mount', function() {
        var parentDom = self.root.parentNode;
        var parentPosition = window.getComputedStyle(parentDom, null).position;
        if (parentPosition === 'static') {
            parentDom.style.position = 'relative';
        }

        self.childDom = self.root.getElementsByClassName('itoolkit-loading')[0];

        if (self.childDom.innerHTML.trim()) {
            self.default = false;
            self.update();
        }

        var cellHeight = parseInt(window.getComputedStyle(self.childDom, null).height.replace('px', ''), 10);
        self.root.style.marginTop = '-' + cellHeight/2 + 'px';
        
    })

    self.root.show = function(){
        if (self.childDom) {
            self.childDom.style.display = 'block';
        }
    }

    self.root.hide = function(){
        if (self.childDom) {
            self.childDom.style.display = 'none';
        }
    }
    
</loading>