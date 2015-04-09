<tab>
    <ul>
        <li each={ data } onclick={ parent.toggle }>{ title }</li>
    </ul>
    <div class="tab-content">
       { content }
    </div>

    var self = this
    self.data = self.opts.opts.data;
    if (self.data.length > 0) {
        self.content = self.data[0].content;
    }
    

    toggle(e) {
        self.content = e.item.content;
        self.update();
    }
</tab>