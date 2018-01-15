(function ($) {
    $(function () {
        // console.log('test auth')
        $( "#btnsubmit" ).click(function() {
            var username=$("#username").val();
            var password=$("#password").val();
            // console.log(username,password);
            login({username:username,password:password});
          });
        
    }); // end of document ready
    var register=function(user){
        post('/users/register',user,function(response){
            if(response.auth==false){
                alert("ثبت نام با موفقیت همراه نبود. لطفا دوباره سعی کنید")
            }
            else{
                $.cookie("token", response.token);
            }
        });
    }
    var login=function(auth){
        // console.log('hey')
        
        post('/users/login',auth,function(response){
            // console.log('response:',response)
            if(response.auth==false){
                alert("عملیات ورود با موفقیت همراه نبود. لطفا دوباره سعی کنید.")
            }
            else{
                //console.log(response.token)
                // console.log(response.cookie)
                //$.cookie("token", response.token);
                $.cookie("token", JSON.stringify(response.cookie));
                 window.location.replace("index.html");
                //  window.location.href="index.html";
                
            }
        });
    }
})(jQuery); // end of jQuery name space