
var server = require("./server.js");

var router = require("./router.js");

server.serverStart(router.router);