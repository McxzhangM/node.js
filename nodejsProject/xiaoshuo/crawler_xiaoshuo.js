//声明变量http,fs，cheerio,request,i（爬取数量）,url（初始链接）
var http = require("http");
var fs = require("fs");
var cheerio = require("cheerio");
var request = require("request");
var mysql = require("mysql");
var iconv = require('iconv-lite'); 

var book_id = 10;//当前书本book_id
var url = "http://www.baoliny.com/"+book_id+"/index.html";//当前请求连接

var chapter_name_arr = [];//章节名称列表
var chapter_content_link_arr = [];//章节内容链接数组
var chapter_content_link_i = 0;//链接索引
var chapter_text_arr = [];//章节内容数组
var book_author = '';//书籍作者
var chapter_orders = [];//章节排序编号
var interval_logo = 0;//间隔标识，每隔100个存储一次数据

var book_DataInfo = {
    chapter_name_arr = [],
    chapter_content_link_arr = [],
    chapter_content_link_i = 0,
    chapter_text_arr = [],
    book_author = '',
    chapter_orders = [],
    interval_logo = 0
}

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'ZCX123@cxzhang',
    database : 'fiction'
});
connection.connect();

function saveDataBase(sql,Params,nextLink,isBook){
    var nextLinks = nextLink || false;
    var isgetBookInfo = isBook || false;
    
    connection.query(sql,[Params],function(err){
        if(err){
            console.log("create table error:",err.message);

            var err_text = book_id +':'+'sql_insert_err:'+ err +'chapter_content_link_i'+chapter_content_link_i+'\n';
            //将错误日志添加到文本中
            fs.appendFile('./err_log.txt', err_text, 'utf-8',function(err){
                if(err){
                    console.log('sql_insert_err:'+err);
                }
            });
        }
        if(!isgetBookInfo){
            if(nextLinks){
                book_id ++;
                if(book_id<=20){
                    startRequest("http://www.baoliny.com/"+book_id+"/index.html");
                }else{
                    connection.end();
                }
            }else{
                chapter_orders = [];
                chapter_text_arr = [];
                console.log('getFictionText1');
                getFictionText(chapter_content_link_arr[chapter_content_link_i]);
            }
        }
    });
}

function handleData(){
        //判断当前已结束
        if(chapter_content_link_i == chapter_content_link_arr.length-1){
            var insertDB = "INSERT INTO chapter_tp(chapter_book_id,chapter_name,book_author,chapter_text,chapter_orders)VALUES ?";
            var book_parmes_arr = [];
            for(var i=0;i <interval_logo;i++){
                book_parmes_arr.push([book_id,chapter_name_arr[chapter_orders[i]-1],book_author,chapter_text_arr[i],chapter_orders[i]]);
            }
            interval_logo = 0;
            chapter_content_link_i = chapter_content_link_i+1;
            saveDataBase(insertDB,book_parmes_arr,true);
        }else{
            if(interval_logo == 100){
                var insertDB = "INSERT INTO chapter_tp(chapter_book_id,chapter_name,book_author,chapter_text,chapter_orders)VALUES ?";
                var book_parmes_arr = [];
                interval_logo = 0;
                for(var i=0;i < 100;i++){
                    book_parmes_arr.push([book_id,chapter_name_arr[chapter_orders[i]-1],book_author,chapter_text_arr[i],chapter_orders[i]]);
                }
                chapter_content_link_i = chapter_content_link_i+1;
                saveDataBase(insertDB,book_parmes_arr);
            }else{
                chapter_content_link_i = chapter_content_link_i+1;
                getFictionText(chapter_content_link_arr[chapter_content_link_i]);
            }
        }
}

