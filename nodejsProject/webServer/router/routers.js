/*
*路由
*/
var express =  require("express");
var app = express();
var router = express.Router();
var url = require("url");
var querystring = require("querystring");
var fs = require("fs");

var options = {
    web_dir: "D:/Github/node.js/nodejsProject/webServer",//当前文件路径
    pathname:"",       //通用文件，图片路由路径
    download_path: "", //下载链接
    arg:""             //文件下载链接参数
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

//文件下载
router.get('/download',function(req,res,next){
    options.arg = querystring.parse(url.parse(req.url).query);
    console.log(options.arg);
    options.download_path = options.web_dir + "/upload_image_dir/" + options.arg.name +'.'+ options.arg.befor_type;

    fs.exists(options.download_path,function(exist) {
        if(exist){
            //todo  文件名应为options.arg.name +'.'+ options.arg.after_type
            res.download(options.download_path,options.arg.name+'.'+ options.arg.after_type,function(error){
                if(error){
                    res.send("下载文件失败");
                }
            });
        }else{
            res.send("文件不存在");
        }
    });
})


//通用文件路由
router.get('/view/*',function(req,res,next){
    options.pathname = url.parse(req.url).pathname;
    res.sendFile(options.web_dir + options.pathname);
})

//图片
router.get('/upload_image_dir/*',function(req,res,next){
    options.pathname = url.parse(req.url).pathname;
    res.sendFile(options.web_dir + options.pathname);
})

//404
router.get('*',function(req,res){
    res.sendFile(options.web_dir + "/error_html/404.html");
})

module.exports = router;