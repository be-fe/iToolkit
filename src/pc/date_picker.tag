<date-picker>
    <input type="text" value="" class="datepicker">
    
    <script>
        var self = this;
        var EL = self.root;
        var config = self.opts.opts || self.opts;
        var path = config.path || '';
        utils.jsLoader([
            path + 'datepicker.js',
            path + 'datepicker.css'
        ],function () {
            var inputEle = self.root.getElementsByTagName('input')[0]
                config.fields = [self.root.getElementsByTagName('input')[0]];
                new DatePicker(config);
        });
    </script>

</date-picker>