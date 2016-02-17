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
    link: true,         //若为true，则联动
    openLevel: 1,    //默认展开的层级
    handleData: true,   //data为一维数组，选true, data为树结构，选false
    name: 'title',      //名称字段在接口中的字段名
    onLeftClick: function(item, target) {
        alert('This item\'s id is: ' + item.id);
    },
    //左键点击的回调。第一个参数为对应的数据item, 第二个参数为对应的dom
    folder: true, //展示folder icon,点击name进行展开操作

    //***check支持***********

    showCheck: true,   //是否展示checkbox, 默认为false;
    linkCheck: true,   //是否递归选中, 未实现
    onCheck: function(item, target) {
        alert(item.id + 'checked');
    },  //checkbox选中时的回调
    onUnCheck: function(item, target) {
        alert(item.id + 'unchecked');
    }  //checkbox取消时的回调
};
describe("Basic itk-tree", function () {
    it("itk-tree", function () {
        root.innerHTML = "<itk-tree></itk-tree>";
        riot.mount('itk-tree', treeOpts);
        expect(root.getElementsByTagName('itk-tree')[0].firstChild.className).to.be.equal("tree-item-wrap");
    });
});