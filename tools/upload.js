const request = require('request');
var uploader = function (link,callback) {
    // request.post('http://192.168.1.4:9001/upload', {
        request.post('http://localhost:9001/upload/http', {
        json: {
            link
        },
        headers: {
            clientid: "123",
        }
    }, callback);
}
module.exports = uploader;