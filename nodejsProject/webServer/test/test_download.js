var http = require('http');
var fs = require('fs');
var server = http.createServer(function (req, res) {

    fs.exists("D:/Github/node.js/nodejsProject/webServer/upload_image_dir/test120180602205421.png",function(exist) {
        if(exist){
            console.log("file exist");
            fs.readFile("D:/Github/node.js/nodejsProject/webServer/upload_image_dir/test120180602205421.png", function (err, data) {
                res.writeHead(200,{
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': 'attachment; filename=data.png',
                    'Accept-Length': 1024,
                });
                res.end(data);
            });
        }else{
            console.log("file not exist");
        }
    })

}).listen(8000)
