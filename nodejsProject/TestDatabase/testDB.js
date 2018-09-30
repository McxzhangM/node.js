/*
*创建表,插入数据
*/
var mysql = require('mysql');

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '173.gtf.664',
    database : 'testDB'
});

connection.connect();

////创建表
// var creTab = "create table `content_tab`(" +
//              "`id` INT NOT NULL AUTO_INCREMENT," +
//              "`title` VARCHAR(100) NOT NULL," +
//              "`content` VARCHAR(100) NOT NULL," +
//              "PRIMARY KEY(`id`)" +
//              ")";

//批量插入数据
var insertDB = "INSERT INTO content_tab(`title`,`content`) VALUES ?";
var insertParams = [["标题党4","标题党4的内容"],["标题党5","标题党内容5"]];

connection.query(insertDB,[insertParams],function(err,result){
    if(err){
        console.log("create table error",err.message);
        return;
    }

    console.log(result);
});

connection.end();