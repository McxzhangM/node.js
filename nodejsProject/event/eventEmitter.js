
//引入events模块
var event = require('events');

//创建eventEmitter对象
var eventEmitter = new event.EventEmitter();

//创建事件处理程序
var connectHandle = function connected(){
    console.log('链接成功');

    //触发事件
    eventEmitter.emit('data_received');
}

//绑定 connectHandle事件
eventEmitter.on('connected',connectHandle);

//绑定 data_received事件
eventEmitter.on('data_received',function data_received(){
    console.log('数据接受');
});

//eventEmitter.emit('connected');


//监听器 1
var listener1 = function listener1(){
    console.log("监听器 listener1 执行");
}

//监听器 2
var listener2 = function listenner2(){
    console.log("监听器 listenner2 执行");
}

eventEmitter.on("listener",listener1);

eventEmitter.addListener("listener",listener2);

var eventEmitterListener = require("events").EventEmitter.listenerCount(eventEmitter,"listener");

console.log(eventEmitterListener + "个监听器监听连接事件");

//触发 listener 监听事件
eventEmitter.emit("listener");

//移除监听事件 listener1 
eventEmitter.removeListener("listener",listener1);
console.log("移除监听器listener1");

eventEmitter.emit("listener");

eventEmitterListener = require("events").EventEmitter.listenerCount(eventEmitter,"listener");

console.log(eventEmitterListener + "个监听器监听连接事件");