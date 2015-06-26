<goto-top>
    <style>
        goto-top .itoolkit-goto-top{
            display: block;
            position: fixed;
            bottom: 50px;
            right: 40px;
            height: 60px;
            width: 60px;
            z-index: 10000;
            text-align: center;
            opicity: 0.5;
            cursor: pointer;
        }
        goto-top .itoolkit-goto-top .icon{
            font-size: 3em;
            margin: auto;
            float: none;
        }
    </style>
    <div class="itoolkit-goto-top" show={ showGotoTop } onclick={ gotoTop }>
        <span class="icon" if={ !config.img }><span class="icon-arrowUp"></span></span>
        <img src={ config.img } if={ config.img }>
    </div>

    var self = this;
    self.config = self.opts.opts || self.opts;
    var avalibleHeight = window.screen.availHeight;
    
    self.on('mount', function() {
        window.addEventListener('scroll', self.controlGotoTop);
    })
    
    self.controlGotoTop = function() {
        var body = document.body;
        if (body.scrollTop > avalibleHeight && !self.showGotoTop) {
            self.showGotoTop = true;
            self.update();
        }
        else if (body.scrollTop < avalibleHeight && self.showGotoTop) {
            self.showGotoTop = false;
            self.update();
        }
    }

    gotoTop(e) {
        var length = document.body.scrollTop / 100 * 16;
        var timer = setInterval(function() {
            document.body.scrollTop = document.body.scrollTop - length;
            if (document.body.scrollTop < 10) {
                clearInterval(timer);
            }
        }, 16);
    }
    window.test = self;
    // self.on('unmount', function() {
    //     self.test = '1111';
    // });
    // self.unmount();
    
</goto-top>