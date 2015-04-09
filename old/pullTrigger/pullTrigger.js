function pullTrigger(opts, callback) {
    this.init(opts);
    this.bindHandler(callback);
}

pullTrigger.prototype.init = function(opts){
    if (!opts) {
        opts = {};
    }
    this.wrap = opts.wrap || window;
    this.inner = opts.inner || document.body;
    this.timeout = opts.timeout || 0;
};


pullTrigger.prototype.bindHandler = function(callback) {
    var inner = this.inner;
    var wrap = this.wrap;
    var scrollDown = function(event) {
        if ((inner.clientHeight + inner.scrollTop) > inner.scrollHeight - 20) {
            callback && callback()
        }
    }

    setTimeout(function() {
        wrap.addEventListener('scroll', scrollDown, false);
    }, 10);
}