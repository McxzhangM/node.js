var express =  require("express");
var app = express();
var router = require("./router/routers.js");

//-----
var multer  = require('multer');
var fs = require("fs");
app.use(
    multer({dest: '/tmp/'}).array('inputfile')
);
//-----

//文件上传
app.post('/upload_file',function(req,res,next){
    console.log(req.files[0]);
    res.send("002");
})

app.all('*',router);

var server = app.listen(8888,function(){
    console.log("server run success from localhost:8888");
});