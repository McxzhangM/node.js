/*
*global对象
*/

function printFilepath(){
    console.log(__filename);
}

function printDirpath(){
    console.log(__dirname);
}

var t = setTimeout(printFilepath,3000);

clearTimeout(t);

console.log("当前目录" + process.cwd());