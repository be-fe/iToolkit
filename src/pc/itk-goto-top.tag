<itk-goto-top>
    <yield/>
    <div class="itk-topbtn" id="itk-goto-top-btn">
        <div class="itk-arrow"></div>
        <div class="itk-stick"></div>
    </div>
    <script>
        //初始化设置
        var self = this;
        var rt = self.root;
        var config = self.opts.opts || self.opts;

        var defaultDom;
        var ua = window.navigator.userAgent;
        if (ua.match(/firefox/i)) {
            defaultDom = document.documentElement;
        }
        else {
            defaultDom = document.body;
        }
       // console.log(defaultDom);
 
        self.speed = 50000*(config.speed || 100);
        self.showHeight = config.showHeight || 300;
        self.right = config.right || 30;
        self.bottom = config.bottom || 30;
        self.dom = config.dom || defaultDom;

        rt.style.right = self.right + 'px';
        rt.style.bottom = self.bottom + 'px';

        self.init = function(){
            //获取当前页面滚动条的纵坐标位置
            var top;
            // console.log(self.dom.scrollTop);
            var scrollHandler = function(){
                top = self.dom.scrollTop;
                //当滚动条滚动一定距离后，切换是否显示
                if(top > self.showHeight){
                    rt.style.display = 'block';
                }
                else{
                    rt.style.display = 'none';
                }  
            }
            //设置回顶的配置项
            var clickHandler = function(){
                //假设回顶的速度为100px/s,滚动条距离页面顶部距离为top
                var dist = self.speed / top;
                var timer = setInterval(backTop, 20);
                function backTop(){
                    self.dom.scrollTop -= dist;
                    if( self.dom.scrollTop === 0 ) {
                        clearInterval(timer);
                    }
                }
            }

            if (self.dom === defaultDom) {
                var eventTrigger = window;
            }
            else {
                var eventTrigger = self.dom;
            }

            eventTrigger.addEventListener("scroll",scrollHandler);
            rt.addEventListener("click",clickHandler);
        }

        //调用组件
        self.on('mount',function(){
            var defaultBtn = rt.querySelector('#itk-goto-top-btn');
            if(rt.firstElementChild === defaultBtn) {
                defaultBtn.style.display = 'block';
            }
            else {
                defaultBtn.style.display = 'none';
            }
            self.init();
        })
    </script>

</itk-goto-top>