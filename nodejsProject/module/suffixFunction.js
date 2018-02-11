/*
* 为文件添加后缀名
*/

//对外公开的接口
// exports.setSuffix = function suffix(file){

//     file = file + ".doc";

//     console.log("添加文件后缀名后的文件:" + file);
// }

//对外公开对象
function setConstellation(){

    var constellation = "";
    
    this.Month = function(month){

        if(month > 5){
            constellation = "射手";
        }else{
            constellation = "人马";
        }

        console.log("获取月份" + month);
    }

    this.Constellation = function() {
        console.log("你的星座" + constellation);
    }

}

module.exports = setConstellation;