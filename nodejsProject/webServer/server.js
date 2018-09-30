var http = require("http");
var fs = require("fs");
var url = require("url");

var json_data = {
    title : "标题",
    image : "url",
    link : "link"
}

http.createServer(function(req,res){

    var pathname = url.parse(req.url).pathname;


    fs.readFile(pathname.substr(1),function(err, data){
            if(err){
                console.log("fs-----11"+err);
                res.writeHead(404, {'Content-Type': 'text/html'});
            }
            switch(pathname.substr(1)){
                case 'image/001.jpg':
        
                    res.writeHead(200,{"Content-Type":"image/jpeg"});
                    res.write(data);
                    break;
                case 'index.html':
        
                    res.writeHead(200,{"Content-Type":"text/html"});
                    res.write(data);
                    break;
                case 'aa':
                    res.writeHead(200,{"Content-Type":"application/json"});//application/json
                    res.write(JSON.stringify(json_data),"utf-8");
                    break; 
            }
        res.end();
    });

}).listen(8889,"10.5.114.77");

console.log("server start listen 10.5.114.77");