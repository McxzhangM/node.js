/*
*测试node.js执行phantom.js脚本
*/
(function(){
    var page = require('webpage').create();
    var system = require('system');
    var h1 ={};
    //脚本接受参数
    // console.log('system1:'+system.args[1]);
    // console.log('system2:'+system.args[2]);
    //解决中文乱码问题
    //phantom.outputEncoding="gbk";
    //不加载图片
    page.settings.loadImages = false;
    //phantomJS 超时控制
    page.settings.resourceTimeout = 5000; // 5 seconds
    page.onResourceTimeout = function(e) {
        console.log(e.errorCode);   // it'll probably be 408
        console.log(e.errorString); // it'll probably be 'Network timeout on resource'
        console.log(e.url);         // the url whose request timed out
        console.log(JSON.stringify(e));
        phantom.exit();
    };

    page.open("https://blog.csdn.net/hacker_Lees/article/details/77231252?locationNum=10&fps=1", function(status) {
        if(status === "success"){
            if (page.injectJs("jquery-1.10.1.js")) {
                    h1 = page.evaluate(function() {
                    var modle = {
                        title:''
                    };
                    modle.title =  $('.title-article').text();
                    return modle;
                }); 
                console.log(JSON.stringify(h1));
                page.close();
                phantom.exit();
            }
        }else{
            page.close();
            phantom.exit();
        }
    });
})()


//  page.includeJs("http://code.jquery.com/jquery-1.10.1.min.js", 
//  function(e) {
//      console.log(e);
//      page.evaluate( console.log($('#Header1_HeaderTitle').text()) );
     
//      page.close();
//      phantom.exit();
//  }
 