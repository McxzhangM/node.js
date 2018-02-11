/*
* 创建一个服务器，监听端口号8888；
*/

var http = require("http");

http.createServer(function (require, response){

    response.writeHead(200,{'Content-Type':'text/plain'});

    response.end('Hello world2\n');

}).listen(8888);

console.log('Server running at http://10.5.114.39:8888');