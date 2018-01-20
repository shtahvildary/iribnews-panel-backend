(function ($) {
    
    $(function () {
        post('/messages/select/last/date',{token:$.cookie("token")},function(response){
            // console.log({token:$.cookie("token")})
            // console.log('last messages',response)
            response.messages.map(function(item){
            $('#last-messages').append(`<li class="collection-item">
            
            <p>` + (item.type == 'video' ? item.caption+ `<p><i class="material-icons">movie</i></p>`:
            (item.type == 'photo' ? item.caption+`<p><i class="material-icons">photo</i></p>` :
            (item.type == 'voice'||item.type =='audio'? item.audioTitle+`<p><i class="material-icons">audiotrack</i></p>` :
            (item.type == 'text' ? item.message :
            (item.type == 'document' ? item.fileName :'')))))+ `</p>
            
          </li>`);
          });
        })
    });
})(jQuery);