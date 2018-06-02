/*
*路由
*/
var express =  require("express");
var app = express();
var router = express.Router();
var url = require("url");

var options = {
    web_dir: "D:/Github/node.js/nodejsProject/webServer",
};


router.get('/',function(req,res,next){
    res.sendFile(options.web_dir + "/index.html");
})

router.get('/index.html',function(req,res,next){
    res.sendFile(options.web_dir + "/index.html");
})

router.get('/index.js',function(req,res,next){
    res.sendFile(options.web_dir + "/index.js");
})

//通用文件路由
router.get('/view/*',function(req,res,next){

    var pathname = url.parse(req.url).pathname;
    res.sendFile(options.web_dir + pathname);
})

//404
router.get('*',function(req,res){
    res.sendFile(options.web_dir + "/error_html/404.html");
})

module.exports = router;