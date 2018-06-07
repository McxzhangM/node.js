/*
*路由
*/
var express =  require("express");
var app = express();
var router = express.Router();
var url = require("url");
var querystring = require("querystring");
var fs = require("fs");
var cp = require("child_process");

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
    options.download_path = options.web_dir + "/upload_image_dir/" + options.arg.name +'.'+ options.arg.befor_type;
    options.exec_after_path = options.web_dir+"/download_image_dir/"+options.arg.name +'.'+ options.arg.after_type;

    fs.exists(options.download_path,function(exist) {
        if(exist){

            //处理下载可选项异常参数
            handleDownloadParameter();
            //执行Python脚本文件
            cp.exec('python testPy.py '+options.arg.name+' '+options.arg.befor_type+
            ' '+options.arg.after_type+' '+options.arg.input_test+
            ' '+options.arg.width+' '+options.arg.height+' '+options.arg.rotate+
            ' '+options.arg.position+' '+options.arg.color,
            function(error,stdout,stderr){
                if(error !== null){
                    console.log('exec error:'+ error);
                    return;
                }
                console.log('exec success:');

                res.download(options.exec_after_path,options.arg.name+'.'+ options.arg.after_type,function(error){
                    if(error){
                        res.send("下载文件失败");
                    }
                });
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

//处理下载可选项异常参数
function handleDownloadParameter(){

    //转换后类型
    if(options.arg.after_type ==""||undefined){
        options.arg.after_type = "null"
    }
    //添加的文字
    if(options.arg.input_test ==""||undefined){
        options.arg.input_test = "null"
    }
    //文字位置
    if(options.arg.position == ""||undefined){
        options.arg.position = "null"
    }
    //文字颜色
    if(options.arg.color == ""||undefined){
        options.arg.color = "null"
    }
    //图片宽度
    if(options.arg.width ==""||undefined){
        options.arg.width = "null"
    }
    //图片高度
    if(options.arg.height ==""||undefined){
        options.arg.height = "null"
    }
    //旋转度数
    if(options.arg.rotate ==""||undefined){
        options.arg.rotate = "null"
    }
}