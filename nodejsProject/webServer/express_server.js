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
        res.json(200,{code:'0',data:'文件大小超过1M'});
        return;
    }

    //判断文件类型是否符合
    if(req.files[0].mimetype != "image/png"&&req.files[0].mimetype != "image/jpg"
    &&req.files[0].mimetype != "image/jpeg"&&req.files[0].mimetype != "image/webp"
    &&req.files[0].mimetype != "image/bmp"){
        res.json(200,{code:'0',data:'文件类型不符合'});
        return;
    }

    //将获取到的文件储存到指定目录，并删除零时文件
    var des_file = __dirname + "/upload_image_dir/" + req.body.image_name + "." + req.body.image_type;
    fs.readFile( req.files[0].path, function (err, data) {
            fs.writeFile(des_file, data, function (err) {
            if( err ){
                console.log( err );
            }else{
                fs.unlink(req.files[0].path, function() {
                    if (err) throw console.log( err );
                });
            }
            res.end();
        });
    });
})

app.all('*',router);

var server = app.listen(8888,"127.0.0.1",function(){
    console.log("server run success from http://127.0.0.1:8888");
});