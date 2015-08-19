##select-box
用于替代原生select标签

####HTML结构

```html
    <select-box></select-box>
```

####JavaScript

```JS
    var opt = {
		data: [
			{innerText: 'test', value: '1'},
			{innerText: 'test1', value: '2'},
			{innerText: 'test3', value: '3'},
		],
		mutiple: true,  //可选,多选选项，配合size使用
		size: 2,        //可选
		name: 'here',
		placeholder: 'hereIsPlaceHoler',
		callback: function (v) {
			console.log(v, v.name, v.value);
		}
	};
	riot.mount('select-box', opt);
```

####Demo
[SelectBox](../../../demos/selectBox.html)   
