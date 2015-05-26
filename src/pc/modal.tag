<modal>
    <div class="modal-dialog" style='width:{width}px; height:{height}px'>
        <div class="modal-title">
            <span>{ title }</span>
            <div class="modal-close-wrap" onclick={ close }>
                <div class="modal-close"></div>
            </div>
        </div>
        <div class="modal-container">
           <yield>
        </div>
    </div>

    var self = this;
    var config = self.opts.opts || self.opts;
    for (i in config) {
        self[i] = config[i];
    }
    self.width = config.width || 600;
    self.height = config.width || 300;

    close(e) {
        self.root.style.display = 'none';
    }
    document.querySelector("[modal-open-target='" + self.root.id + "']").onclick = function() {
        self.root.style.display = 'block';
    }

    // document.querySelector("[modal-close-target='" + self.root.id + "']").onclick = function() {
    //     self.root.style.display = 'none';
    // }
</modal>