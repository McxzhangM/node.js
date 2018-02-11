/*
* Post请求获取url参数,手动解析请求体
*/

var http = require('http');

var queryString = require('querystring');

var htmlPost =
'<html><head><meta charset="utf-8"><title>菜鸟教程 Node.js 实例</title></head>' +
  '<body>' +
  '<form method="post">' +
  '网站名： <input name="name"><br>' +
  '网站 URL： <input name="url"><br>' +
  '<input type="submit">' +
  '</form>' +
  '</body></html>';

http.createServer(function(req,res){

    var post = "";

    req.on('data',function(chunk){
        post += chunk; 
    });

    req.on('end',function(){

        res.writeHead(200,{"Content-Type":"text/html,charset=utf8"});

        console.log("Post1:" + post);

        post = queryString.parse(post);

        if(post.name && post.url){
            console.log("Post2:" + JSON.stringify(post));

            res.write("post:" + post.name);

            res.write("url:" + post.url);
        }else{
            res.write(htmlPost);
        }
        
        res.end();
    });
}).listen(8888);

console.log("server star");