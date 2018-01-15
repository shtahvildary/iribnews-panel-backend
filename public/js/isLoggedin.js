(function($){
    //update user profile
    $(function isLoggedin(){
        if (!$.cookie("token")) {
            window.location.replace("../login.html");
        };
    })
})(jQuery)