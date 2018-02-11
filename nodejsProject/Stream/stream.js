/*
* 读取文件，实现读取文件内容；管道流，实现将文件拷贝
*/

var fs = require("fs");
var data = '';

//创建可读流
var readerStream = fs.createReadStream("input.txt");

//设置编码格式为utf-8
readerStream.setEncoding("utf8");

//处理流事件 data, end, error
readerStream.on('data',function(chunk){

    data = data + chunk;

    console.log(data);
})

readerStream.on('end',function(){
    //console.log(data);
})

readerStream.on('error',function(err){
    console.log(err.stack);
})

//创建可写流
// var writerStream = fs.createWriteStream("output.txt");

// //管道写入操作，读取nodeText.txt文本内容写入output.txt
// readerStream.pipe(writerStream);

// console.log("管道流写入完成");
