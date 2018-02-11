/*
*路由模块,通过路由模块根据路径筛选当前指向页面
*/

var fs = require('fs');

exports.router = function router(path,res){

    function showPaper(pathName,status){

        res.writeHead(status,{"Content-Type": "text/html,charset=utf-8"});

        res.write(fs.readFileSync(pathName));

        res.end();
    }

    switch(path){
        case '/':
        case '/page':
        case '/page/home':
          showPaper("../page/home.html",200);
          break;
        case '/page/about':
          showPaper("../page/about.html",200);
          break;
        default:
          showPaper("../page/404.html",404);
          break; 
    }

}
