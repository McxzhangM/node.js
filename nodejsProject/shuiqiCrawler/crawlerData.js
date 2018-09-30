/*
*获取网页数据
*/

//导入相应模块
var http = require('http');
var cheerio = require('cheerio');
var request = require('request');
var mysql = require('mysql');
var fs = require('fs');

//爬取数量,资源id
var i = 1;
//爬取起始链接
var url = "http://www.2020kkk.com/vodhtml/"+ i +".html";
//视频链接入口名称
var video_tab = [];
//储存进入视频页面的链接地址
var videoLink = [];

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '173.gtf.664',
    database : 'testDB'
});

connection.connect();

//爬取方法
function starCrawler(url){

    http.get(url,function(res){
        //获取的html；获取vodhtml目录下的内容
        var html = "";

        res.setEncoding("utf-8");

        res.on('data',function(chunk){
            html += chunk;
        });

        res.on('end',function(){

            //解析获取到的html内容，通过cheerio
            var $ = cheerio.load(html);

            //需要获取到的元素
            var item = {
                //封面图片  /upload/vod/2017-12-25/201612616404076248.jpg
                cover_img : $(".content").children(".pic").find("img").attr("src"),
                //标题
                title : $(".h2 a:nth-child(3)").text(),
                //状态
                state : $(".content").find("dd").eq(0).find("b").text(),
                //类型
                type : $(".content").find("dd").eq(1).find("a").text(),
                //导演
                director : $(".content").find("dd").eq(2).find("a").text(),
                //地区
                region : $(".content").find("dd").eq(3).find("a").text(),
                //年代
                time : $(".content").find("dd").eq(4).find("a").text(),
                //主演
                starring : $(".content").find("dd").eq(5).find("a").text(),
                //剧情
                plot : $(".alldes").children().last().text()
            } 

            //通过获取到的图片路径；下载图片到本地
            //saveCoverImage(item);

            //情况数组
            video_tab = [];

            //标签名称  m3u8云播, 芒果TV，优酷视频，腾讯视频，奇异视频，link在线, 搜狐视频， 乐视视频，土豆视频， pptv
            for(var j=0; j< $(".taba-down").children("div").eq(0).find("ul li").length; j++){

                if($(".taba-down").children("div").eq(0).find("ul li").eq(j).text() == ""){
                    //剔除空数据
                }else{

                    video_tab.push( $(".taba-down").children("div").eq(0).find("ul li").eq(j).text() );
                }
            }

            //每个标签下的视频链接，一个标签下可能有多个链接
            //循环第几个标签，k当前是第几个标签
            for(var k=1; k< $(".taba-down").children("div").length; k++){
                
                //循环每个标签下的链接, m当前tab下的第几个视频 
                for(var m=0; m<$(".taba-down").children("div").eq(k).find(".urlli div").length; m++){
                    
                    getVideoLink(video_tab[k-1],$(".taba-down").children("div").eq(k).find(".urlli div").eq(m).find("a").attr("href"),m+1,i);
                }
            }

            //console.log(item.cover_img);
                // console.log(item.title);
                // console.log(item.state);
                // console.log(item.type);
                // console.log(item.director);
                // console.log(item.region);
                // console.log(item.time);
                // console.log(item.starring);
                // console.log(item.plot);

            console.log(i);
            console.log(video_tab);
            // console.log(videoLink);

            i = i+1;

            //获取下个视频
            var nextUrl = "http://www.2020kkk.com/vodhtml/" + i + ".html"
            
            if(i < 10){

                //延时2秒，开始爬取下一个网页
                var starCrawlerTimeout = setTimeout(function() {
                    starCrawler(nextUrl);
                }, 2000);
                
            }else{

                var starCrawlerTimeout = setTimeout(function() {
                    connection.end();
                }, 2000);
            }
            
        });
 
    }).on('error',function(err){
        console.log(err + "------http链接请求错误");
    });
};

starCrawler(url);

