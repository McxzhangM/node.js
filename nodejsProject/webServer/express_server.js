var express =  require("express");
var app = express();
var router = require("./router/routers.js");

var multer  = require('multer');
var fs = require("fs");

app.use(
    multer({dest: '/tmp/'}).any()
);

//文件上传
app.post('/upload_file',function(req,res,next){
    // console.log("files.size:"+req.files[0].size);//1024*1024
    // console.log("files.type:"+req.files[0].mimetype);

    var file_size = req.files[0].size/(1024*1024); 
    
    if(!req.files){
        return;
    }

    //判断上传文件是否符合标准，大小和格式
    if(file_size > 1){
        res.status(200).json({code:'0',data:'文件大小超过1M'});
        return;
    }

    //判断文件类型是否符合
    if(req.files[0].mimetype != "image/png"&&req.files[0].mimetype != "image/jpg"
    &&req.files[0].mimetype != "image/jpeg"&&req.files[0].mimetype != "image/webp"
    &&req.files[0].mimetype != "image/bmp"){
        res.status(200).json({code:'0',data:'文件类型不符合'});
        return;
    }

    //解密上传参数
    var imageNmae = UnesCode(req.body.image_name);
    var imageType = UnesCode(req.body.image_type);

    //将获取到的文件储存到指定目录，并删除零时文件
    var des_file = __dirname + "/upload_image_dir/" + imageNmae + "." + imageType;

    //判断文件夹是否存在，不存在则创建，按照当前时间命名
    fs.exists(options.download_path,function(exist) {

    })

    fs.readFile( req.files[0].path, function (err, data) {
            fs.writeFile(des_file, data, function (err) {
            if( err ){
                console.log( err );
                res.status(200).json({code:'0',data:'上传失败'});
            }else{
                fs.unlink(req.files[0].path, function() {
                    if (err) throw console.log( err );
                });
                res.status(200).json({code:'1',data:'上传成功'});
            }
        });
    });
})

app.all('*',router);

var server = app.listen(8888,"127.0.0.1",function(){
    console.log("server run success from http://127.0.0.1:8888");
});

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