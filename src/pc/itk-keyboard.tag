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

        //这里已经能够监听单键和 ctr shift alt 的组合键,但是,组合键的顺序,用户可能不按照规则来,这里可以重新排序一下
        for (x in config.handleMap) {

            // 判断是不是组合键,有几个键,若包含 ctr shift alt 那么就进行排序就好

            var keyArr = x.split('+');
            if (keyArr.length > 1) {

                var keyString = '';

                for (var i = 0; i < keyArr.length; i++) {
                    if (keyArr[i] === 'Ctrl') {
                        keyString += 'Ctrl+';
                    }
                }

                for (var i = 0; i < keyArr.length; i++) {
                    if (keyArr[i] === 'Alt') {
                        keyString += 'Alt+';
                    }
                }

                for (var i = 0; i < keyArr.length; i++) {
                    if (keyArr[i] === 'Shift') {
                        keyString += 'Shift+';
                    }
                }

                // 最后一个元素,也就是普通键,不为三者方可
                if (keyArr[keyArr.length - 1] != 'Ctrl' && keyArr[keyArr.length - 1] != 'Alt' && keyArr[keyArr.length - 1] != 'Shift') {
                    self.on((keyString + keyArr[keyArr.length - 1]), config.handleMap[x]);
                    // console.log('最终触发排序过后的按键是:' + (keyString + keyArr[keyArr.length - 1]));
                }

            } else {
                self.on(x, config.handleMap[x]);
            }
        }

    </script>

</itk-keyboard>