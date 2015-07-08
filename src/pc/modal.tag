<modal>
    <div class="itoolkit-modal-dialog" style='width:{width}px; height:{height}px'>
        <div class="itoolkit-modal-title">
            <span>{ title }</span>
            <div class="itoolkit-modal-close-wrap" onclick={ close }>
                <div class="itoolkit-modal-close"></div>
            </div>
        </div>
        <div class="itoolkit-modal-container">
           <yield>
        </div>
    </div>

    var self = this;
    var config = self.opts.opts || self.opts;
    for (i in config) {
        self[i] = config[i];
    }
    self.width = config.width || 600;
    self.height = config.height || 300;

    close(e) {
        self.root.style.display = 'none';
    }
    document.querySelector("[modal-open-target='" + self.root.id + "']").onclick = function() {
        self.root.style.display = 'block';
    }

    self.root.open = function() {
        self.root.style.display = 'block';
    }

    self.root.close = function() {
        self.root.style.display = 'none';
    }

    // document.querySelector("[modal-close-target='" + self.root.id + "']").onclick = function() {
    //     self.root.style.display = 'none';
    // }
</modal>