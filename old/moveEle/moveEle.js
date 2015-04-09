var nodeTouchStart = function(self, index, touchTarget, node, nodeShadow) {
    touchTarget.addEventListener('touchstart', function(evt) {
        evt.preventDefault();
        self.removeRoutes(self, index);
        var touch = evt.changedTouches[0];
        self.initialX = touch.pageX;
        self.initialY = touch.pageY;

        self.nodeTransitX = self.nodePos.x;
        self.nodeTransitY = self.nodePos.y;
        self.checkRoutes(self, self.currentStop);
        self.removeRoutes(self, index);
    }, false);
};
// node touch move events
var nodeTouchMove = function(self, index, touchTarget, node, nodeShadow) {
    touchTarget.addEventListener('touchmove', function(evt) {

        evt.preventDefault();
        self.removeRoutes(self, index);
        var target = evt.target;
        var touch = evt.changedTouches[0];
        var diffX = touch.pageX - self.initialX;
        var diffY = touch.pageY - self.initialY;

        self.nodeTransitX = self.nodePos.x +  diffX;
        self.nodeTransitY = self.nodePos.y +  diffY;
        // console.log(self.nodeTransitX + '-' + self.nodeTransitY);
        node.style.left = self.nodeTransitX + 'px';
        node.style.top = self.nodeTransitY + 'px';
        nodeShadow.style.left = self.nodeTransitX + 'px';
        nodeShadow.style.top = self.nodeTransitY + 'px';
        nodeShadow.style.webkitAnimationName = 'none';
        nodeShadow.style.webkitTransform = 'scale(1.3)';

    }, false);
};

// node touch end events
var nodeTouchEnd = function(self, index, touchTarget, node, nodeShadow) {

    var endFunc = function(evt) {
        evt.preventDefault();
        var target = evt.target;
        var position = node.getBoundingClientRect();
        var posX =  position.left + self.diameter * 2;
        var posY =  position.top + self.diameter * 2;

        var colliIndex = self.collision(posX, posY, self.routes[index]);
        
        // shadow.style.webkitAnimationName = 'expand';

        if (colliIndex !== false) {
            
            if (self._opt.vibrate) {
                self._opt.vibrate();
            }

            self.transferData(index, colliIndex, node, nodeShadow);
            nodeShadow.style.webkitAnimationName = 'nodeExpandSuccess';
            nodeShadow.style.webkitAnimationDuration = '1000ms';
        }
        else {
            self.resetNode(self, node, nodeShadow);
        }

        self.checkRoutes(self, index);
    }
    touchTarget.addEventListener('touchend', endFunc, false);
    touchTarget.addEventListener('touchcancel', endFunc, false);
};