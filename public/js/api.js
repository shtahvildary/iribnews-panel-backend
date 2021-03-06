(function ($) {
    $(function () {

    }); // end of document ready
})(jQuery); // end of jQuery name space

var post = function (endpoint, data, callback) {
    // console.log(data)
    var request = {
        method: "POST",

        // url: "http://172.16.17.149:5010" +endpoint,
        // url: "http://localhost:5010" +endpoint,
        // url: "http://192.168.1.7:5010" + endpoint,
        // url: "http://172.20.10.7:5010" + endpoint,
        url: endpoint,
        data: data,
        datatype: 'application/json',
        headers: {
            'x-access-token': $.cookie("token"),
        },
        statusCode: {
            401: function () {

                post('/users/logout');

                $.removeCookie('token', {
                    path: '/'
                });
                if (!$.cookie("token")) {
                    window.location.replace("/login.html");
                }
            }
        }
    }
    if (data) {
        if (data.formData) {
            request.data = data.formData;
            request.contentType = false;
            request.processData = false;
            request.datatype = "multipart/formdata";
        }
    }
    $.ajax(request)
        .done(function (msg) {
            callback(msg)
        });
}