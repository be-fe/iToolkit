(function() {
    var demoArea = document.getElementById('demo-script');
    var sourceCodeArea = document.createElement('pre');
    sourceCodeArea.innerHTML = '<code class="language-javascript">' + demoArea.innerHTML + '<\/code>';
    document.body.appendChild(sourceCodeArea);
})();