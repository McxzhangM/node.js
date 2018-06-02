var fs = require("fs");
var unzip = require("unzip");

fs.createReadStream('C:/Users/Administrator/Desktop/1c9df54d8be74c29b0f8e875c662ddb5_iflyglobalbar.zip')
.pipe(unzip.Extract({ path:'./unzip_dir'}));