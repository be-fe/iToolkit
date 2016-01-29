<itk-calendar show={ open }>
    <div class="itk-calendar-wrapper">
        <div class="itk-calendar-head">
            <div class="itk-calendar-month-prev"></div>
            <div class="itk-calendar-year-prev"></div>
            <div class="itk-calendar-month-select"></div>
            <div class="itk-calendar-year-select"></div>
            <div class="itk-calendar-year-next"></div>
            <div class="itk-calendar-month-next"></div>
        </div>
        <div class="itk-calendar-body">
            <div class="itk-calendar-weeks">
                <div class="itk-calendar-week" each={ text in weekArr }>{ text }</div>
            </div>
            <div class="itk-calendar-days">
                <div
                    class="itk-calendar-day { 
                        selected:
                            parent.showSelected &&
                            parent.selectedYear === parent.year &&
                            parent.selectedMonth === parent.month &&
                            parent.selectedDay === text
                        } {
                        today:
                            parent.showToday &&
                            parent.toYear === parent.year &&
                            parent.toMonth === parent.month &&
                            parent.toDay === text
                    }"
                    each={ text in dayArr }
                    onclick={ dayClicked }
                >{ text }</div>
            </div>
        </div>
    </div>
    <script>
    // script 不能抵住第一格写
    // 如果抵住第一格写
    // 编译出来的说有function都会被
    // bind(this)
    var self = this;

    self.i18n = {
        zh_cn: {
            weekArr: ['日','一','二','三','四','五','六'],
            monthArr: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
        },
        en_us: {
            weekArr: ['Su','Mo','Tu','We','Th','Fr','Sa'],
            monthArr: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        }
    };

    // 这是我们的根元素
    // 我们可以把方法映射到
    // 根元素上
    var el = self.root;

    // 直接拿到配置
    var config = self.opts.opts || self.opts || {};

    /**
     * 将配置映射到tag上
     * @param  {[type]} opts [description]
     * @return {[type]}      [description]
     */
    self.mapping = function (opts) {
        if (!utils.isObject(opts)) {
            throw new TypeError('Config is not a object!');
            return;
        }
        for (var i in opts) {
            self[i] = opts[i];
        }
    };

    self.mapping(config);

    /**
     * 初始化星期列表
     */
    self.initWeekList = function (language) {
        var list = self.i18n[language];
        if (list) {
            self.weekArr = list.weekArr;
            self.monthArr = list.monthArr;
        }
        else {
            if (!self.weekArr || !self.monthArr) {
                var list = self.i18n.en_us;
                self.weekArr = list.weekArr;
                self.monthArr = list.monthArr;
            }
        }
    };

    self.initWeekList(self.language);

    self.getDaysCount = function (year, month) {
        var ret = 0;
        switch (month) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
            case 0:
            case 13:
                ret = 31;
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                ret = 30;
                break;
            case 2:
                ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? ret = 29 : ret = 28;
                break;
            default:
                throw new Error('你算错了');
                break;
        }
        return ret;
    };

    self.initDays = function (timeStamp) {
        var date;
        console.log(1)
        if (timeStamp) {
            date = new Date(timeStamp);
        }
        else {
            date = new Date();
        }
        var thisMonth = date.getMonth() + 1;
        var thisYear = date.getFullYear();
        var thisDay = date.getDate();

        self.today = thisDay;
        self.toMonth = thisMonth;
        self.toYear = thisYear;

        if (self.showToday) {
            self.day = thisDay;
            self.month = thisMonth;
            self.year = thisYear;
        }


        var thisMonthDays = self.getDaysCount(thisYear, thisMonth);
        console.log('thisMonthDays', thisMonthDays);
        var prevMonthDays = self.getDaysCount(thisYear, thisMonth - 1);
        console.log('prevMonthDays', prevMonthDays);
        var nextMonthDays = self.getDaysCount(thisYear, thisMonth + 1);
        console.log('nextMonthDays', nextMonthDays);
        date.setDate(1);
        var firstDay = date.getDay();
        console.log('firstDay', firstDay);
        date.setDate(thisMonthDays);
        var lastDay = date.getDay();
        console.log('lastDay', lastDay);
        var dayArr = [];
        dayArr = dayArr
            .concat((new Array(firstDay === 0 ? 1 : ((7 - firstDay) ^ 7) + 1).join(0).split('')).map(function (v, i) {
                return prevMonthDays - i;
            }).reverse());
        console.log(1,dayArr)
        dayArr = dayArr.concat((new Array(thisMonthDays + 1).join(0).split('')).map(function (v, i){
                return i + 1;
            }));
        console.log(2,dayArr);
        dayArr = dayArr.concat((new Array(lastDay === 0 ? 7 : (6 - lastDay) + 1).join(0).split('')).map(function (v, i){
                return i + 1;
            }));
        console.log(3,dayArr);
        self.dayArr = dayArr;
        self.update();
    };

    self.initDays(self.initTime);

    self.formatter = function (type) {
        var date = new Date(self.year, self.month - 1, self.day, 0, 0, 0);
        var timeStamp = date.getTime();
        var ret;
        switch (type) {
            case 'unixTimeStamp':
                ret = self.getUnixTimeStamp(timeStamp);
                break;
            case 'timeStamp':
                ret = self.getTimeStamp(timeStamp);
                break;
            default:
                if (!type) {
                    var type = 'yyyy/mm/dd';
                }
                ret = type.replace(/(yyyy|mm|dd|yy|m|d)/ig, function (v) {
                    if (v === 'yyyy') {
                        return self.selectedYear;
                    }
                    if (v === 'mm') {
                        return self.getNum(self.selectedMonth);
                    }
                    if (v === 'dd') {
                        return self.getNum(self.selectedDay);
                    }
                    if (v === 'yy') {
                        return self.selectedYear.toString().substr(2, 4);
                    }
                    if (v === 'm') {
                        return self.selectedMonth;
                    }
                    if (v === 'd') {
                        return self.selectedDay;
                    }
                })
        }
    };

    /**
     * 点击天数
     */
    self.dayClicked = function () {
        self.selectedDay = 
        self.onSelect && self.onSelect(self.formatter);
    };


    // 首先这个是隐藏的
    self.open = false;

    /**
     * 为触发元素绑定事件
     * @return {[type]} [description]
     */
    self.bindEvent = function () {
        if (self.element) {
            document.addEventListener('click', self.closeIt, false);
            self.element.addEventListener('click', self.openIt, false);
        }
        else {
            self.open = true;
        }
    };

    self.closeIt = function (e) {
        var className = e.target.className;
        if (
            className &&
            className.indexOf('itk-calendar') !== -1 &&
            className !== 'itk-calendar-days'
        ) {
            return;
        }
        self.open = false;
        self.update();
    };

    self.openIt = function (e) {
        self.open = true;
        self.update();
    };

    self.bindEvent();

    /**
     * 在目标卸载时解绑
     */
    self.unbindEvent = function () {
        if (self.element) {
            document.removeEventListener('click', self.closeIt, false);
            self.element.removeEventListener('click', self.openIt, false);
        }
    };

    self.on('unmount', function () {
        self.unbindEvent();
    });

    /**
     * 获取时间戳
     * 我们的返回值应该多种多样
     * 可以让用户选择需要的时间类型
     * @return {Number} 时间戳
     */
    self.getTimeStamp = function (timeStamp) {
        return timeStamp;
    };

    /**
     * 获取unix时间戳
     * @return {Number}
     */
    self.getUnixTimeStamp = function (timeStamp) {
        return Math.ceil(timeStamp / 1000).toString();
    };

    /**
     * 获取年份
     * @return {Number}
     */
    self.getYear = function () {
        return self.selectedYear;
    };

    /**
     * 获取选择的月份
     * @return {Number}
     */
    self.getMonth = function () {
        return self.selectedMonth;
    };

    /**
     * 获取选择的天
     * @return {Number}
     */
    self.getDay = function () {
        return self.selectedDay;
    };

    self.nextYear = function () {};

    self.nextMonth = function () {};

    self.prevYear = function () {};

    self.prevMonth = function () {};

    self.flush = function () {};

    self.location = function () {};
    </script>
</itk-calendar>