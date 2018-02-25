(function ($) {
    $(function () {
        // console.log('test auth')
        $( "#btnsubmit" ).click(function() {
            var username=$("#username").val().toLowerCase();
            var password=$("#password").val();
            // console.log(username,password);
            login({username:username,password:password});
          });
        
    }); // end of document ready

    var login=function(auth){
        // console.log('hey')
        
        post('/users/login',auth,function(response){
            console.log('response: ',response)
            
            // console.log('response:',response)
            if(response.auth==false){
                alert("عملیات ورود با موفقیت همراه نبود. لطفا دوباره سعی کنید.")
            }
            else{
               
                $.cookie("token", JSON.stringify(response.cookie));
                 window.location.replace("index.html");
                
            }
        });
    }
})(jQuery); // end of jQuery name space