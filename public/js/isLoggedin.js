(function isloggedin($){
    //update user profile
    $(function () {
        if (!$.cookie("token")) {

            window.location.replace("../login.html");
        }
    })
})(jQuery)