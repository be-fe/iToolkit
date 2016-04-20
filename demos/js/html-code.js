(function() {
    var demoArea = document.getElementById('demo-html');
    var sourceCodeArea = document.createElement('pre');
    sourceCodeArea.innerHTML = '<code class="language-markup"><script type="prism-html-markup">' + demoArea.innerHTML + '<\/script><\/code>';
    if (document.querySelector('.container')) {
        document.querySelector('.container').appendChild(sourceCodeArea)
    }
    else {
        document.body.appendChild(sourceCodeArea);
    }
})();