<table-view>
    <table>
        <tr>
            <th>测试一</th>
            <th>测试二</th>
            <th>测试三</th>
        </tr>
        <tr each={ data }>
            <td>{ count }</td>
            <td>{ pagesize }</td>
            <td>{ showNumber }</td>
        </tr>
    </table>

    var self = this;
    self.data = self.opts.opts;
</table-view>