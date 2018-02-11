// //主函数
// function main(callback){

//     console.log("需要先执行的主函数");

//     var a = 9;
//     var b = 6;

//     return callback(a,b);
// }

// //回调函数
// function callback(m,n){

//     var res = m + n;

//     return res;
// }
// console.log(main(callback));

function async(){

    var p = new Promise(function(resolve,reject){

        setTimeout(function(){
            console.log("首要执行的内容");
            resolve("Promise状态改变后执行内容");
        },2000)
        
    });

    return p;
}

function async2(){

    var p2 = new Promise(function(resolve,reject){

        setTimeout(function(){
            console.log("首要执行的内容2");
            resolve("Promise状态改变后执行内容2");
        },3000)
        
    });

    return p2;
}

function async3(){
    var p3 = new Promise(function(resolve,reject){

        setTimeout(function(){
            console.log("首要执行的内容3");
            resolve("Promise状态改变后执行内容3");
        },4000)
        
    });

    return p3;
}

//多个回调函数嵌套使用
    // async()
    // .then(function(data){
    //     console.log(data + "async1");
    //     return async2();
    // })
    // .then(function(data){
    //     console.log(data + "async2");
    //     return async3();
    // })
    // .then(function(data){
    //     console.log(data + "async3");
    // })

//promise中执行成功和失败
    // function getAge(age){
    //     var q = new Promise(function(resolve,reject){
    //         if(age > 3){

    //             resolve(1);
    //         }else{
    //             reject(0);
    //         }
    //     })

    //     return q;
    // }

    // getAge(1).then(
    //     function(data){
    //         console.log(data);
    //     },
    //     function(reason,data){
    //         console.log("reason:"+ reason + "data:" + data);
    //     }
    // )

Promise
.all([async(),async2(),async3()])
.then(function(results){
    console.log(results);
})
.catch(function(reason){
    console.log(reason);
});


//race用于以最快执行为标准，执行回调方法
    // //请求某个图片资源
    // function requestImg(){
    //     var p = new Promise(function(resolve, reject){
    //         var img = new Image();
    //         img.onload = function(){
    //             resolve(img);
    //         }
    //         img.src = 'xxxxxx';
    //     });
    //     return p;
    // }

    // //延时函数，用于给请求计时
    // function timeout(){
    //     var p = new Promise(function(resolve, reject){
    //         setTimeout(function(){
    //             reject('图片请求超时');
    //         }, 5000);
    //     });
    //     return p;
    // }

    // Promise
    // .race([requestImg(), timeout()])
    // .then(function(results){
    //     console.log(results);
    // })
    // .catch(function(reason){
    //     console.log(reason);
    // });