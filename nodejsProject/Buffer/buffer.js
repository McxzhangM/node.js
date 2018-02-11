var event = require("events");

var eventEmit = new event.EventEmitter();

eventEmit.on("error",function(err){
    console.log("emit error function" + err);
});

const buff = Buffer.from('cxzhang5','ascii');

// console.log(buff.toString('hex'));

// console.log(buff.toString('base64'));

//设置一个长度为10的变量，默认用0填充
const buf1 = Buffer.alloc(10);
 
//设置一个长度为15的变量，用2填充
const buf2 = Buffer.alloc(15,2);
 
const buf3 = Buffer.allocUnsafe(10);

const buf4 = Buffer.from([1,2,3]);

const buf = Buffer.alloc(50);

var len = buf.write("456");

// console.log(buf);

// console.log(buf.toString(undefined,0,2));


//buffer设置存储字符串or int类型数据，from和alloc两种不同方法

const buffArr = Buffer.alloc(37);

// for (var i = 0 ; i < 26 ; i++) {
//     buffArr[i] = i + 97;
// }

buffArr.write("979899100","ascii");

console.log(buffArr.toString(undefined,0));

var json = buffArr.toJSON(buffArr);

console.log(json);


var bufFrom = Buffer.from([2,3,5]);

var fromJson = bufFrom.toJSON(bufFrom);

//console.log(fromJson);