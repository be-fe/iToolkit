iToolkit
========

iToolkit are some Commonly used tools build on [Riot](https://muut.com/riotjs/) Framework, you can only use data to create view, and have similar way to invoke them.  
e.g:  

    <div id="test">
        <tree></tree>
    </div>
    <script>
        $.ajax({
            url: '/test',
            success: function(data) {
                riot.mount('#test tree', {data: data, root: true});
            }
        })
    </script>

[中文readme](https://github.com/BE-FE/iToolkit/blob/master/README_Chinese.md)   
[中文文档](https://github.com/BE-FE/iToolkit/blob/master/doc.md)    
[Demo](http://be-fe.github.io/iToolkit/iToolkit_pc.html)  
[新版文档](http://be-fe.github.io/iToolkit/docs/book/index.html)  

### Table
#### Table generator:
[Demo](http://be-fe.github.io/iToolkit/iToolkit_pc.html#table)   
HTML:

    <table-view>
        <rcol name="city"><a href="<%= desc%>"><%= city%></a></rcol>
        <rcol name="desc" width="100px"></rcol>
        <rcol name="name" alias="姓名"></rcol>
    </table-view>

JavaScript:

    var tableOpts = {
        data: [
            {city: 'Beijing', name: 'Sherman', desc: 'hehehehehhe'},
            {city: 'Beijing', name: 'Sherman', desc: 'hehehehehhe'},
            {city: 'Beijing', name: 'Sherman', desc: 'hehehehehhe'}
        ]
    }
    riot.mount('table-view', tableOpts);
    riot.mount('rcol');

#### Handle the table：
JavaScript:

    var dom = document.querySelector('table-view');
    dom.loadData([{city: 'LuoYang', name: 'mudan', desc: 'It is pretty'}]);  //load new data
    dom.appendData({city: 'LuoYang', name: 'mudan', desc: 'It is pretty'}); //append data
    dom.deleteData('city', 'LuoYang'); //delete data
    dom.clearData();  //clear data
    dom.orderData('city'); //order by 'city'
    dom.reverseData('city'); //reverse by 'city'

### Form
#### example code:
[Demo](http://be-fe.github.io/iToolkit/iToolkit_pc.html)   
HTML:

    <super-form action="/test">
        <input type="text" name="t1" value="{ data.a }" if="{ data.a==2 }">
        <input type="text" name="present" value="1" valid="present" max="10">
        <input type="text" name="email" value="xieyu@baidu.com" valid="email">
        <input type="text" name="url" value="http://www.baidu.com" valid="url">
        <input type="text" name="mobile" value="13927678767" valid="mobile">
        <input type="text" name="t3" value="test" valid="/test/">
        <input type="text" name="idcard" value="41030319880612000" customValid="isIDCard">
        <input type="text" name="t4" value="{ data.b }" min="3">
        <input type="text" name="t5" value="good! There it is!" max="9">
        <input type="text" name="t6" value="good! There it is!" max="9" min="2">
        <input type="text" name="t7" value="good! There it is!" min="7" allowEmpty="true">
        <input type="text" name="n1" value="1" valid="int">
        <input type="text" name="n2" value="1" valid="float">
        <input type="text" name="n3" value="1" valid="int" min="2">
        <input type="text" name="n4" value="1" valid="int" max="9">
        <input type="text" name="n5" value="1" valid="int" max="9" min="2">
        <input type="submit" value="提交">
    </super-form>

JavaScript:

    var formOpts = {
        data: {
            a: 1,
            b: 'hehe'
        },
        callback: function() {
            alert('success');
        },
        errCallback: function(params) {
            alert("error, params:" + params);
        },
        valid: true,
        normalSubmit: false,  //true is normal submit，false is ajax submit.
        submitingText: "submiting..."
    }
    riot.mount('super-form', formOpts);

### DatePicker
#### example code:
[Demo](http://be-fe.github.io/iToolkit/iToolkit_pc.html#datepicker)
HTML:

    <date-picker></date-picker>

JavaScript:

    var dpOpt = {
        path: '../src/plugins/datepicker/',         // dependents' path
        position: 'bottom left',                    // picker's position
        firstDay: 1,                                // 0~6
        minDate: new Date('2011-01-01'),            // picker's border
        maxDate: new Date('2020-12-31'),
        yearRange: [2011, 2020],                    // picker's year options
        theme: null,                                // theme
        onSelect: function (date) {                 // when we selected
            console.log('the day is selected', date);
        },
        onOpen: function () {
            console.log('picker is open');
        },
        onClose: function () {
            console.log('picker is closed');
        },
        onDraw: function () {
            console.log('going to other month');
        }
    }

    riot.mount('date-picker', dpOpt);

### Paginate
#### example code:
[Demo](http://be-fe.github.io/iToolkit/iToolkit_pc.html#paginate)   
HTML:
    
    <paginate></paginate>

JavaScript:

    var pageOpts = {
        count: 50,
        pagesize: 10,
        showNumber: 5,
        callback: function(index) {
            document.getElementById('page-number').innerHTML = index;
        }
    }
    riot.mount('paginate', pageOpts);

### Tree
#### example code:
[Demo](http://be-fe.github.io/iToolkit/iToolkit_pc.html#tree)   
HTML:
    
    <tree></tree>

JavaScript:

    var treeOpts = {
        data: [
            {id: 1, pid: null, title: 'root'},
            {id: 2, pid: 1, title: 'item1'},
            {id: 3, pid: 1, title: 'item2'},
            {id: 4, pid: 2, title: 'item3'},
            {id: 5, pid: 1, title: 'item4'},
            {id: 6, pid: 3, title: 'item5'},
            {id: 7, pid: 2, title: 'item6'},
        ],
        root: true,              //must be true
        handleData: true,        //array use true，treeData use false
        name: 'title',           // item name in the data
        onLeftClick: function(item, target) {
            alert('This item\'s id is: ' + item.id);
        }                        //left click callback
    }
    riot.mount('tree', treeOpts);

### Modal
#### example code:
[Demo](http://be-fe.github.io/iToolkit/iToolkit_pc.html#modal)    
HTML:
    
    <modal id="modal-demo">
        <h1>welcome!</h1>
        <p>welcome, king under the montain!</p>
        <p>{ data.desc }</p>
    </modal>
    <button modal-open-target="modal-demo">open modal</button>

JavaScript:

    var modalOpts = {
        height: 300,
        width: 300,
        title: 'Modal demo',
        data: {
            desc: 'My name is xieyu'
        }
    }
    riot.mount('modal', modalOpts);

### Div
#### example code:
HTML:

    <super-div>
        <h4>{ data.title }</h4>
        <p>{ data.desc }</p>
        <ul>
            <li each="{ data.list }">{ name }</li>
        </ul>
    </super-div>

JavaScript:

    var divOpts = {
        data: {
            title: 'The Avengers',
            desc: 'The story of super hero save the world.',
            list: [{name: "iron man"},{name: "Hulk"},{name: "American Captain"},{name: "Black widow"},{name:"Eagle Eye"}]
        },
    }
    riot.mount('super-div', divOpts);

#### API bind
HTML:

    <super-div id="jsonp" data-jsonp="/data/data.json">
        <h4>{ data.title }</h4>
        <p>{ data.desc }</p>
        <ul>
            <li each="{ data.list }">{ name }</li>
        </ul>
    </super-div>

    <super-div id="http-get" data-get="/data/data.json">
        <h4>{ data.title }</h4>
        <p>{ data.desc }</p>
        <ul>
            <li each="{ data.list }">{ name }</li>
        </ul>
    </super-div>

JavaScript:

    riot.mount('#jsonp', { params: {callback: 'jsonpcallback'} });
    riot.mount('#http-get', { params: {test: '1'} });

