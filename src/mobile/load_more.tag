<load-more>
    <style>
        
    </style>
    <div id="loading" show={ loading }>
        <img src="imgs/loading.gif" if={ !over }>
        <span>{ loadingText }</span>
    </div>

    var self = this

    self.scrollDown = function(event) {
        var clientHeight = window.document.body.clientHeight;
        var scrollTop = window.document.body.scrollTop;
        if ((clientHeight + scrollTop) > window.document.body.scrollHeight - 20) {
            window.removeEventListener('scroll', scrollDown);
            if (!self.over) {
                self.pn = self.pn + 1;
                config.callback(self.pn);
            }
        }
    }

    setTimeout(function() {
        window.addEventListener('scroll', self.scrollDown, false);
    }, 50);
</load-more>