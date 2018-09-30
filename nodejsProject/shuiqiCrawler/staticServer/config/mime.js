const path = require('path');

const mimeTypes = {
    "js" : "application/x-javascript",
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "json": "application/json"
}

const lookup = function(pathName){
    let ext = path.extname(pathName);
    ext = ext.split('.').pop();
    return mimeTypes[ext] || mimeTypes['txt'];
}

module.exports = {
    lookup
};