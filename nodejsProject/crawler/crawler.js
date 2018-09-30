/*
*爬虫项目
*/

//声明变量http,fs，cheerio,request,i（爬取数量）,url（初始链接）
var http = require("http");
var fs = require("fs");
var cheerio = require("cheerio");
var request = require("request");
var i = 0;
var url = "http://www.ss.pku.edu.cn/index.php/newscenter/news/2391";
var mysql = require("mysql");

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '173.gtf.664',
    database : 'testDB'
});

connection.connect();

//储存每次爬取的数据到数据库中
var image_url = "";

function startRequest(x){

    //http模块向服务器发送一次get请求
    http.get(x,function(res){
        var html = ''; //储存请求到的网页整个html内容，方便之后利用cheerio模块解析

        var titles = [];

        res.setEncoding('utf-8');

        //监听data事件，获取数据
        res.on('data',function(chunk){
            html += chunk; 
        });

        //监听end事件，获取网页html所有内容后，开始解析html
        res.on('end',function(){
            var $ = cheerio.load(html);

            var news_item ={
                //获取文章的标题
                title: $('div.article-title a').text().trim(),
                //获取文章发布时间
                time: $('.article-info a:first-child').next().text().trim(),
                //获取文章url
                link: "http://www.ss.pku.edu.cn" + $("div.article-title a").attr('href'),
                //当前获取了多少篇文章
                i: i = i + 1
            };

            saveContent($,news_item.title);
            saveImage($,news_item.title);

            console.log(news_item + "****" + i);
            //储存内容到数据库
            saveDataBase(news_item.title,image_url);

            var nextLink = "http://www.ss.pku.edu.cn" + $("li.next a").attr('href');
                str = nextLink.split('-');
                nexturl = encodeURI(str[0]);

                //控制爬去数量
                if(i < 10){
                    startRequest(nexturl);
                }else{
                    connection.end();
                }
        });

    }).on('error',function(err){
        console.log(err);
    });
};

//储存爬取得内容
function saveContent($,title){

    $(".article-content p").each(function(index,item){
        var x = $(this).text();

        var y = x.substring(0,2).trim();

        if(y == ''){
            x = x + '\n';
            
            //将文本内容一段段添加到/datas文件夹下，并用新闻标题命名文件
            fs.appendFile('./datas/' + title + '.txt', x, 'utf-8',function(err){
                if(err){
                    console.log(err);
                }
            });
        }
    });
};

//储存爬取得图片
function saveImage($,title){
    $(".article-content img").each(function(index,item){
        var imge_title = $(this).parent().next().text().trim();
        if(imge_title.length > 35 || imge_title == ""){
            imge_title = "未命名图片";
        }
        var imge_fileName = imge_title + '.jpg';
        var img_src = 'http://www.ss.pku.edu.cn' + $(this).attr('src');

        image_url = img_src;

        //利用request模块发送请求获取图片
        request.head(img_src,function(err,res,body){
            if(err){
                console.log(err);
            }
        });

        request(img_src).pipe(fs.createWriteStream('./image/'+ title + '---' + imge_fileName));
    })
};

//储存内容到数据库
function saveDataBase(title,image){
    //插入数据
    var insertDB = "INSERT INTO cra_web(title, image_url) VALUES (?,?)";
    var insertParams = [title,image];
    
    connection.query(insertDB,insertParams,function(err,result){
        if(err){
            console.log("create table error",err.message);
            return;
        }
        console.log(result);
    });
}

startRequest(url);