//根据入口链接，获取视频链接; tab当前插入的表，videourl指向视频的网址，number当前是第几集
function getVideoLink(tab,videoUrl,number,resid){

    //指向视频的网址，从中获取视频的播放链接
    var link = "http://www.2020kkk.com" + videoUrl;

    http.get(link,function(res){
        var htmlLink = "";

        res.setEncoding('utf-8');

        res.on('data',function(chunk){
            htmlLink += chunk; 
        });

        res.on('end',function(){

            var $ = cheerio.load(htmlLink);

            //视频的链接
            var video_link = $("#playleft").children("iframe").eq(1).attr("src");
            //"https://zuida-jiexi.com/m3u8/m3u8.php?url=http://cn2.zuidadianying.com/20180302/FtyxrueO/index.m3u8"
            console.log(video_link);
            //将对应标签下的视频链接写入数据库
            var database_tab = "";//判断当前视频链接应该存入的字段

            switch(tab){
                case "m3u8云播":
                database_tab = "insert into m3u8(`video_id`,`tab_video_number`,`tab_video_link`) values (?,?,?)";
                break;
                case "芒果TV":
                database_tab = "insert into mangguo(`video_id`,`tab_video_number`,`tab_video_link`) values (?,?,?)";
                break;
                case "优酷视频":
                database_tab = "insert into youku(`video_id`,`tab_video_number`,`tab_video_link`) values (?,?,?)";
                break;
                case "腾讯视频":
                database_tab = "insert into tenxun(`video_id`,`tab_video_number`,`tab_video_link`) values (?,?,?)";
                break;
                case "奇异视频":
                database_tab = "insert into qiyi(`video_id`,`tab_video_number`,`tab_video_link`) values (?,?,?)";
                break;
                case "link在线":
                database_tab = "insert into link(`video_id`,`tab_video_number`,`tab_video_link`) values (?,?,?)";
                break;
                case "搜狐视频":
                database_tab = "insert into souhu(`video_id`,`tab_video_number`,`tab_video_link`) values (?,?,?)";
                break;
                case "乐视视频":
                database_tab = "insert into leshi(`video_id`,`tab_video_number`,`tab_video_link`) values (?,?,?)";
                break;
                case "土豆视频":
                database_tab = "insert into tudou(`video_id`,`tab_video_number`,`tab_video_link`) values (?,?,?)";
                break;
                default:
                database_tab = "insert into pptv(`video_id`,`tab_video_number`,`tab_video_link`) values (?,?,?)";
            }

            //向指定表中插入数据;   资源id,集数，视频链接
            //var insert_tab_table = "insert into"+ database_tab +"(`video_id`,`tab_video_number`,`tab_video_link`) values (?,?,?)";
            var insert_table_value = [resid,number,video_link];

            connection.query(database_tab,insert_table_value,function(err,result){
                if(err){
                    console.log("insert video url data error",err.message);
                    return;
                }
                //console.log(result);
            });

            // if(i >= 2){

                //     var connectionTimeout = setTimeout(function() {
                        
                //         //当前是最后一次循环；延时3秒，等待数据写入完成后断开与数据库连接
                //         connection.end();

                //         clearTimeout(connectionTimeout);
                //     }, 3000);
            // }
            
        });

    }).on('error',function(err){
        console.log(err + "------获取视频链接请求错误");
        return;
    })
}

//保存图片到本地
function saveCoverImage(item){
    
    image_url = "http://www.2020kkk.com"+ item.cover_img;

    //替换标题中所有  /
    var replace_title = item.title.replace(/\//g, '-');

    //设置保存图片的名称
    var image_local_url = './coverImage/'+ i + replace_title + '.jpg';

    var readerStream = request(image_url);//请求图片
    var writeStream = fs.createWriteStream(image_local_url);//写入图片到本地

    readerStream.pipe(writeStream);

    //请求图片失败处理
    readerStream.on('error',function(err){
        if(err){
            console.log(i +"图片获取失败" + err);
        }
        return;
    });

    //插入数据至video_info表中
    var insert_video_Info = "insert into video_info(`cover`,`title`,`state`,`type`,`director`,`region`,`time`,`starring`,`plot`) values (?,?,?,?,?,?,?,?,?)";
    var video_Info_value = [image_local_url,item.title,item.state,item.type,item.director,item.region,item.time,item.starring,item.plot];

    connection.query(insert_video_Info,video_Info_value,function(err,result){
        if(err){
            console.log("insert video_info data error",err.message);
            return;
        }
        //console.log(result);
    });
}

//创建info表
//create table `video_info`(`video_id` INT NOT NULL AUTO_INCREMENT,`cover` VARCHAR(255),`title` VARCHAR(100)NOT NULL,`state` VARCHAR(50),`type` VARCHAR(50),`director` VARCHAR(50),`region` VARCHAR(20),`time` VARCHAR(20),`starring` VARCHAR(100),`plot` TEXT,PRIMARY KEY(`video_id`));
//创建link表
//create table `video_link`(`video_id` INT NOT NULL AUTO_INCREMENT,`m3u8` VARCHAR(255),`mangguo` VARCHAR(255),`youku` VARCHAR(255),`tengxun` VARCHAR(255),`qiyi` VARCHAR(255),`link` VARCHAR(255),FOREIGN KEY(`video_id`) REFERENCES video_info(`video_id`));

//创建视频地址表 10个; m3u8云播, 芒果TV，优酷视频，腾讯视频，奇异视频，link在线, 搜狐视频， 乐视视频，土豆视频， pptv
//create table `pptv`(`video_id` INT NOT NULL,`tab_video_number` INT NOT NULL,`tab_video_link` VARCHAR(255),FOREIGN KEY(`video_id`) REFERENCES video_info(`video_id`));