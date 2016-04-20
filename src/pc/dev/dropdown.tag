<dropdown>
	<yield>
	<div class="r-dropdown">{ title }</div>
	<ul class="r-downdown-menu">
		<li class="r-dropdown-list" each={ data }><a href={ link|'javascript:void(0)' }>{ name }</a></li>
	</ul>
	<script>
	var self = this;
    var EL = self.root;
    var config = self.opts.opts || self.opts;
	</script>
</dropdown>