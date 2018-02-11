/*
*get请求获取url参数
*/
var http = require('http');

var url = require('url');

var util = require('util');

http.createServer(function(req,res){
    var parse =url.parse(req.url,true);
     
    res.writeHead(200,{"Content-Type" : "text/plain; charset=utf-8"});
    res.end(util.inspect(parse));

}).listen(8888,"10.5.114.39");

console.log("server star");