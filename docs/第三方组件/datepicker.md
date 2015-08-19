##datepicker
依赖第三方插件laydate实现的日期选择器组件

####HTML结构
```html
<date-picker id="d1">
	<input media /><div pTrigger class="btn btn-success">test</div>
</date-picker>
```

####JavaScript

```JavaScript
var d1Opt = {
	path: '',     //可选，依赖路径，如果依赖路径没有变动，可不填
	istime: true, //可选，是否显示时分秒选项，默认false
	issure: true, //可选，是否显示确认按钮，默认false
	istoday: true,//可选，是否显示今天按钮，默认false
	isclear: true,//可选，是否显示清空按钮，默认false
	format: 'YYYY-MM-DD hh:mm:ss',//可选，时间格式化，默认YYYY-MM-DD
	min: '2014-01-01 00:00:00',  //可选，最小边界
	max: '2015-12-30 23:59:59',  //可选，最大边界
	start: '2014-01-01 00:00:00',//可选，开始选择的日期
	choose: function (d) { //选择完成后的回调，返回format后的日期
		console.log(d)
	}
};
riot.mount('#d1', d1Opt);
```

####Demo
[DataPicker](../../../demos/dataPicker.html)    