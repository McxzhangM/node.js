/*
*测试phantomjs爬取数据后存入数据库
*/
var http = require("http");  //http网络请求模块
var fs = require("fs");   //文件操作模块
var request = require("request");   //req请求模块
var webpage =  require("webpage");  //PhantomJS的核心模块，用于网页操作
var page = webpage.crete();    //创建webpage实例
var url = "www.baidu.com";


//爬取数据
function startCrawler(){
    
    //打开网页，status：success；fail
    page.open(url,function(status){
        console.log(status);
    })

    page.exit();
}

startCrawler();