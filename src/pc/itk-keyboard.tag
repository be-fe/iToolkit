<itk-keyboard>

    <yield></yield>

    <script>

        /*
         *本 tag 对mixin 进行包装,使得可以直接在 html 里面使用
         */

        var self = this;
        var EL = self.root;
        var config = self.opts.opts || self.opts;


        var trigger;
        if (config.keyboardTriggerId) {

            // 判断内部元素还是外部元素
            if (self[config.keyboardTriggerId]) {
                trigger = self[config.keyboardTriggerId];
            } else {
                trigger = document.getElementById(config.keyboardTriggerId);
            }

        } else {
            trigger = window;
        }

        // 键盘检测和处理
        self.keyboardTrigger = trigger;
        self.mixin('itk-keyboard');

        for (x in config.handleMap) {
            self.on(x, config.handleMap[x]);
        }

    </script>

</itk-keyboard>