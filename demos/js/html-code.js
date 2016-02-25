(function() {
    var demoArea = document.getElementById('demo-html');
    var sourceCodeArea = document.createElement('pre');
    sourceCodeArea.innerHTML = '<code class="language-markup"><script type="prism-html-markup">' + demoArea.innerHTML + '<\/script><\/code>';
    document.body.appendChild(sourceCodeArea);
})();