<itk-slide>

    <style>

        itk-slide {
            display: block;
            overflow: hidden;
            padding: 0;
            position: relative;
            margin: 0;
        }

        itk-slide ul {
            display: block;
            overflow: hidden;
            padding: 0;
            margin: 0;
            position: relative;
        }

        itk-slide ul li {
            display: block;
            float: left;
            ul-style: none;
            list-style: none;
            padding: 0;
            margin: 0;
        }

        itk-slide .slide-btn-wrap {
            width: 100%;
            height: 50px;
            background-color: rgba(0, 0, 0, .3);
            position: relative;
            top: -50px;
        }

        itk-slide #slide-btn-container {
            width: 100px;
            height: 50px;
            margin: 0 auto;
        }

        itk-slide .slide-btn-wrap span {
            cursor: pointer;
            float: left;
            border: 1px solid #fff;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #333;
            margin-right: 5px;
            margin-left: 5px;
            margin-top: 20px;
        }

        itk-slide .slide-btn-wrap .on {
            background: orangered;
        }

        itk-slide .arrow {
            display: block;
            cursor: pointer;
            line-height: 50px;
            text-align: center;
            font-size: 36px;
            font-weight: bold;
            width: 40px;
            height: 50px;
            position: absolute;
            z-index: 100;
            background-color: RGBA(0, 0, 0, .3);
            color: #fff;
            top: 50%;
            text-decoration: none;
        }

        itk-slide #prev {
            left: 20px;
        }

        itk-slide #next {
            right: 20px;
        }
    </style>

    <ul id="slide-wrap">
        <yield/>
    </ul>

    <a href="javascript:;" id="prev" class="arrow">《</a>
    <a href="javascript:;" id="next" class="arrow">》</a>


    <div class="slide-btn-wrap" id="slide-btn-wrap">
        <div id="slide-btn-container">
        </div>
    </div>


    <script>
        // 要满足如下要求:
        // 1.最基本,图像可轮播
        // 2.任意
        // 3.统一配置入口
        // 4.正方向,反方向,没有方向原地渐变,前后按钮,播放暂停,小圆点
        // 5.高度自适应（每一个动作重设高度）
        // 开发步骤:
        // 1.定义 tag的使用方法,暂定里面只准放 li,ul 作为轮播容器,li 作为默认轮播元素
        // 2.根据配置的宽高重新设置宽高

        var self = this;

        var defaultConfig = {

            // 整体大小
            width: "600px",
            height: "400px",

            // 前后按钮效果
            prev_next_show: true,
            prev_next_width: "",
            prev_next_height: "",
            prev_next_color: "",

            // 小按钮效果
            btns_container_show: true,
            btns_show: true,
            btns_size: "10px",
            btns_style: "circle",
            btns_active_color: "orangered",
            btns_blur_color: "333",
            btns_border_color: "fff",
            btns_border_size: "1px",

            // 运动方向,运动函数
            direction: "right",
            move_function: "liner",

            // 延时设置
            time: 3000,// 多久运动一次,总间隔
            speed: 300,// 每次运动耗时,表明运动速度
            step: 5,// 多少个步骤,表明运动帧速,对应细腻程度

        };

        // 元素缓存
        var root = self.root;
        var ul = self['slide-wrap'];
        var li = ul.getElementsByTagName('li');
        var first = li[0];
        var last = li[li.length - 1];

        var btnsContainer = self['slide-btn-container'];
        var btns = self['slide-btn-wrap'].getElementsByTagName('span');
        var prev = self['prev'];
        var next = self['next'];

        var len = li.length;

        // 运行时参数
        var index = 1;
        var animated = false;//全局运动状态标志
        var timer;

        // 更新设置
        var initSetting = function () {
            for (var defeaultItem in defaultConfig) {
                for (var newItem in self.opts) {
                    if (defeaultItem == newItem) {
                        defaultConfig[defeaultItem] = self.opts[newItem];
                        console.log(self.opts[newItem]);
                    }
                }
            }
            console.log("更新后的设置为:");
            console.log(defaultConfig);
        }

        // 重设高度和宽度
        var initView = function () {

            // 复制一份dom 结构
            ul.innerHTML = li[li.length - 1].outerHTML + ul.innerHTML + li[0].outerHTML;

            // 根据长度塞进小按钮
            for (var i = 0; i < len; i++) {
                var span = document.createElement('span');
                span.index = i + 1;
                if (i == 0) {
                    span.className = 'on';
                }
                btnsContainer.appendChild(span);
            }


            // tag 大小
            self.root.style.width = defaultConfig['width'];
            self.root.style.height = defaultConfig['height'];

            // ul 大小
            ul.style.width = parseInt(defaultConfig['width']) * (len + 1) + 'px';
            ul.style.height = defaultConfig['height'];
            ul.style.left = "-" + defaultConfig['width'];

            // li 大小
            for (var j = 0; j < li.length; j++) {
                li[j].style.width = defaultConfig['width'];
                li[j].style.height = defaultConfig['height'];
            }

            // btnwrap 大小,根据个数乱算
            btnsContainer.style.width = (len * 10) + (len * 2 * 5) + 'px';

            // 翻页按钮对齐
            self['prev'].style.marginTop = '-25px';
            self['next'].style.marginTop = '-25px';

        }

        // 开始播放
        var play = function () {
            timer = setTimeout(function () {
                prev.onclick();
                play();
            }, defaultConfig.time);
        }


        var goLeft = function () {

        };

        var goTop = function () {

        };

        var goBottom = function () {

        };

        // 匀速动画,向左还是向右运动多少个像素
        var animate = function (offset) {

            if (offset == 0) {
                return;
            }

            animated = true;

            // 时长,300毫秒
            var speed = defaultConfig.speed;
            // 频率,5步
            var step = defaultConfig.step;

            //每个步骤耗时
            var perStepTime = speed / step;

            // 每次移动多少
            var perStepDiff = offset / step;

            // 目标位置
            var target = parseInt(ul.style.left) + offset;

            // 向右滑动
            var goRight = function() {

                // 第一个或表示,向右运动的时候,并且想有运动的时候,本身的位置一定是小于目标位置的
                // 第二个或表示,向左运动的时候,并且向左运动的时候,本身的位置一定是大雨目标位置的
                // 否则表示已经运动到了错误的范围,要纠正位置了,纠正就调到 else
                if ((perStepDiff > 0 && parseInt(ul.style.left) < target) || (perStepDiff < 0 && parseInt(ul.style.left) > target)) {

                    ul.style.left = parseInt(ul.style.left) + perStepDiff + 'px';
                    setTimeout(goRight, perStepTime);
                }
                else {

                    // 要考虑出现等于的情况

                    console.log("超出范围,或者正好在等于的位置上,目前位置是:" + ul.style.left);

                    // 强制重设
                    ul.style.left = target + 'px';

//                    if (target > -200) {
//                        ul.style.left = -600 * len + 'px';
//                    }
//
                    if (target < (-600 * len)) {
                        console.log('先到0');
                        ul.style.left = '0px';
                        animate(-600);
                    }

                    animated = false;
                }
            }

            goRight();


        }

        var showButton = function () {
            for (var i = 0; i < btns.length; i++) {
                if (btns[i].className == 'on') {
                    btns[i].className = '';
                    break;
                }
            }
            btns[index - 1].className = 'on';
        }


        function stop() {
            console.log('stop');
            clearTimeout(timer);
        }

        next.onclick = function () {

            console.log('next on click');

            if (animated) {
                return;
            }
            if (index == len) {
                index = 1;
            }
            else {
                index += 1;
            }
            animate(-600);
            showButton();
        }

        prev.onclick = function () {
            if (animated) {
                return;
            }
            if (index == 1) {
                index = len;
            }
            else {
                index -= 1;
            }
            animate(600);
            showButton();
        }

        root.onmouseover = stop;
        root.onmouseout = play;

        self.on('mount', function () {

            initSetting();

            initView();


            for (var i = 0; i < btns.length; i++) {
                btns[i].onclick = function () {
                    if (animated) {
                        return;
                    }
                    if (this.className == 'on') {
                        return;
                    }
                    var myIndex = parseInt(this.getAttribute('index'));
                    var offset = -600 * (myIndex - index);

                    animate(offset);
                    index = myIndex;
                    showButton();
                }
            }


            play();

        });

    </script>

</itk-slide>