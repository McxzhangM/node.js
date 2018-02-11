var fs = require('fs');

// fs.open('txtFile.txt','r+',function(err,callback){

//     if(err){
//         return console.log(err);
//     }

//     console.log("文件打开成功！");
// });

// fs.stat('txtFile.txt',function(err,stats){
//     console.log(stats.isDirectory());
// });

fs.writeFile('txtFile.txt','通过写入修改原文件内容',function(err){
    if(err){
        return console.log(err);
    }

    console.log("写入文件完成");

    fs.readFile('txtFile.txt',function(err,data){
        if(err){
            return console.log(err);
        }

        console.log("读取文件内容" + data);
    })
})