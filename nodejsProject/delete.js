/*
* 删除指定文件名的文件
*/

var fs = require('fs');

var path = require('path');

deleteFolderRecursive = function(url){
    
    //存放文件和子目录的数组
    var files = [];

    //判断传入路径是否存在
    if(fs.existsSync(url)){

        //判断当前是否是文件夹，如果不是判断是否是符合删除条件的文件
        if(fs.statSync(url).isDirectory){
            files = fs.readdirSync(url);

            //循环遍历当前文件夹中的文件
            files.forEach(function(file,index){

                //拼接当前文件的路径，文件夹路径url + '/' + 文件名file
                var curPath = path.join(url,file);

                //判断当前文件是否是文件夹
                if(fs.statSync(curPath).isDirectory().isDirectory){

                    //如果是文件夹则继续执行函数
                    deleteFolderRecursive(curPath);
                }else{

                    //判断文件是否符合删除的条件
                    if(file == "intput.txt"){

                        fs.unlink(curPath,function(err){
                            if(err){
                                console.log("删除失败");
                            }

                            console.log("删除成功");
                        });
                    }
                }
            })

        }else{
            console.log("当前不是文件夹");
        }

    }else{
        //传入路径不存在
        console.log("文件路径不存在");
    }
}

deleteFolderRecursive("Stream");