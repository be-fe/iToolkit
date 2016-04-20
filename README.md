iToolkit
========

iToolkit are some Commonly used tools build on [Riot](https://muut.com/riotjs/) Framework, you can only use data to create view, and have similar way to invoke them.  
e.g:  

    <div id="test">
        <itk-tree></itk-tree>
    </div>
    <script>
        $.ajax({
            url: '/test',
            success: function(data) {
                riot.mount('#test itk-tree', {data: data, root: true});
            }
        })
    </script>


[Index](http://be-fe.github.io/iToolkit/demos/index.html)     
[Document](http://be-fe.github.io/iToolkit/demos/doc.html)  
[中文readme](https://github.com/BE-FE/iToolkit/blob/master/README_Chinese.md)  