//获取对应章节文本
function getFictionText(x){

    //超时处理
    var timeEvent_fiction = setTimeout(function(err){
        console.log('getFictionTimeout');
        var err_text = 'getFicationTimeout-'+'book_id:'+book_id+'-'+'book_link:'+ x+'-'+'book_order:'+chapter_content_link_i+1+'\n';
        //将错误日志添加到文本中
        fs.appendFile('./err_log.txt', err_text, 'utf-8',function(err){
            if(err){
                console.log('getFicationTimeout:'+err);
            }
        });
        chapter_text_arr.push("");
        chapter_orders.push(chapter_content_link_i+1);
        interval_logo = interval_logo+1;
        req_fiction.abort();
        console.log('getFictionText2');
        handleData();
    },10000);
    
    //http模块向服务器发送一次get请求
    var req_fiction = http.get(x,function(res){
        var html = []; //储存请求到的网页整个html内容，方便之后利用cheerio模块解析
        var html_length = 0;
        clearTimeout(timeEvent_fiction);

        //end超时处理模块
        var endEventTimeout = setTimeout(function(err){
            console.log('endEventTimeout'+chapter_content_link_i);
            var err_text = 'endEventTimeout-'+'book_id:'+book_id+'-'+'book_link:'+ x+'-'+'book_order:'+chapter_content_link_i+1+'\n';
            //将错误日志添加到文本中
            fs.appendFile('./err_log.txt', err_text, 'utf-8',function(err){
                if(err){
                    console.log('endEventTimeout:'+err);
                }
            });
            chapter_text_arr.push("");
            chapter_orders.push(chapter_content_link_i+1);
            interval_logo = interval_logo+1;
            res.pause();
            console.log('getFictionText3');
            handleData();
        },10000);

        //监听data事件，获取数据
        res.on('data',function(chunk){
            //获取二进制流文件
            html.push(chunk); 
            html_length += chunk.length;
        });

        //监听end事件，获取网页html所有内容后，开始解析html
        res.on('end',function(){
            console.log('http.get:'+chapter_content_link_i);
            clearTimeout(endEventTimeout);
            //解析gbk编码的二进制流文件
            var bufferHtmlData = Buffer.concat(html,html_length);
            var change_data = iconv.decode(bufferHtmlData,'gbk');
            //cheerio模块解析html内容
            var $ = cheerio.load(change_data);
            //作者名称
            book_author = $('#yueduye').children().eq(0).text();
            //章节内容
            var chapter_text = $('#content').text()
                chapter_text_arr.push(chapter_text);
                chapter_orders.push(chapter_content_link_i+1);

            if(chapter_content_link_arr.length <= 100){
                var insertDB = "INSERT INTO chapter_tp(chapter_book_id,chapter_name,book_author,chapter_text,chapter_orders)VALUES ?";
                var book_parmes_arr = [];
                console.log('章节数小于等于100');
                //如果章节数小于等于100；按原方法执行
                if(chapter_content_link_i < chapter_content_link_arr.length){
                    console.log('getFictionText4');
                    getFictionText(chapter_content_link_arr[chapter_content_link_i]);
                }else{
                    for(var i=0;i<chapter_name_arr.length;i++){
                        book_parmes_arr.push([book_id,chapter_name_arr[i],book_author,chapter_text_arr[i],chapter_orders[i]]);
                    }
                    //书籍id，章节id，章节名称，作者名称，章节内容插入chapter_tp表
                    saveDataBase(insertDB,book_parmes_arr,true);
                }
            }else{
                //标识加一，当标识等于100时执行一次存储数据库；并把标识至为0，重新计数，存储数据的数组至空
                interval_logo = interval_logo+1;
                handleData();
            }
        });

        res.on('error',function(err){
            console.log("error----1");
            clearTimeout(endEventTimeout);
            var err_text = 'getFictionText-req_err-'+'book_id:'+book_id+'-'+'book_link:'+ x+'-'+'book_order:'+chapter_content_link_i+1+'\n';
            //将错误日志添加到文本中
            fs.appendFile('./err_log.txt', err_text, 'utf-8',function(err){
                if(err){
                    console.log('getFictionText-req_err:'+err);
                }
            });
            chapter_text_arr.push("");
            chapter_orders.push(chapter_content_link_i+1);
            interval_logo = interval_logo+1;
            req_fiction.abort();
            console.log('getFictionText6');
            getFictionText(chapter_content_link_arr[chapter_content_link_i]);
        });

    }).on('error',function(err){
        // console.log("error----2");
        // //clearTimeout(timeEvent_fiction);
        // var err_text = book_id +':'+'getFictionText-http:'+'fictionurl:'+ x + '\n';
        // //将错误日志添加到文本中
        // fs.appendFile('./err_log.txt', err_text, 'utf-8',function(err){
        //     if(err){
        //         console.log('getFictionText-http:'+err);
        //     }
        // });
        // chapter_text_arr.push("");
        // chapter_orders.push(chapter_content_link_i);
        // interval_logo = interval_logo+1;
        // console.log('getFictionText7');
        // getFictionText(chapter_content_link_arr[chapter_content_link_i]);
    });

    process.on('uncaughtException', function (err) {
      
        if (typeof console.error === "function") {
          console.error(('uncaughtException-if'+err || '').toString())
        } else {
          console.log(('uncaughtException-else'+err || '').toString())
        }
    })
}
//getFictionText('http://www.baoliny.com/155000/55525849.html');

