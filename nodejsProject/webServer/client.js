var http = require("http");

var options = {
    host: "10.5.114.77",
    port: "8889",
    path: "/index.html",
};

var callback = function(res){

    var body = "";

    res.on("data",function(data){
        body += data;
    });

    res.on("end",function(){
        console.log(body);
    });
}

var req = http.request(options, callback);

req.end();