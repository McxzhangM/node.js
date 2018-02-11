/*
* 写入文件，实现将文本写入文件；
*/

var fs = require('fs');

var dataTxt = "通过写入流写入文本2";

var write = fs.createWriteStream('input.txt');

//设置写入编码格式和数据
write.write(dataTxt,'UTF8');

//标记文件末尾
write.end();

//设置写入文件finish, error
write.on('finish',function(){
    console.log("写入文件流完成");
})

write.on('error',function(err){
    console.log(err.stack);
})

console.log("写入文件结束");
