var http = require("http");
var fs = require("fs");
var url = require("url");
var cp = require("child_process");

//python传参
var arg1 = 'hello'
var arg2 = 'jzhou'

http.createServer(function(req,res){

    var pathname = url.parse(req.url).pathname;

    fs.readFile(pathname.substr(1),function(err,data){
        if(err){
            console.log(err + "-------------------0")

            res.writeHead(404,{"Content-Type":"text/html"});
        }else{
            res.writeHead(200,{"Content-Type":"text/html"});

            res.write(data.toString());

            //执行Python脚本文件
            cp.exec('python testPy.py '+arg1+' '+arg2+' ',function(error,stdout,stderr){
                if(error !== null){
                    console.log('exec error:'+ error);
                    return;
                }
                console.log(stdout);
                console.log('exec success:');
            });
        }
        res.end();
    })
}).listen(8888);

console.log("server start listen localhost:8888");