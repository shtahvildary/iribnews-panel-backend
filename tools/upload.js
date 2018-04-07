const request = require('request');
const fs = require("fs");

var uploader = function (path,callback) {
    var link="http://localhost:5010"+path;
    console.log("linkemun   ",link)
    // request.post('http://192.168.1.4:9001/upload', {
        request.post('http://localhost:9001/upload/http', {
        json: {
            link
        },
        headers: {
            clientid: "123",
        }
    // }, callback);
}, function(err,body,response){
    console.log("link: ",path)
    fs.unlink("public"+path, (err) => {
        if (err) throw err;
        console.log(path+' was deleted');
        callback(err,body,response);
      });
});
}

module.exports = uploader;