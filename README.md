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
        <input name="t1" value="{ data.a }" if="{ data.a==1 }">
        <input name="t2" value="{ data.b }" valid="email">
        <input name="t3" valid="url">
        <input name="t4" value="{ data.b }" max="10">
        <input type="submit" value="submit">
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
####example code:
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

###Div
####example code:
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
