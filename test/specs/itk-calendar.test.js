function howManyDaysInThisMonth(month) {
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
            var year = new Date().getFullYear();
            ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? ret = 29 : ret = 28;
            break;
        default:
            throw new Error('你算错了');
            break;
    }
    return ret;
}

function TO(fn) {
    setTimeout(fn);
}

describe("test-itk-calendar", function () {
    it("itk-calendar language defalut", function () {
        root.innerHTML = '<itk-calendar></itk-calendar>';
        var calendar = riot.mount('itk-calendar', {});
        expect(calendar[0].weekArr).to.eql(['Su','Mo','Tu','We','Th','Fr','Sa']);
        expect(calendar[0].monthArr).to.eql(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']);
    });

    it("itk-calendar language zh_cn", function () {
        root.innerHTML = '<itk-calendar></itk-calendar>';
        var calendar = riot.mount('itk-calendar', { language: 'zh_cn' });
        expect(calendar[0].weekArr).to.eql(['日','一','二','三','四','五','六']);
        expect(calendar[0].monthArr).to.eql(['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']);
    });

    it("itk-calendar language customize", function () {
        root.innerHTML = '<itk-calendar></itk-calendar>';
        var calendar = riot.mount('itk-calendar', {
            weekArr: ['星期天','星期一','星期二','星期三','星期四','星期五','星期六'],
            monthArr: ['我是一月','我是二月','我是三月','我是四月','我是五月','我是六月','我是七月','我是八月','我是九月','我是十月','我是十一月','我是十二月']
        });
        expect(calendar[0].weekArr).to.eql(['星期天','星期一','星期二','星期三','星期四','星期五','星期六']);
        expect(calendar[0].monthArr).to.eql(['我是一月','我是二月','我是三月','我是四月','我是五月','我是六月','我是七月','我是八月','我是九月','我是十月','我是十一月','我是十二月']);
    });

    it("itk-calendar 点击关闭", function () {
        root.innerHTML = '<input id="input" type="button" value="点击"/><itk-calendar></itk-calendar>';
        var input = root.querySelector('#input');
        var calendar = riot.mount('itk-calendar', { element: input });
        expect(calendar[0].open).to.be.equal(false);
        input.click();
        TO(function () {
            expect(calendar[0].open).to.be.equal(true);
            root.click();
            TO(function () {
                expect(calendar[0].open).to.be.equal(false);
            })
        });
    });

    it("itk-calendar draw days", function () {
        root.innerHTML = '<itk-calendar></itk-calendar>';
        var calendar = riot.mount('itk-calendar', {});
        var dayArr = [];
        var date = new Date();
        var thisMonth = date.getMonth() + 1;
        var thisMonthDays = howManyDaysInThisMonth(thisMonth);
        var prevMonthDays = howManyDaysInThisMonth(thisMonth - 1);
        var nextMonthDays = howManyDaysInThisMonth(thisMonth + 1);
        date.setDate(1);
        var firstDay = date.getDay();
        date.setDate(thisMonthDays);
        var lastDay = date.getDay();
        dayArr = dayArr
            .concat((new Array(firstDay === 7 ? 0 : (7 - firstDay) ^ 7)).map(function (v, i) {
                return prevMonthDays - i;
            }))
            .concat((new Array(thisMonthDays)).map(function (v, i){
                return i + 1;
            }))
            .concat((new Array((lastDay === 7 ? 6 : 6 - lastDay))).map(function (v, i){
                return i + 1;
            }));
        
        expect(calendar[0].dayArr).to.eql(dayArr);
    });

    it("itk-calendar 获取时间", function () {
        root.innerHTML = '<input id="input" type="button" value="点击"/><itk-calendar></itk-calendar>';
        var input = root.querySelector('#input');
        var ret = '';
        var calendar = riot.mount('itk-calendar', {
            element: input,
            onSelect: function (fomatter) {
                ret = fomatter('yyyy-mm-dd');
            }
        });
        input.click();
        TO(function () {
            var date = new Date();
            var thisYear = date.getFullYear();
            var thisMonth = date.getMonth() + 1;
            var thisMonthDays = howManyDaysInThisMonth(thisMonth);
            var day = Math.ceil(Math.random() * (thisMonthDays - 2));
            calendar[0].root.querySelectorAll('.itk-calendar-day')[day].click();
            expect(ret).to.be.equal(thisYear + '-' + thisMonth > 10 ? '0' + thisMonth : thisMonth + '-'  + (day + 1 > 10 ? '0' + day : day));
        });
    });

    it("itk-calendar 向前点击月份", function () {
        // todo
    });

    it("itk-calendar 向后点击月份", function () {
        // todo
    });

    it("itk-calendar 向前点击年份", function () {
        // todo
    });

    it("itk-calendar 向后点击年份", function () {
        // todo
    });

    it("itk-calendar 日期选中状态", function () {
        // todo
    });

    it("itk-calendar 默认标注当天", function () {
        // todo
    });
});