var http = require("http");
var fs = require("fs");
var cheerio = require("cheerio");
var mysql = require("mysql");
var iconv = require('iconv-lite'); 
var path = require('path');

var book_obj_Arr = [];  //读取的数组，存放章节对象包含书籍id，章节内容，章节排序
var index_bookArr = 0;  //对应当前存放章节数组索引

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'ZCX123@cxzhang',
    database : 'fiction'
});
connection.connect();

function saveDataBase(sql,Params,book_parmes){
    connection.query(sql,Params,function(err){
        if(err){
            console.log("create table error:",err.message);
            var err_text = 'sql_insert_err:'+'book_id:'+book_parmes.book_id+'-'+'book_link:'+ book_parmes.book_link+'-'+'book_order:'+book_parmes.book_order+ '\n';;
            //将错误日志添加到文本中
            fs.appendFile('./readerErr_log.txt', err_text, 'utf-8',function(err){
                if(err){
                    console.log('sql_insert_err:'+err);
                }
            });
        }

        //执行下一条请求
        index_bookArr = index_bookArr +1;
        if(index_bookArr < book_obj_Arr.length){
            getFictionContent(book_obj_Arr[index_bookArr]);
        }else{
            connection.end();
        }
    });
}

function getFictionContent(book_parmes){
    //超时处理
    var timeEvent_fiction = setTimeout(function(err){
        console.log('getFictionTimeout');
        var err_text = 'getFicationTimeout-'+'book_id:'+book_parmes.book_id+'-'+'book_link:'+ book_parmes.book_link+'-'+'book_order:'+book_parmes.book_order+ '\n';
        //将错误日志添加到文本中
        fs.appendFile('./readerErr_log.txt', err_text, 'utf-8',function(err){
            if(err){
                console.log('getFicationTimeout:'+err);
            }
        });
        req_fiction.abort();

        //执行下一条请求
        index_bookArr = index_bookArr +1;
        getFictionContent(book_obj_Arr[index_bookArr]);
    },10000);
    
    //http模块向服务器发送一次get请求
    var req_fiction = http.get(book_parmes.book_link,function(res){
        var html = []; //储存请求到的网页整个html内容，方便之后利用cheerio模块解析
        var html_length = 0;
        clearTimeout(timeEvent_fiction);

        //end超时处理模块
        var endEventTimeout = setTimeout(function(err){
            var err_text = 'endEventTimeoutt-'+'book_id:'+book_parmes.book_id+'-'+'book_link:'+ book_parmes.book_link+'-'+'book_order:'+book_parmes.book_order+ '\n';
            //将错误日志添加到文本中
            fs.appendFile('./readerErr_log.txt', err_text, 'utf-8',function(err){
                if(err){
                    console.log('endEventTimeout:'+err);
                }
            });
            res.pause();
            
            //执行下一条请求
            index_bookArr = index_bookArr +1;
            getFictionContent(book_obj_Arr[index_bookArr]);
        },10000);

        //监听data事件，获取数据
        res.on('data',function(chunk){
            //获取二进制流文件
            html.push(chunk); 
            html_length += chunk.length;
        });

        //监听end事件，获取网页html所有内容后，开始解析html
        res.on('end',function(){
         
            clearTimeout(endEventTimeout);
            //解析gbk编码的二进制流文件
            var bufferHtmlData = Buffer.concat(html,html_length);
            var change_data = iconv.decode(bufferHtmlData,'gbk');
            //cheerio模块解析html内容
            var $ = cheerio.load(change_data);
      
            //章节内容
            var chapter_text = $('#content').text()
            var insertDB = "UPDATE chapter_tp SET chapter_text = ? WHERE chapter_book_id = ? AND chapter_orders = ?";
            var book_parmes_arr = [chapter_text,book_parmes.book_id,book_parmes.book_order];

            saveDataBase(insertDB,book_parmes_arr,book_parmes);
        });

        res.on('error',function(err){
            console.log("error----1");
            clearTimeout(endEventTimeout);
            var err_text = 'getFictionTextReq_err-'+'book_id:'+book_parmes.book_id+'-'+'book_link:'+ book_parmes.book_link+'-'+'book_order:'+book_parmes.book_order+ '\n';
            //将错误日志添加到文本中
            fs.appendFile('./readerErr_log.txt', err_text, 'utf-8',function(err){
                if(err){
                    console.log('getFictionText-req_err:'+err);
                }
            });
            req_fiction.abort();
        
            //执行下一条请求
            index_bookArr = index_bookArr +1;
            getFictionContent(book_obj_Arr[index_bookArr]);
        });

    }).on('error',function(err){
    });

    process.on('uncaughtException', function (err) {
      
        if (typeof console.error === "function") {
          console.error(('uncaughtException-if'+err || '').toString())
        } else {
          console.log(('uncaughtException-else'+err || '').toString())
        }
    })
}

function main_txt(filePath){
    index_bookArr = 0;
    fs.exists(filePath, function(exists){
        if(exists){
            fs.readFile(filePath, function (err, data) {
                if (err) {
                    return console.error(err);
                }
                var text_line = data.toString().split('\n');
        
                for(var i=0;i< text_line.length; i++){
                    var book_obj = {
                        book_id : '',
                        book_link:'',
                        book_order:''
                    } 
                    if(text_line[i].match(/http(.*)/)){ 
                        var obj = text_line[i].split('-');

                        //获取id
                        book_obj.book_id = obj[1].match(/book_id:(.*)/)[1];

                        //获取连接
                        book_obj.book_link = obj[2].match(/book_link:(.*)/)[1];
        
                        //获取order
                        book_obj.book_order = obj[3].match(/book_order:(.*)/)[1];
               
                        book_obj_Arr.push(book_obj);
                    }else{
                        book_obj_Arr.push(book_obj);
                    }
                }

                //请求数据
                console.log(book_obj_Arr.length);
                getFictionContent(book_obj_Arr[index_bookArr]);
            });
        }
    });
    
}

//读取指定文件下的内容
main_txt(path.resolve(__dirname, '..') +"\\test_log.txt");