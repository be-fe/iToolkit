function howManyDaysInThisMonth(year, month) {
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
}

function drawDays(timeStamp) {
    var date;
    if (timeStamp) {
        date = new Date(timeStamp);
    }
    else {
        date = new Date();
    }
    var thisMonth = date.getMonth() + 1;
    var thisYear = date.getFullYear();

    var thisMonthDays = howManyDaysInThisMonth(thisYear, thisMonth);
    var prevMonthDays = howManyDaysInThisMonth(thisYear, thisMonth - 1);
    var nextMonthDays = howManyDaysInThisMonth(thisYear, thisMonth + 1);
    date.setDate(1);
    var firstDay = date.getDay();
    date.setDate(thisMonthDays);
    var lastDay = date.getDay();
    var dayArr = [];
    dayArr = dayArr
        .concat((new Array(firstDay === 0 ? 1 : ((7 - firstDay) ^ 7) + 1).join(0).split('')).map(function (v, i) {
            return {
                year: '',
                month: '',
                day: prevMonthDays - i
            }
        }).reverse());
    dayArr = dayArr.concat((new Array(thisMonthDays + 1).join(0).split('')).map(function (v, i){
            return {
                year: thisYear,
                month: thisMonth,
                day: i + 1
            }
        }));
    dayArr = dayArr.concat((new Array(lastDay === 0 ? 7 : (6 - lastDay) + 1).join(0).split('')).map(function (v, i){
            return {
                year: '',
                month: '',
                day: i + 1
            }
        }));
    return dayArr;
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

    it("itk-calendar 打开日历", function () {
        root.innerHTML = '<input id="input" type="button" value="点击"/><itk-calendar></itk-calendar>';
        var input = root.querySelector('#input');
        var calendar = riot.mount('itk-calendar', { element: input });
        expect(calendar[0].open).to.be.equal(false);
        calendar[0].openIt();
        expect(calendar[0].root.style.display).to.be.equal('');
    });

    it("itk-calendar draw days", function () {
        root.innerHTML = '<itk-calendar></itk-calendar>';
        var calendar = riot.mount('itk-calendar', {});
        var dayArr = [];
        var date = new Date();
        dayArr = drawDays(date.getTime());
        expect(calendar[0].dayArr).to.eql(dayArr);
    });

    it("itk-calendar 显示今天", function () {
        root.innerHTML = '<input id="input" type="button" value="点击"/><itk-calendar></itk-calendar>';
        var input = root.querySelector('#input');
        var calendar = riot.mount('itk-calendar', {
            showToday: true
        });
        var today = calendar[0].root.querySelectorAll('.today');
        var hasToday = !!today && today.length === 1;
        expect(hasToday).to.be.equal(true);
    });

    it("itk-calendar 显示被选中", function () {
        root.innerHTML = '<input id="input" type="button" value="点击"/><itk-calendar></itk-calendar>';
        var input = root.querySelector('#input');
        var calendar = riot.mount('itk-calendar', {
            showToday: true,
            showSelected: true
        });
        var date = new Date();
        var thisYear = date.getFullYear();
        var thisMonth = date.getMonth() + 1;
        var thisDay = date.getDate();
        calendar[0].dayClicked({
            item: {
                day: thisDay,
                month: thisMonth,
                year: thisYear
            }
        })
        var selected = calendar[0].root.querySelectorAll('.selected');
        var hasSelected = !!selected && selected.length === 1;
        expect(hasSelected).to.be.equal(true);
    })

    it("itk-calendar 向前点击月份", function () {
        root.innerHTML = '<input id="input" type="button" value="点击"/><itk-calendar></itk-calendar>';
        var input = root.querySelector('#input');
        var calendar = riot.mount('itk-calendar', {
            showToday: true,
            showSelected: true
        });
        calendar[0].prevMonth();

        var date = new Date();
        var thisMonth = date.getMonth();
        var thisYear = date.getFullYear();
        thisYear = thisMonth === 0 ? thisYear - 1 : thisYear;
        thisMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        var dayArr = drawDays(new Date(thisYear, thisMonth, 1).getTime());
        expect(calendar[0].month.val).to.be.equal(thisMonth + 1);
        expect(calendar[0].year.val).to.be.equal(thisYear);
        expect(calendar[0].dayArr).to.eql(dayArr);
    });

    it("itk-calendar 向后点击月份", function () {
        root.innerHTML = '<input id="input" type="button" value="点击"/><itk-calendar></itk-calendar>';
        var input = root.querySelector('#input');
        var calendar = riot.mount('itk-calendar', {
            showToday: true,
            showSelected: true
        });
        calendar[0].nextMonth();
        var date = new Date();
        var thisMonth = date.getMonth();
        var thisYear = date.getFullYear();
        thisYear = thisMonth === 11 ? thisYear + 1 : thisYear;
        thisMonth = thisMonth === 11 ? 1 : thisMonth + 1;
        date = new Date(thisYear, thisMonth, 1);
        var dayArr = drawDays(date.getTime());
        expect(calendar[0].month.val).to.be.equal(thisMonth + 1);
        expect(calendar[0].year.val).to.be.equal(thisYear);
        expect(calendar[0].dayArr).to.eql(dayArr);
    });

    it("itk-calendar 向前点击年份", function () {
        root.innerHTML = '<input id="input" type="button" value="点击"/><itk-calendar></itk-calendar>';
        var input = root.querySelector('#input');
        var calendar = riot.mount('itk-calendar', {
            showToday: true,
            showSelected: true
        });
        calendar[0].prevYear();
        var date = new Date();
        var thisMonth = date.getMonth();
        var thisYear = date.getFullYear() - 1;
        date = new Date(thisYear, thisMonth, 1);
        var dayArr = drawDays(date.getTime());
        expect(calendar[0].month.val).to.be.equal(thisMonth + 1);
        expect(calendar[0].year.val).to.be.equal(thisYear);
        expect(calendar[0].dayArr).to.eql(dayArr);
    });

    it("itk-calendar 向后点击年份", function () {
        root.innerHTML = '<input id="input" type="button" value="点击"/><itk-calendar></itk-calendar>';
        var input = root.querySelector('#input');
        var calendar = riot.mount('itk-calendar', {
            showToday: true,
            showSelected: true
        });
        calendar[0].nextYear();
        var date = new Date();
        var thisMonth = date.getMonth();
        var thisYear = date.getFullYear() + 1;
        date = new Date(thisYear, thisMonth, 1);
        var dayArr = drawDays(date.getTime());
        expect(calendar[0].month.val).to.be.equal(thisMonth + 1);
        expect(calendar[0].year.val).to.be.equal(thisYear);
        expect(calendar[0].dayArr).to.eql(dayArr);
    });
});