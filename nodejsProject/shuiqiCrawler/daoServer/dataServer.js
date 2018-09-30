/*
*数据处理
*/
http = require('http');
url = require("url");
fs  = require("fs");

http.createServer(function(req,res){

    //获取接口路径
    var url_info = url.parse(req.url);

    //判断接口路径是否正确
    if(url_info.pathname == '/json'){
        res.writeHead(200,{'Content-Type': 'text/plain'});

        fs.readFile("testData/nameData.json",{flags:"r",encoding: "utf-8"},function(err,data){
            if(err){
              res.end("read file error" + err);

              return;
            }

            res.end(JSON.stringify(data));
        });

    }else{
        res.writeHead(200,{'Content-Type': 'text/plain'});
        res.end("<h3>404</h3>");
    }
    
}).listen(8897);
console.log("server start http://loacalhost:8897");