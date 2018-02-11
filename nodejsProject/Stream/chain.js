/*
* 链式流；实现压缩和解压文件
*/

var fs = require('fs');

var zlib = require('zlib');

// var readerStream = fs.createReadStream('input.txt');

// //压缩指定文件input.txt 为 input.txt.gz
// readerStream
// .pipe(zlib.createGzip())
// .pipe(fs.createWriteStream("input.txt.gz"));

// console.log("文件压缩完成");

//解压缩文件
var readerStream2 = fs.createReadStream("input.txt.gz");

//解压指定文件input.txt.gz 为 input.txt
readerStream2
.pipe(zlib.createGzip())
.pipe(fs.createWriteStream("input.txt"));

console.log("文件解压完成");
