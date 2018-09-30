var http = require("http");
var path = require("path");
var config = require("./config/default");
var fs = require("fs");
var mime = require("./config/mime");

class StaticServer{
    constructor(){
        this.port = config.port;
        this.root = config.root;
        this.indexPage = config.indexPage;
    }

    start(){
        http.createServer(function(req,res){
            const pathName = "." + path.normalize(req.url);

            if(pathName == "./json"){
                dataHandle(res);
                return;
            }

            //静态资源路由处理
            routeHandler(pathName,req,res);

        }).listen(this.port,function(err){
            if(err){
                console.log("http error:"+ err);
            }
            console.log("server star 8990");
        });
    }
}

//文件不存在
function respondNotFound(req,res){
    res.writeHead(404,{
        'Content-Type' : 'text/html'
    });

    res.end('<p>Not Found</p>')
}

//读取指定文件
function respondFile(pathName,req,res){

    //路径异常处理，处理路径
    if(pathName == "./"){
        pathName = "./index.html"
    }

    const readStream = fs.createReadStream(pathName);

    var typeValue = mime.lookup(pathName);

    //路径异常处理，处理type类型
    if(typeValue == undefined){
        typeValue = 'text/html';
    }
    res.setHeader('Content-Type',typeValue);
    readStream.pipe(res);
}

//静态资源路由处理
function routeHandler(pathName,req,res){
    fs.stat(pathName,function(err,stat){
        if(err){
            respondNotFound(req,res);
        }else{
            respondFile(pathName,req,res);
        }
    })
}

//数据处理
function dataHandle(res){

    fs.readFile("data/nameData.json",{flags:"r",encoding: "utf-8"},function(err,data){
        if(err){
        res.writeHead(200,{'Content-Type': 'text/plain'});
        res.end("<h3>404</h3>");

        return;
        }
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(data);
    });
}

module.exports = StaticServer;