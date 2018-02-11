var http = require("http");
var fs = require("fs");
var url = require("url");

http.createServer(function(req,res){

    var pathname = url.parse(req.url).pathname;

    fs.readFile(pathname.substr(1),function(err,data){
        if(err){
            console.log(err + "-------------------0")

            res.writeHead(404,{"Content-Type":"text/html"});
        }else{
            res.writeHead(200,{"Content-Type":"text/html"});

            res.write(data.toString());
        }
        res.end();
    })
}).listen(8888,"10.5.114.39");

console.log("server start listen 10.5.114.39");