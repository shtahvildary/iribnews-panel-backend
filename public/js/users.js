(function($){
    //update user profile
    $(function(){
        // if ($.cookie("token")&&!$.cookie("id")) {
        //     window.location.replace("../login.html");
        // }
        // isLoggedin();
        $("#btnUpdateUser").click(function(){
            var firstName=$("#first_name").val();
            var lastName=$("#last_name").val();
            var email=$("#email").val();
            var phoneNumber=$("#phone").val();
            
            // var password;
            // var status;
            // var permitedChannelsId;
            updateUser({
                // username:username,
                // password:password,
                firstName:firstName,
                lastName:lastName,
                email:email,
                phoneNumber:phoneNumber,
                // status:status,
                // permitedChannelsId:permitedChannelsId,
            });
        });
    });
    var updateUser=function(user){
        post('/users/update',user,function(response){
            if (response.user == false) {
                alert("ثبت اطلاعات با موفقیت همراه نبود. لطفا دوباره سعی کنید")
            } else {
                alert("ثبت اطلاعات با موفقیت انجام شد")
                
                window.location.replace("../index.html")
                
            }
        })
    }
})(jQuery);
