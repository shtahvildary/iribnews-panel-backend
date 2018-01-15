(function ($) {
    
    $(function () {
        post('/messages/select/last/date',{token:$.cookie("token")},function(response){
            // console.log({token:$.cookie("token")})
            // console.log('last messages',response)
            response.messages.map(function(item){
            $('#last-messages').append(`<li class="collection-item">
            
            <p>`+item.message+`</p>
            
          </li>`);
          });
        })
    });
})(jQuery);