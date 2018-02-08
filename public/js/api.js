(function ($) {
    $(function () {


    }); // end of document ready
})(jQuery); // end of jQuery name space

var post = function (endpoint, data, callback) {
    $.ajax({
            method: "POST",

            // url: "http://172.16.17.149:5010" +endpoint,
            // url: "http://192.168.1.7:5010" + endpoint,
            url: "http://172.20.10.7:5010" + endpoint,
            // url: "http://172.20.10.7:5010" + endpoint,
            //            url: "http://178.33.79.204:5010" +endpoint,
            data: data,
            datatype:'application/json',
            headers: {
                'x-access-token': $.cookie("token"),
                
            },
            statusCode:{
                401:function () {

                    post('/users/logout');
        
                    $.removeCookie('token', {
                        path: '/'
                    });
                    if (!$.cookie("token")) {
                        window.location.replace("/login.html");
                    }
        
                }
            }
        })
        .done(function (msg) {
            // console.log(msg)
            callback(msg)
        });
}