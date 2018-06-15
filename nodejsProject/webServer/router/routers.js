/*
*路由
*/
var express =  require("express");
var router = express.Router();
var url = require("url");
var querystring = require("querystring");
var fs = require("fs");
var cp = require("child_process");

var log4js = require("../view/logs/logs");
log4js.use(router);
var root_dir = require("../global_config");

var options = {
    pathname:"",       //通用文件，图片路由路径
    download_path: "", //下载链接
    arg:""             //文件下载链接参数
};


router.get('/',function(req,res,next){
    res.sendFile(root_dir + "/index.html");
})

router.get('/index.html',function(req,res,next){
    res.sendFile(root_dir + "/index.html");
})

router.get('/index.js',function(req,res,next){
    res.sendFile(root_dir + "/index.js");
})

//文件下载
router.get('/download',function(req,res,next){
    options.arg = querystring.parse(url.parse(req.url).query);

    //参数转换
    parameterChange();

    options.download_path = root_dir + "/upload_image_dir/" +new Date().format("yyyyMMdd")+'/'+ options.arg.name +'.'+ options.arg.befor_type;
    options.exec_after_path = root_dir+"/download_image_dir/"+new Date().format("yyyyMMdd")+'/'+options.arg.name +'.'+ options.arg.after_type;

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
    res.sendFile(root_dir + options.pathname);
})

//404
router.get('*',function(req,res){
    res.sendFile(root_dir + "/error_html/404.html");
})

module.exports = router;

//处理下载可选项异常参数
function handleDownloadParameter(){

    //转换后类型
    if(options.arg.after_type ==""||undefined){
        options.arg.after_type = "png"
    }else{
        if(options.arg.after_type!= "png"&&options.arg.after_type != "jpg"
        &&options.arg.after_type != "jpeg"&&options.arg.after_type != "webp"
        &&options.arg.after_type != "bmp"){
            options.arg.after_type = "png"
        }
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
    }else{
        if(parseInt(options.arg.width) > 1000){
            options.arg.width = "1000";
        }
    }

    //图片高度
    if(options.arg.height ==""||undefined){
        options.arg.height = "null"
    }else{
        if(parseInt(options.arg.height) > 1000){
            options.arg.height = "1000";
        }
    }

    //旋转度数
    if(options.arg.rotate ==""||undefined){
        options.arg.rotate = "null"
    }else{
        if(parseInt(options.arg.rotate) > 360){
            options.arg.rotate = "null";
        }
    }
}

//参数转换
function parameterChange(){
    options.arg.name = UnesCode(options.arg.name);
    options.arg.befor_type = UnesCode(options.arg.befor_type);
    options.arg.after_type = UnesCode(options.arg.after_type);
    options.arg.input_test = UnesCode(options.arg.input_test);
    options.arg.width = UnesCode(options.arg.width);
    options.arg.height = UnesCode(options.arg.height);
    options.arg.rotate = UnesCode(options.arg.rotate);
    options.arg.position = UnesCode(options.arg.position);
    options.arg.color = UnesCode(options.arg.color);
}

//解密参数
function UnesCode(uncode){
    if(uncode == ""){
        return uncode;
    }
    uncode=unescape(uncode);        
    var decryption=String.fromCharCode(uncode.charCodeAt(0)-uncode.length);        
    for(var i=1;i<uncode.length;i++)  
    {        
        decryption+=String.fromCharCode(uncode.charCodeAt(i)-decryption.charCodeAt(i-1));        
    }  

    return decryption;
}

//格式化日期函数
Date.prototype.format = function(fmt) { 
    var o = { 
       "M+" : this.getMonth()+1,                 //月份 
       "d+" : this.getDate(),                    //日 
       "h+" : this.getHours(),                   //小时 
       "m+" : this.getMinutes(),                 //分 
       "s+" : this.getSeconds(),                 //秒 
       "q+" : Math.floor((this.getMonth()+3)/3), //季度 
       "S"  : this.getMilliseconds()             //毫秒 
   }; 
   if(/(y+)/.test(fmt)) {
           fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
   }
    for(var k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
   return fmt; 
}   