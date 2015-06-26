<loading>
    <style>
        loading .itoolkit-loading {
            text-align: center;
        }
    </style>
    <div class={itoolkit-loading: true, default: default} >
        <img src={ img } if={ img } width={ width } alt="loading">
    </div>

    var self = this;
    var config = self.opts.opts || self.opts;
    
    if (!config.img) {
        self.img = false;
        self.default = true;
    }
    else {
        self.img = config.img;
    }
    
    self.on('mount', function() {
        var childDom = self.root.getElementsByClassName('itoolkit-loading')[0];

        var img = childDom.querySelector('loading .itoolkit-loading img');
        if (img) {
            img.style.height = config.imgHeight || '50px';
        }

        var cellHeight = parseInt(window.getComputedStyle(childDom, null).height.replace('px', ''), 10);

        var parentDom = self.root.parentNode;
        var parentPosition = window.getComputedStyle(parentDom, null).position;

        self.root.style.marginTop = '-' + cellHeight/2 + 'px';
        if (parentPosition === 'static') {
            parentDom.style.position = 'relative';
        }
    })

    self.root.show = function(newrows){
        if (childDom) {
            childDom.style.display = 'block';
        }
    }

    self.root.hide = function(newrows){
        if (childDom) {
            childDom.style.display = 'none';
        }
    }
    
</loading>