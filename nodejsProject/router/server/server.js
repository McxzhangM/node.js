/*
* 创建服务
*/

var http = require("http"); 

var url = require("url");

exports.serverStart = function serverStart(router){

    function onRequest(request,response){

        //获取浏览器中传入url链接，获取路径
        var pathName = url.parse(request.url).pathname;
        
        //根据不同路径，通过路由筛选显示不同页面
        router(pathName,response);
    }

    http.createServer(onRequest).listen(8888,"10.5.114.39");

    console.log("server start");
}
