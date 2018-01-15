(function($){


  //console.log("token",$.cookie("token"))
   if(!$.cookie("token")){
     window.location.replace("../login.html");
   }


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