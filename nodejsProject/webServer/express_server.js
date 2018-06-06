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
    console.log(req.files);
    console.log(req.body);

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