var scrollTab = function(opts){
    this._init(opts);
    this._bindHandler();
};

scrollTab.prototype._init = function(opts){
    this.wrap = opts.wrap || document.getElementById('scroll-tab');
    this.outer = this.wrap.children[0];

    this.isVertical = opts.isVertical || false;

    this.axis = this.isVertical ? 'Y' : 'X';

    this.wrapWidth = this.wrap.clientWidth;
    this.outerWidth = this.outer.clientWidth;
    this.wrapHeight = this.wrap.clientHeight;
    this.outerHeight = this.outer.clientHeight;
    this.ratio = this.height / this.width;
    this.scale = opts.isVertical ? this.height : this.width;
    this._setUpDamping();
};

/**
 *  enable damping when slider meet the edge
 */
scrollTab.prototype._setUpDamping = function () {
    var oneIn2 = this.scale >> 1;
    var oneIn4 = oneIn2 >> 1;
    var oneIn16 = oneIn4 >> 2;

    this._damping = function (distance) {
        var dis = Math.abs(distance);
        var result;

        if (dis < oneIn2) {
            result = dis >> 1;
        } else if (dis < oneIn2 + oneIn4) {
            result = oneIn4 + ((dis - oneIn2) >> 2);
        } else {
            result = oneIn4 + oneIn16 + ((dis - oneIn2 - oneIn4) >> 3);
        }

        return distance > 0 ? result : -result;
    };
};


scrollTab.prototype._bindHandler = function(){
    var self = this;
    var outer = self.outer;

    var startHandler = function (evt) {
        self.startX = evt.targetTouches[0].pageX;
        self.startY = evt.targetTouches[0].pageY;
    };

    var moveHandler = function (evt) {
        evt.preventDefault();
       
        var axis = self.axis;
        var offset = evt.targetTouches[0]['page' + axis] - self['start' + axis];
        if (offset > 0) {
            offset = self._damping(offset);
            outer.style.webkitTransform = 'translate' + axis + '(' + offset + 'px)';
            setTimeout(function(){
                outer.style.webkitTransform = 'translate' + axis + '(0px)';
            }, 500)
        } else if (offset > self.wrapWidth - self.outerWidth){
            offset = self.wrapWidth - self.outerWidth;
            setTimeout(function(){
                outer.style.webkitTransform = 'translate' + axis + '(' + (self.wrapWidth - self.outerWidth) + 'px)';
            }, 500);
        } else {
            outer.style.webkitTransform = 'translate' + axis + '(' + offset + 'px)';
        }
        
    };

    var endHandler = function (evt) {
        evt.preventDefault();
        self.offset = 0;
    };

    var orientationchangeHandler = function (evt) {
        setTimeout(function() {
            this._init();
        },100);
    };

    if (this.outerWidth > this.wrapWidth) { 
        outer.addEventListener('touchstart', startHandler);
        outer.addEventListener('touchmove', moveHandler);
        outer.addEventListener('touchend', endHandler);
    }
    window.addEventListener('orientationchange', orientationchangeHandler);
};