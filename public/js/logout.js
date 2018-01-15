(function ($) {
    $(function () {
        $(".logout").click(function () {

            post('/users/logout');

            $.removeCookie('token', {
                path: '/'
            });
            if (!$.cookie("token")) {
                window.location.replace("/login.html");
            }

        })
    }); // end of document ready
})(jQuery); // end of jQuery name space