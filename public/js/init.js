(function($){


  //console.log("token",$.cookie("token"))
   if(!$.cookie("token")){
     window.location.replace("../login.html");
   }
  
   $('select').material_select();
   
   $('#goTop').click(function(){

     $('html, body').animate({
       scrollTop: $("body").offset().top
      }, 800, function(){
        
        // Add hash (#) to URL when done scrolling (default click behavior)
        // window.location.hash = hash;
      });
    })
      

  $(function(){

    $('.button-collapse').sideNav();
    $('.parallax').parallax();

    $('.button-collapse').sideNav({
      menuWidth: 200, // Default is 300
      edge: 'right', // Choose the horizontal origin
      
    }
  );

  }); // end of document ready
})(jQuery); // end of jQuery name space