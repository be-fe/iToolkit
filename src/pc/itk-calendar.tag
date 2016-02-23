<itk-calendar hide={ !open }>
    <div class="itk-calendar-wrapper">
        <div class="itk-calendar-head">
            <!-- <div class="itk-calendar-month-prev btn" onclick={ prevMonth }>⟨</div> -->
            <!-- <div class="itk-calendar-year-prev btn" onclick={ prevYear }>⟪</div> -->
            <div class="itk-calendar-year" onclick={ openYearList }>{ year.text } <span class="itk-calendar-select-icon"></span></div>
            <div class="itk-calendar-month"><span class="itk-calendar-month-left" onclick={ prevMonth }></span>{ month.text }<span class="itk-calendar-month-right" onclick={ nextMonth }></span></div>
            <!-- <div class="itk-calendar-year-next btn" onclick={ nextMonth }>⟩</div> -->
            <!-- <div class="itk-calendar-month-next btn" onclick={ nextYear }>⟫</div> -->
        </div>
        <div class="itk-calendar-body">
            <div class="itk-calendar-weeks">
                <div class="itk-calendar-week" each={ text in weekArr }>{ text }</div>
            </div>
            <div class="itk-calendar-days">
                <div
                    each={ dayArr }
                    class="itk-calendar-day { overflow: overflow } { selected: parent.showSelected && parent.selectedYear === year && parent.selectedMonth === month && parent.selectedDay === day } { today: parent.showToday && parent.toYear === year && parent.toMonth === month && parent.today === day } { defuse: !year && !month }"
                    data-year={ year }
                    data-month={ month }
                    data-day={ day }
                    onclick={ (year && month) ? dayClicked : 'return false;' }
                >{ day }</div>
            </div>
        </div>
        <div class="itk-calendar-years" show={ openList }>
            <div class="itk-calendar-year-item { selected: parent.year.text === i }" each={ i in yearList } onclick={ clickYear }>{ i }</div>
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
            weekArr: ['一','二','三','四','五','六', '日'],
            monthArr: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
        },
        en_us: {
            weekArr: ['Mo','Tu','We','Th','Fr','Sa','Su'],
            monthArr: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        }
    };

    // 这是我们的根元素
    // 我们可以把方法映射到
    // 根元素上
    var el = self.root;

    var classList = [
        'itk-calendar-label',
        'itk-calendar-input',
        'itk-calendar-calendarIcon'
    ];

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

    window['itkCalendarLanguage'] = window['itkCalendarLanguage'] || {};

    /**
     * 增加语言配置
     */
    self.langMixin = function (lang) {
        if (lang) {
            for (var type in lang) {
                if (!window['itkCalendarLanguage'][type]) {
                    window['itkCalendarLanguage'][type] = lang[type];
                }
            }
            delete lang;
        }
    };

    /**
     * 初始化星期列表
     */
    self.initWeekList = function (type) {
        var list = self.i18n[type] || window['itkCalendarLanguage'][type];
        if (list) {
            self.weekArr = list.weekArr;
            self.monthArr = list.monthArr;
        }
        else {
            if (!self.weekArr || !self.monthArr) {
                var list = self.i18n.zh_cn;
                self.weekArr = list.weekArr;
                self.monthArr = list.monthArr;
            }
        }
    };

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

    self.drawDays = function (timeStamp) {
        var date;
        if (timeStamp) {
            date = new Date(timeStamp);
        }
        else {
            date = new Date();
        }
        var thisMonth = date.getMonth();
        var thisYear = date.getFullYear();

        self.month = {
            text: self.monthArr[thisMonth],
            val: thisMonth + 1
        };

        self.year = {
            text: thisYear,
            val: thisYear
        };

        thisMonth = thisMonth + 1;

        var thisMonthDays = self.getDaysCount(thisYear, thisMonth);
        var prevMonthDays = self.getDaysCount(thisYear, thisMonth - 1);
        var nextMonthDays = self.getDaysCount(thisYear, thisMonth + 1);
        date.setDate(1);
        var firstDay = date.getDay();
        date.setDate(thisMonthDays);
        var lastDay = date.getDay();

        var dayArr = [];
        for (var i = 0, len = firstDay ? firstDay - 1 : 6; i < len; i++) {
            dayArr.push({
                year: '',
                month: '',
                day: prevMonthDays - i
            });
        }
        dayArr.reverse();
        for (var i = 0, len = thisMonthDays; i < len; i++) {
            dayArr.push({
                year: thisYear,
                month: thisMonth,
                day: i + 1
            });
        }
        for (var i = 0, len = lastDay ? 7 - lastDay : 0; i < len; i++) {
            dayArr.push({
                year: '',
                month: '',
                day: i + 1
            });
        }
        if (dayArr.length === 28) {
            for (var i = 0; i < 7; i++) {
                dayArr.push({
                    year: '',
                    month: '',
                    day: i + 1
                });
            }
        }
        switch (dayArr.length / 7) {
            case 4:
                for (var i = 0; i < 7; i++) {
                    dayArr.push({
                        year: '',
                        month: '',
                        day: i + 1
                    });
                }
                self.overflow = false;
                break;
            case 6:
                self.overflow = true;
                break;
            default:
                self.overflow = false;
                break;
        }
        return dayArr;
    };

    self.initDays = function (timeStamp) {
        var tmp_date = new Date();
        self.today = tmp_date.getDate();
        self.toMonth = tmp_date.getMonth() + 1;
        self.toYear = tmp_date.getFullYear();

        if (self.defaultSelected) {
            self.selectedDay = self.today;
            self.selectedMonth = self.toMonth;
            self.selectedYear = self.toYear;
        }

        /**
         * 显示年份，月份应该可以配置
         * 为一个max和min
         * 需要修改
         */
        // todo
        // if (self.max) {
        //     self.max = 
        // }
        // if (self.min) {
        //     self.min = 
        // }
        // if (self.initTime) {
        //     self.max = 
        //     self.min = 
        // }
        for (var prev = self.toYear - 10, last = self.toYear + 11; prev < last; prev++) {
            self.yearList.push(prev);
        }

        self.dayArr = self.drawDays(timeStamp);
        self.update();
    };

    self.getNum = function (v) {
        return v > 10 ? v : '0' + v;
    }

    self.formatter = function (type) {
        var date = new Date(self.selectedYear, self.selectedMonth - 1, self.selectedDay, 0, 0, 0);
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
                });
                break;
        }
        return ret;
    };

    /**
     * 点击天数
     */
    self.dayClicked = function (e) {
        self.selectedDay = e.item.day;
        self.selectedMonth = e.item.month;
        self.selectedYear = e.item.year;
        self.onSelect && self.onSelect(self.formatter, self.getYear(), self.getMonth(), self.getDay());
        self.update();
    };


    // 首先这个是隐藏的
    self.open = false;

    self.getAbsPoint = function (elm) {
        var x = elm.offsetLeft;
        var y = elm.offsetTop;
        var height = document.documentElement.offsetHeight;
        var width = document.documentElement.offsetWidth;
        while (elm = elm.offsetParent) {
            x += elm.offsetLeft;
            y += elm.offsetTop;
        }
        return {
            'x': x,
            'y': y
        };
    };

    self.location = function (e) {
        if (self.element) {
            var pos = self.getAbsPoint(self.element);
            self.root.style.position = 'absolute';
            self.root.style.top = (pos.y + self.element.offsetHeight) + 'px';
            self.root.style.left = pos.x + 'px';
        }
    };

    self.closeIt = function (e) {
        var className = e.target.className;
        if (
            e.target === self.element ||
            classList.indexOf(className) > -1 ||
            className.indexOf('itk-calendar') > -1 && className.indexOf('itk-calendar-day') === -1
        ) {
            return;
        }
        self.open = false;
        self.update();
    };

    self.openIt = function (e) {
        self.open = true;
        self.update();
        self.location(e);
    };

    /**
     * 在目标卸载时解绑
     */
    self.unbindEvent = function () {
        if (self.element) {
            document.removeEventListener('click', self.closeIt, false);
            self.element.removeEventListener('click', self.openIt, false);
        }
    };

    self.on('mount', function () {
        // 直接拿到配置
        var config = self.opts.opts || self.opts || {};
        self.yearList = [];
        self.mapping(config);
        self.langMixin(self.customLang);
        self.initWeekList(self.language);
        self.initDays(self.initTime);

        if (self.element) {
            // some styles;

            if (!utils.hasClass(self.element, 'itk-calendar-input') && self.element.getAttribute('calendar') !== null) {
                var parent = self.element.parentNode;
                var wrap = document.createElement('label');
                wrap.className = classList[0];
                parent.insertBefore(wrap, self.element);
                utils.addClass(self.element, classList[1]);
                wrap.appendChild(self.element);
                var icon = document.createElement('span');
                icon.className = classList[2];
                wrap.appendChild(icon);
                self.element = wrap;
            }

            document.addEventListener('click', self.closeIt, false);
            self.element.addEventListener('click', self.openIt, false);
        }
        else {
            self.open = true;
        }
        self.update();
    });

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
     * 看是否到边界
     */
    self.isBoundary = function (y, m, direction) {
        var firstYear = self.yearList[0];
        var lastYear = self.yearList[self.yearList.length - 1];
        if (
            y < firstYear ||
            y > lastYear ||
            y === firstYear && m === 0 && direction === -1 ||
            y === lastYear && m === 13 && direction === 1
        ) {
            return false;
        }
        return [y , m];
    };

    /**
     * 获取选择的天
     * @return {Number}
     */
    self.getDay = function () {
        return self.selectedDay;
    };

    self.reset = function (date) {
        self.dayArr = self.drawDays(new Date(date[0], date[1], 1).getTime());
        self.update();
    }

    // self.nextYear = function () {
    //     var date = self.isBoundary(self.year.val + 1, self.month.val - 1);
    //     if (date) {
    //         self.reset(date);
    //     }
    // };

    self.nextMonth = function () {
        var year = self.year.val;
        var month = self.month.val - 1;
        year = month === 11 ? year + 1 : year;
        month = month === 11 ? 0 : month + 1;
        var date = self.isBoundary(year, month, 1);
        date && self.reset(date);
    };

    // self.prevYear = function () {
    //     var date = self.isBoundary(self.year.val - 1, self.month.val - 1);
    //     if (date) {
    //         self.reset(date);
    //     }
    // };

    self.prevMonth = function () {
        var month = self.month.val - 1;
        var year = self.year.val;
        year = month === 0 ? year - 1 : year;
        month = month === 0 ? 11 : month - 1;
        var date = self.isBoundary(year, month, -1);
        date && self.reset(date);
    };

    self.openYearList = function () {
        self.openList = !self.openList;
    };

    self.clickYear = function (e) {
        self.openList = false;
        self.reset([e.item.i, self.month.val - 1]);
    };
    </script>
</itk-calendar>