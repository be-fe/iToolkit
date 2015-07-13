<modal>
    <div class="itoolkit-modal-dialog" style='width:{width}; height:{height}'>
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
    self.height = config.height || 'auto';

    self.on('mount', function() {
        var container = self.root.querySelector('.itoolkit-modal-container');
        var head = self.root.querySelector('.itoolkit-modal-title');
        var headHeight = parseInt(window.getComputedStyle(head, null).height.replace('px', ''));
        if (config.height) {
            container.style.height = (self.height - headHeight - 2) + 'px';
        }
        //高度存在时，计算container的高度
    })

    close(e) {
        self.root.style.display = 'none';
    }
    if (document.querySelector("[modal-open-target='" + self.root.id + "']")) {
        document.querySelector("[modal-open-target='" + self.root.id + "']").onclick = function() {
            self.root.style.display = 'block';
        }
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