//获取书本名称,book_id,类型,和章节名称
function startRequest(x){
    chapter_name_arr = [];
    chapter_content_link_arr = [];
    chapter_content_link_i = 0;
    chapter_orders = [];
    chapter_text_arr = [];

    //http模块向服务器发送一次get请求
    var req = http.get(x,function(res){
        var html = []; //储存请求到的网页整个html内容，方便之后利用cheerio模块解析
        var html_length = 0;

        //监听data事件，获取数据
        res.on('data',function(chunk){
            //获取二进制流文件
            html.push(chunk); 
            html_length += chunk.length;
        });

        //监听end事件，获取网页html所有内容后，开始解析html
        res.on('end',function(){
            //解析gbk编码的二进制流文件
            var bufferHtmlData = Buffer.concat(html,html_length);
            var change_data = iconv.decode(bufferHtmlData,'gbk');

            //cheerio模块解析html内容
            var $ = cheerio.load(change_data);

            //书本名称
            var book_name_copy = $('.readerListHeader').find('h1').clone();
                book_name_copy.find('font').text('');
            var book_name = book_name_copy.text().replace(/\s*/g,"");
     
            //书本类型
            var book_type = $('.header').next().find('p').children().eq(1).text().replace(/\s*/g,"");

            var insertDB = "INSERT INTO book_tp(book_id,book_name,book_type) VALUES ?";
            var book_parmes_arr = [[book_id,book_name,book_type]];

            //书籍id，书籍名称，书籍类型插入book_tp表
            saveDataBase(insertDB,book_parmes_arr,false,true);

            //章节名称列表
            var tr_list = $(".readerListShow table tbody").children('tr');
            var td_list = "";

            console.log("tr_list.length:"+tr_list.length);
            //循环tr列表
            for(var i=1;i<tr_list.length;i++){
                td_list = tr_list.eq(i).children('td');

                //循环td列表，获取章节名称和章节内容链接
                for(var j=0;j<td_list.length;j++){
                    chapter_name_arr.push(td_list.eq(j).find('a').text());
                    chapter_content_link_arr.push(td_list.eq(j).find('a').attr('href'));
                }
            }

            //通过章节内容链接获取章节内容
            console.log('getFictionText8');
            getFictionText(chapter_content_link_arr[chapter_content_link_i]);
        });

        res.on('error',function(err){
            console.log("err------1");
            var err_text = book_id +':'+'startRequest-req_err:'+ err + '\n';
            //将错误日志添加到文本中
            fs.appendFile('./err_log.txt', err_text, 'utf-8',function(err){
                if(err){
                    console.log('startRequest-req_err:'+err);
                }
            });
            book_id ++;
            startRequest("http://www.baoliny.com/"+book_id+"/index.html");
        });

    }).on('error',function(err){
        console.log("err------2:"+"http://www.baoliny.com/"+book_id+"/index.html");
        //清除定时器
        var err_text = book_id +':'+'startRequest-http:'+ err + '\n';
        //将错误日志添加到文本中
        fs.appendFile('./err_log.txt', err_text, 'utf-8',function(err){
            if(err){
                console.log('startRequest-http:'+err);
            }
        });
        book_id ++;
        startRequest("http://www.baoliny.com/"+book_id+"/index.html");
    });
};

startRequest(url);
